import React from 'react';
import { ScrollView, StyleSheet, Image, StatusBar } from 'react-native';
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
      value: ''
    }
  }
  static navigationOptions = {
    title: 'Links',
  };

  componentDidMount(){
    const userRef = makeRef(`/users/${this.props.user.currentUser.id}`)
    const profileRef = makeRef(`/profiles/${this.props.user.currentUser.id}`)
    userRef.on('value', (snapshot) => {
      this.setState({user: snapshot.val()})
    })
    profileRef.on('value', (snapshot) => {
      this.setState({profile: snapshot.val()})
    })
  }

  handleEditing = (editing, value) => {
    this.setState({
      editing,
      value
    })
  }

  render() {
    const dataArray=[
      {title: 'Groups', content: 'No Groups Yet'},
      {title: 'Friends', content: 'No Friends Yet'}
    ]
    return (
      <Container>
        <MyHeader title='Profile' />
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
                <Button icon transparent onPress={()=>this.handleEditing('username', this.state.profile.username)}>
                  {this.state.editing === 'username'
                  ?
                  <Icon type='MaterialCommunityIcons' name='content-save' />
                  :
                  <Icon name='create' />

                }
                </Button>
              </Right>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text note>Phone Number:</Text>
                <Text>{this.state.user.phone} </Text>
              </Left>
              <Body>
              </Body>
              <Right>
                <Button icon transparent>
                  <Icon name='create' />
                </Button>
              </Right>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text note>Email:</Text>
                <Text>{this.state.user.email} </Text>
              </Left>
              <Body>
              </Body>
              <Right>
                <Button icon transparent>
                  <Icon name='create' />
                </Button>
              </Right>
            </CardItem>
          </Card>
              <Accordion dataArray={dataArray} icon='add' expandedIcon='remove' />
        </ScrollView>
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
