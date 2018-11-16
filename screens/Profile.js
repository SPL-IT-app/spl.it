import React from 'react';
import { ScrollView, StyleSheet, Image, StatusBar, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Container, Text, Title, Card, CardItem, Body, Accordion, Left, Right, ListItem, Icon, Button, Input, Item } from 'native-base';
import MyHeader from '../components/Header';
import { connect } from 'react-redux'
import { makeRef } from '../server/firebaseconfig'

class Profile extends React.Component {

  constructor(){
    super()
    this.state = {
      user: {},
      profile: {},
      editing: '',
      value: '',
      margin: 400
    }
  }
  static navigationOptions = {
    title: 'Links',
  };

  componentDidMount(){
    this.userRef = makeRef(`/users/${this.props.user.currentUser.id}`)
    this.profileRef = makeRef(`/profiles/${this.props.user.currentUser.id}`)
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.userRef.on('value', (snapshot) => {
      this.setState({user: snapshot.val()})
    })
    this.profileRef.on('value', (snapshot) => {
      this.setState({profile: snapshot.val()})
    })
  }

  componentWillUnmount(){
    this.userRef.off()
    this.profileRef.off()
  }

  handleEditing = (editing, value) => {
    this.setState({
      editing,
      value
    })
  }
  handleSubmit = () => {
    if(this.state.editing === 'username'){
      const profileRef = makeRef(`/profiles/${this.props.user.currentUser.id}`)
      profileRef.update({
        username: this.state.value
      })
    } else {
      const userRef = makeRef(`/users/${this.props.user.currentUser.id}`)
      userRef.update({
        [this.state.editing]: this.state.value
      })
    }
    this.setState({
      editing: '',
      value: ''
    })
  }

  render() {
    const dataArray=[
      {title: 'Groups', content: 'No Groups Yet'},
      {title: 'Friends', content: 'No Friends Yetdscacaaaaaaaaaaaaaaaaaaaaaaaaaalasdbckhbasdchkbasdklihjcbasdlihcbalskdhcblasdhcblaksdbclakdsbclkhasdfvblacaaaaaaaaaaaaaaaaaaaaaaaaaalasdbckhbasdchkbasdklihjcbasdlihcbalskdhcblasdhcblaksdbclakdsbclkhasdfvblkhasdvlkjacaaaaaaaaaaaaaaaaaaaaaaaaaalasdbckhbasdchkbasdklihjcbasdlihcbalskdhcblasdhcblaksdbclakdsbclkhasdfvblkhasdvlkjacaaaaaaaaaaaaaaaaaaaaaaaaaalasdbckhbasdchkbasdklihjcbasdlihcbalskdhcblasdhcblaksdbclakdsbclkhasdfvblkhasdvlkjacaaaaaaaaaaaaaaaaaaaaaaaaaalasdbckhbasdchkbasdklihjcbasdlihcbalskdhcblasdhcblaksdbclakdsbclkhasdfvblkhasdvlkjacaaaaaaaaaaaaaaaaaaaaaaaaaalasdbckhbasdchkbasdklihjcbasdlihcbalskdhcblasdhcblaksdbclakdsbclkhasdfvblkhasdvlkjkhasdvlkjad'}
    ]
    return (
      <Container>
        <MyHeader title='Profile' />
        {/* <KeyboardAvoidingView behavior='padding'> */}
        <ScrollView style={styles.container}>
          <Card>
            <CardItem header>
            <Left />
              <Body>
                <Text>{this.state.user.firstName} {this.state.user.lastName}</Text>
              </Body>
              <Right />
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: this.state.profile.imageUrl}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text note>Username:</Text>
                {this.state.editing === 'username' ?
                  <Item rounded>
                    <Input
                      value={this.state.value}
                      onChangeText={(value) => this.setState({value})}
                      />
                  </Item>
                  :
                  <Text>{this.state.profile.username} </Text>
                }
                </Left>
              <Body>
              </Body>
              <Right>
                {this.state.editing === 'username'
                ?
                <Button icon transparent onPress={this.handleSubmit}>
                  <Icon type='MaterialCommunityIcons' name='content-save' />
                </Button>

                :
                <Button icon transparent onPress={()=>this.handleEditing('username', this.state.profile.username)}>
                  <Icon type='MaterialCommunityIcons' name='pencil' />
                </Button>
              }
              </Right>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text note>Phone Number:</Text>
                {this.state.editing === 'phone' ?
                  <Item rounded>
                    <Input
                      value={this.state.value}
                      onChangeText={(value) => this.setState({value})}
                      />
                  </Item>
                  :
                  <Text>{this.state.user.phone} </Text>
                }
              </Left>
              <Body>
              </Body>
              <Right>
              {this.state.editing === 'phone'
                ?
                <Button icon transparent onPress={this.handleSubmit}>
                  <Icon type='MaterialCommunityIcons' name='content-save' />
                </Button>

                :
                <Button icon transparent onPress={()=>this.handleEditing('phone', this.state.user.phone)}>
                  <Icon type='MaterialCommunityIcons' name='pencil' />
                </Button>
              }
              </Right>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text note>Email:</Text>
                {this.state.editing === 'email' ?
                  <Item rounded>
                    <Input
                      value={this.state.value}
                      onChangeText={(value) => this.setState({value})}
                      />
                  </Item>
                  :
                  <Text>{this.state.user.email} </Text>
                }
              </Left>
              <Body>
              </Body>
              <Right>
              {this.state.editing === 'email'
                ?
                <Button icon transparent onPress={this.handleSubmit}>
                  <Icon type='MaterialCommunityIcons' name='content-save' />
                </Button>

                :
                <Button icon transparent onPress={()=>this.handleEditing('email', this.state.user.email)}>
                  <Icon type='MaterialCommunityIcons' name='pencil' />
                </Button>
              }

              </Right>
            </CardItem>
          </Card>
              <Accordion dataArray={dataArray} icon='add' expandedIcon='remove' />
        </ScrollView>
        {/* </KeyboardAvoidingView> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

const mapState = state => ({
  user: state.user
})

export default connect(mapState)(Profile)
