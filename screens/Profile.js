import React from 'react';
import { ScrollView, StyleSheet, Image, StatusBar, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Container, Text, Title, Card, CardItem, Body, Accordion, Left, Right, ListItem, Icon, Button, Input, Item, H1, ActionSheet, Form, View } from 'native-base';
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
      value2: '',
      friends: []
    }
  }
  static navigationOptions = {
    title: 'Links',
  };

  componentDidMount(){
    this.userRef = makeRef(`/users/${this.props.user.currentUser.id}`)
    this.profileRef = makeRef(`/profiles/${this.props.user.currentUser.id}`)
    this.userRef.on('value', (snapshot) => {
      const user = snapshot.val()
      const friends = []
      Object.keys(user.friends).forEach(id => {
        const friendRef = makeRef(`/profiles/${id}`)
        friendRef.on('value', snapshot => {
          friends.push(snapshot.val())
        })
      })
      this.setState({user, friends})
    })
    this.profileRef.on('value', (snapshot) => {
      this.setState({profile: snapshot.val()})
    })
    this.friendRef = (id) => makeRef(`/users/${id}`)
  }

  componentWillUnmount(){
    this.userRef.off()
    this.profileRef.off()
  }

  handleEditing = (editing, value, value2='') => {
    this.setState({
      editing,
      value,
      value2
    })
  }
  handleSubmit = () => {
    if(this.state.editing === 'username'){
      this.profileRef.update({
        username: this.state.value
      })
    }
    else if(this.state.editing === 'name'){
      this.userRef.update({
        firstName: this.state.value,
        lastName: this.state.value2
      })
    }
    else {
      this.userRef.update({
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
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <ScrollView >
          <Card>
            <CardItem header bordered>
            <Left />
              <Body flexGrow={2}>
                {this.state.editing === 'name'
                  ?
                  <Item rounded flex={4}>
                    <Input
                      value={this.state.value}
                      onChangeText={(value) => this.setState({value})}
                      />
                      <Input
                        value={this.state.value2}
                        onChangeText={(value2) => this.setState({value2})}
                      />
                  </Item>
                  :
                  <H1>{this.state.user.firstName} {this.state.user.lastName}</H1>
                }
              </Body>
              <Right>
                {this.state.editing === 'name'
                  ?
                  <Button icon transparent onPress={this.handleSubmit}>
                    <Icon type='MaterialCommunityIcons' name='content-save' />
                    </Button>
                  :
                  <Button icon transparent onPress={()=>this.handleEditing('name', this.state.user.firstName, this.state.user.lastName)} >
                   <Icon type='MaterialCommunityIcons' name='pencil' />
                  </Button>
                }
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: this.state.profile.imageUrl}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem bordered>
              <Left flexGrow={5}>
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
              <Left flexGrow={3.5}>
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
              <Left flexGrow={7}>
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
          <Accordion dataArray={dataArray} icon='arrow-down' expandedIcon='arrow-up' />
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
    justifyContent: 'center'
  },
});

const mapState = state => ({
  user: state.user
})

export default connect(mapState)(Profile)
