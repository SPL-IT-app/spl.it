import React from 'react';
import { connect } from 'react-redux'
import {AllEvents} from '../screens'

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
