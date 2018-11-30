import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Stylesheet,
} from 'react-native';
import {
  Container,
  Text,
  Card,
  CardItem,
  Body,
  Left,
  Right,
  Icon,
  Button,
  Input,
  Item,
  H1,
  Tabs,
  Tab,
  TabHeading,
} from 'native-base';
import MyHeader from '../components/Header';
import { connect } from 'react-redux';
import firebase, { makeRef } from '../server/firebaseconfig';
import { Friends, Groups } from '../components';
import Dialog from 'react-native-dialog';
import { ImagePicker, Permissions } from 'expo';
import { RNS3 } from 'react-native-aws3';
require('../secrets');
import { removeUser } from '../store'


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  card: {
    borderColor: 'transparent',
    shadowOpacity: 0,
  },
  buttonText: {
    textAlign: 'center',
    letterSpacing: 2,
    color: 'white',
  },
  button: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
});

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      profile: {},
      editing: '',
      value: '',
      value2: '',
      friends: [],
      dialogVisible: false,
      image: null,
    };
  }
  static navigationOptions = {
    title: 'Links',
  };

  componentDidMount() {
    this.userRef = makeRef(`/users/${this.props.user.id}`);
    this.profileRef = makeRef(`/profiles/${this.props.user.id}`);
    this.userRef.on('value', snapshot => {
      user = snapshot.val();
      this.setState({ user });
    });
    this.profileRef.on('value', snapshot => {
      profile = snapshot.val();
      this.setState({ profile });
    });
    this.friendsRef = makeRef(`/users/${this.props.user.id}/friends`);
    this.friendsRef.on('child_added', snapshot => {
      makeRef(`/profiles/${snapshot.key}`).once('value', snapshot => {
        this.setState({
          friends: [
            ...this.state.friends,
            { ...snapshot.val(), id: snapshot.key },
          ],
        });
      });
    });
    this.friendsRef.on('child_removed', snapshot => {
      makeRef(`/profiles/${snapshot.key}`).once('value', snapshot => {
        this.setState({
          friends: this.state.friends.filter(
            friend => friend.username !== snapshot.val().username
          ),
        });
      });
    });
  }

  componentWillUnmount() {
    this.userRef.off();
    this.profileRef.off();
    this.friendsRef.off();
  }

  handleEditing = (editing, value, value2 = '') => {
    this.setState({
      editing,
      value,
      value2,
    });
  };
  handleSubmit = () => {
    if (this.state.editing === 'username') {
      this.profileRef.update({
        username: this.state.value,
      });
    } else if (this.state.editing === 'name') {
      this.userRef.update({
        firstName: this.state.value,
        lastName: this.state.value2,
      });
    } else {
      this.userRef.update({
        [this.state.editing]: this.state.value,
      });
    }
    this.setState({
      editing: '',
      value: '',
    });
  };

  handleNo = () => {
    this.setState({ dialogVisible: false });
  };

  handleYes = async () => {
    this.setState({ dialogVisible: false });
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    console.log('STATUS', status)
    // let newStatus
    // if( status !== 'granted'){
    //   const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //   newStatus = perm.status
    // }
    // if(newStatus !== 'granted') return
    // || newStatus === 'granted'
    if(status === "granted" ){
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.cancelled) {
        const date = new Date();
        const file = {
          uri: result.uri,
          name: this.props.user.id + date,
          type: 'image/jpg',
        };
        const options = {
          keyPrefix: 'profiles/',
          bucket: 'spl-it',
          region: 'us-east-2',
          accessKey: process.env.S3_API_KEY,
          secretKey: process.env.S3_SECRET_KEY,
          successActionStatus: 201,
        };

        const response = await RNS3.put(file, options);
        if (response.status === 201) {
          makeRef(`/profiles/${this.props.user.id}/imageUrl`).set(
            response.body.postResponse.location
          );
        }
      }

    }
  };

  logout = () => {
    try {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.props.removeUser();
        })
        .finally(() => this.props.navigation.navigate('Login'));
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <Container>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Profile Photo</Dialog.Title>
          <Dialog.Description>
            Do you want to change your profile photo?
          </Dialog.Description>
          <Dialog.Button label="No" onPress={this.handleNo} />
          <Dialog.Button label="Yes" onPress={this.handleYes} />
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
                <Card style={styles.card}>
                  <CardItem header bordered>
                    <Left>
                      <Text>{this.state.image}</Text>
                    </Left>
                    <Body flexGrow={2}>
                      {this.state.editing === 'name' ? (
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
                      {this.state.editing === 'name' ? (
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
                              'name',
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
                  <CardItem
                    button
                    cardBody
                    onLongPress={() => this.setState({ dialogVisible: true })}
                  >
                    <Image
                      source={{ uri: this.state.profile.imageUrl }}
                      style={{ height: 200, width: null, flex: 1 }}
                    />
                  </CardItem>
                  <CardItem bordered>
                    <Left flexGrow={5}>
                      <Text note>Username:</Text>
                      {this.state.editing === 'username' ? (
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
                      {this.state.editing === 'username' ? (
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
                              'username',
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
                      {this.state.editing === 'phone' ? (
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
                      {this.state.editing === 'phone' ? (
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
                            this.handleEditing('phone', this.state.user.phone)
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
                      {this.state.editing === 'email' ? (
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
                      {this.state.editing === 'email' ? (
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
                            this.handleEditing('email', this.state.user.email)
                          }
                        >
                          <Icon type="MaterialCommunityIcons" name="pencil" />
                        </Button>
                      )}
                    </Right>
                  </CardItem>
                </Card>

                <Button
                  block
                  danger
                  onPress={this.logout}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>LOGOUT</Text>
                  <Icon
                    style={styles.logoutIcon}
                    type="MaterialCommunityIcons"
                    name="logout"
                  />
                </Button>
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

const mapState = state => ({
  user: state.user.currentUser,
});

const mapDispatch = dispatch => ({
  removeUser: () => dispatch(removeUser())
})

export default connect(mapState, mapDispatch)(Profile);
