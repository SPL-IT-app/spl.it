import React from 'react';
import { Container, Text, Footer, Button, Icon, Content, FooterTab } from 'native-base'
import { MyHeader } from '../components'
import firebase from '../server/firebaseconfig'
import { removeUser } from '../store'
import { connect } from 'react-redux'
import AllEvents from './AllEvents';

class MoreScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  logout = () => {
    firebase.auth().signOut()
      .then(() => {
        console.log('signed out')
        this.props.removeUser()
        this.props.navigation.navigate('Login')
      }, (error) => {
        console.log('error', error)
      })
  }

  render() {
    return (
      <Container>
        <MyHeader title="More" />
        <Content>
          <Button
            onPress={() => this.props.navigation.navigate('AllEvents', {
              status: false,
            })}
          >
            <Text>Order History</Text>
          </Button>
          <Text>More stuff here!</Text>
          <Text>this is to test logout:</Text>
          {this.props.id ?
            <Text>{this.props.id}</Text> :
            <Text>No ID</Text>
          }

        </Content>

        <Footer>
          <FooterTab>
            <Button danger onPress={this.logout}>
              <Icon type='MaterialCommunityIcons' name='logout' />
              <Text >LOGOUT</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapState = state => ({
  id: state.user.currentUser.id
})

const mapDispatch = dispatch => ({
  removeUser: () => dispatch(removeUser())
})

export default connect(mapState, mapDispatch)(MoreScreen)
