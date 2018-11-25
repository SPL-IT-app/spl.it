import React from "react";
import {
  ScrollView,
  StyleSheet,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Alert
} from "react-native";
import {
  Container,
  Text,
  Title,
  Card,
  CardItem,
  Body,
  Accordion,
  Left,
  Right,
  ListItem,
  Icon,
  Button,
  Input,
  Item,
  H1,
  ActionSheet,
  Form,
  View,
  Thumbnail,
  Tabs,
  Tab,
  TabHeading,
  Header,
  List
} from "native-base";
import MyHeader from "../components/Header";
import { connect } from "react-redux";
import { makeRef } from "../server/firebaseconfig";
import { Friends, Groups } from '../components'
import Dialog from 'react-native-dialog'
import { ImagePicker, FileSystem } from 'expo'
import { storageRef } from '../server/firebaseconfig'

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      profile: {},
      editing: "",
      value: "",
      value2: "",
      friends: [],
      dialogVisible: false,
      image: null
    };
  }
  static navigationOptions = {
    title: "Links"
  };

  componentDidMount() {
    this.userRef = makeRef(`/users/${this.props.user.id}`);
    this.profileRef = makeRef(`/profiles/${this.props.user.id}`);
    this.userRef.on("value", snapshot => {
      user = snapshot.val()
      this.setState({ user })
    });
    this.profileRef.on("value", snapshot => {
      profile = snapshot.val()
      this.setState({ profile })
    });
    this.friendsRef = makeRef(`/users/${this.props.user.id}/friends`)
    this.friendsRef.on('child_added', snapshot => {
      makeRef(`/profiles/${snapshot.key}`).once('value', snapshot => {
        this.setState({friends: [...this.state.friends, {...snapshot.val(), id: snapshot.key}]})
      })
    })
    this.friendsRef.on('child_removed', snapshot => {
       makeRef(`/profiles/${snapshot.key}`).once('value', snapshot => {
         this.setState({friends: this.state.friends.filter(friend => friend.username !== snapshot.val().username)})
       })
    })
  }

  componentWillUnmount() {
    this.userRef.off()
    this.profileRef.off()
    this.friendsRef.off()
  }

  handleEditing = (editing, value, value2 = "") => {
    this.setState({
      editing,
      value,
      value2
    });
  };
  handleSubmit = () => {
    if (this.state.editing === "username") {
      this.profileRef.update({
        username: this.state.value
      });
    } else if (this.state.editing === "name") {
      this.userRef.update({
        firstName: this.state.value,
        lastName: this.state.value2
      });
    } else {
      this.userRef.update({
        [this.state.editing]: this.state.value
      });
    }
    this.setState({
      editing: "",
      value: ""
    });
  };

  handleNo = () => {
    this.setState({dialogVisible: false})
  }

  handleYes = async () => {
    // const Blob = RNFetchBlob.polyfill.Blob
    // const fs = RNFetchBlob.fs
    // window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    // window.Blob = Blob
    // this.setState({dialogVisible: false})
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   allowsEditing: true,
    //   aspect: [4, 3]
    // })
    // const data = await fs.readFile(result.uri, 'base64')
    // const blob = await Blob.build(data, { type: `${mime};BASE64` })
    // storageRef.child(this.props.user.id).put(blob, {contentType: mime })
    // const url = storageRef.child(this.props.user.id).getDownloadURL()
    // if(!result.cancelled){
    //   this.setState({image: url})
    // }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4,3]
    })
    if(!result.cancelled){
      // const fs = new FileSystem
      // let file = await FileSystem.readAsStringAsync(result.uri, {encoding: 'Base64'})
      let file = await FileSystem.readAsStringAsync(result.uri)
      // console.log(file)
      // this.setState({image: file, dialogVisible: false})
      // file = 'data:image/jpeg;base64,' + file
      console.log(file)
      await storageRef.child(this.props.user.id).putString(file, 'raw', {contentType:'image/jpeg'})
      const url = await storageRef.child(this.props.user.id).getDownloadURL()
      console.log(url)
      // this.setState({image: url, dialogVisible: false})
    }

  }

  render() {
    return (
      <Container>
        <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Profile Photo</Dialog.Title>
                <Dialog.Description>Do you want to change your profile photo?</Dialog.Description>
                <Dialog.Button label='No' onPress={this.handleNo} />
                <Dialog.Button label='Yes' onPress={this.handleYes} />
        </Dialog.Container>
        <MyHeader title="Profile" />
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView>
            <Tabs>
              <Tab
                heading={
                  <TabHeading>
                    <Icon type="MaterialCommunityIcons" name="account" />
                    <Text>Profile</Text>
                  </TabHeading>
                }
              >
                <Card>
                  <CardItem header bordered>
                    <Left><Text>{this.state.image}</Text></Left>
                    <Body flexGrow={2}>
                      {this.state.editing === "name" ? (
                        <Item rounded flex={4}>
                          <Input
                            value={this.state.value}
                            onChangeText={value => this.setState({ value })}
                          />
                          <Input
                            value={this.state.value2}
                            onChangeText={value2 => this.setState({ value2 })}
                          />
                        </Item>
                      ) : (
                        <H1>
                          {this.state.user.firstName} {this.state.user.lastName}
                        </H1>
                      )}
                    </Body>
                    <Right>
                      {this.state.editing === "name" ? (
                        <Button icon transparent onPress={this.handleSubmit}>
                          <Icon
                            type="MaterialCommunityIcons"
                            name="content-save"
                          />
                        </Button>
                      ) : (
                        <Button
                          icon
                          transparent
                          onPress={() =>
                            this.handleEditing(
                              "name",
                              this.state.user.firstName,
                              this.state.user.lastName
                            )
                          }
                        >
                          <Icon type="MaterialCommunityIcons" name="pencil" />
                        </Button>
                      )}
                    </Right>
                  </CardItem>
                  <CardItem button cardBody onLongPress={()=>this.setState({dialogVisible:true})}>
                    <Image
                      source={{ uri: this.state.profile.imageUrl }}
                      style={{ height: 200, width: null, flex: 1 }}
                    />
                  </CardItem>
                  <CardItem bordered>
                    <Left flexGrow={5}>
                      <Text note>Username:</Text>
                      {this.state.editing === "username" ? (
                        <Item rounded>
                          <Input
                            value={this.state.value}
                            onChangeText={value => this.setState({ value })}
                          />
                        </Item>
                      ) : (
                        <Text>{this.state.profile.username} </Text>
                      )}
                    </Left>
                    <Body />
                    <Right>
                      {this.state.editing === "username" ? (
                        <Button icon transparent onPress={this.handleSubmit}>
                          <Icon
                            type="MaterialCommunityIcons"
                            name="content-save"
                          />
                        </Button>
                      ) : (
                        <Button
                          icon
                          transparent
                          onPress={() =>
                            this.handleEditing(
                              "username",
                              this.state.profile.username
                            )
                          }
                        >
                          <Icon type="MaterialCommunityIcons" name="pencil" />
                        </Button>
                      )}
                    </Right>
                  </CardItem>
                  <CardItem bordered>
                    <Left flexGrow={3.5}>
                      <Text note>Phone Number:</Text>
                      {this.state.editing === "phone" ? (
                        <Item rounded>
                          <Input
                            value={this.state.value}
                            onChangeText={value => this.setState({ value })}
                          />
                        </Item>
                      ) : (
                        <Text>{this.state.user.phone} </Text>
                      )}
                    </Left>
                    <Body />
                    <Right>
                      {this.state.editing === "phone" ? (
                        <Button icon transparent onPress={this.handleSubmit}>
                          <Icon
                            type="MaterialCommunityIcons"
                            name="content-save"
                          />
                        </Button>
                      ) : (
                        <Button
                          icon
                          transparent
                          onPress={() =>
                            this.handleEditing("phone", this.state.user.phone)
                          }
                        >
                          <Icon type="MaterialCommunityIcons" name="pencil" />
                        </Button>
                      )}
                    </Right>
                  </CardItem>
                  <CardItem bordered>
                    <Left flexGrow={7}>
                      <Text note>Email:</Text>
                      {this.state.editing === "email" ? (
                        <Item rounded>
                          <Input
                            value={this.state.value}
                            onChangeText={value => this.setState({ value })}
                          />
                        </Item>
                      ) : (
                        <Text>{this.state.user.email} </Text>
                      )}
                    </Left>
                    <Body />
                    <Right>
                      {this.state.editing === "email" ? (
                        <Button icon transparent onPress={this.handleSubmit}>
                          <Icon
                            type="MaterialCommunityIcons"
                            name="content-save"
                          />
                        </Button>
                      ) : (
                        <Button
                          icon
                          transparent
                          onPress={() =>
                            this.handleEditing("email", this.state.user.email)
                          }
                        >
                          <Icon type="MaterialCommunityIcons" name="pencil" />
                        </Button>
                      )}
                    </Right>
                  </CardItem>
                </Card>
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Icon type="MaterialIcons" name="group" />
                    <Text>Groups</Text>
                  </TabHeading>
                }
              >
              <Groups groups={this.state.user.groups} />
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Icon type="MaterialIcons" name="contacts" />
                    <Text>Friends</Text>
                  </TabHeading>
                }
              >
                <Friends friends={this.state.friends} />
              </Tab>
            </Tabs>

            <Container />
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // width: '95%',
    // alignItems: 'center',
    justifyContent: "center"
  }
});

const mapState = state => ({
  user: state.user.currentUser
});

export default connect(mapState)(Profile);
