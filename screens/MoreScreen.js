import React from 'react';
import { Container, Text, Footer, Button, Icon, Content, FooterTab } from 'native-base'
import { MyHeader } from '../components'
import firebase from '../server/firebaseconfig'
import { removeUser } from '../store'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
  constainer: {

  },
  logoutButton: {
    flexDirection: 'row',
  },
  logoutText: {
    color: 'white',
  },
  logoutIcon: {
    color: 'white',
  },
});

class MoreScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  logout = () => {
    try {
      firebase.auth().signOut()
        .then(() => {
          this.props.removeUser()
        })
        .finally(() =>
          this.props.navigation.navigate('Login'))
    } catch (err) {
      console.error(err)
    }
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
            <Text>History</Text>
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
            <Button danger onPress={this.logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>LOGOUT</Text>
              <Icon style={styles.logoutIcon} type='MaterialCommunityIcons' name='logout' />
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
