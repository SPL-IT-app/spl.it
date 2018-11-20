import React, { Component } from 'react';
import { Container, Text } from 'native-base';
import { connect } from 'react-redux'

export class EventMembers extends Component {

  render() {
    return (
      <Container>
        <Text>EVENT FRIENDS</Text>
      </Container>
    )
  }
}

const mapState = state => {
  return {};
};

const mapDispatch = dispatch => {
  return {}
}

export default connect(mapState, mapDispatch)(EventMembers);
