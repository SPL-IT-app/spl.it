import React from 'react';
import { Container, Text, Footer, Button, Icon, Content, FooterTab } from 'native-base'
import { MyHeader } from '../components'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import {AllEvents} from '../screens'

const styles = StyleSheet.create({

});

class MoreScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    return (
     <AllEvents status={false}/>
    );
  }
}

const mapState = state => ({
  id: state.user.currentUser.id
})

export default connect(mapState)(MoreScreen)
