import React from 'react';
import { ScrollView, StyleSheet, Image, StatusBar } from 'react-native';
import { Container, Text, Title } from 'native-base';
import MyHeader from '../components/Header';
import { connect } from 'react-redux'
import { makeRef } from '../server/firebaseconfig'

class Profile extends React.Component {

  constructor(){
    super()
    this.state = {
      user: {},
      profile: {}
    }
  }
  static navigationOptions = {
    title: 'Links',
  };

  componentDidMount(){
    const userRef = makeRef(`/users/${this.props.user.currentUser.id}`)
    const profileRef = makeRef(`/profiles/${this.props.user.currentUser.id}`)
    userRef.on('value', (snapshot) => {
      debugger
      this.setState({user: snapshot.val()})
    })
    profileRef.on('value', (snapshot) => {
      this.setState({profile: snapshot.val()})
    })
  }

  render() {
    console.log('state', this.state)
    return (
      <Container>
        <MyHeader title='Profile' />
        <ScrollView style={styles.container}>
          {/* <Title>User</Title>
          <Text></Text> */}
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
