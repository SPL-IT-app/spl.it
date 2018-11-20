import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Text,
  List,
  ListItem,
  Thumbnail,
  Right,
  Left,
  Body,
} from 'native-base';
import { StyleSheet } from 'react-native';
import CheckBox from 'react-native-checkbox-heaven';
import { getTimeFieldValues } from 'uuid-js';
import { makeRef } from '../server/firebaseconfig';


const styles = StyleSheet.create({
  listItem: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  checkbox: {
    paddingBottom: 0,
    margin: 0,
  },
  right: {
    display:'flex',
    justifyContent: 'flex-end'
  }
});

export class EventMembers extends Component {

  componentDidMount() {
    this.usersFriendsRef = makeRef(`/users/${this.props.user}/friends`);
  }
  handleSelect = (val, id) => {
    this.eventRef = makeRef(`/events/${this.props.event}/members`)
    this.eventMemberRef = makeRef(`/events/${this.props.event}/members/${id}`)
    if(val === true) {
      this.eventRef.update({
        [id]: true
      })
    } else if (val === false) {
      this.eventMemberRef.remove()
    }
    console.log("FRIEND SELECTED", val, "USER ID", id)

  }

  render() {
    const { friends } = this.props;
    return (
      <Container>
        <List>
          {friends.map(friend => (
            <ListItem style={styles.listItem} avatar key={friend.profile.username}>
              <Left>
                <Thumbnail source={{ uri: friend.profile.imageUrl }} />
              </Left>
              <Body style={styles.body}>
                <Text>{friend.profile.username}</Text>
              </Body>
              <Right style={styles.right}>
                <CheckBox
                  onChange={(val) => this.handleSelect(val, friend.id)}
                  checked={false}
                  iconName='matCircleMix'
                />
              </Right>
            </ListItem>
          ))}
        </List>
      </Container>
    );
  }
}

const mapState = state => {
  return {
    event: state.event.eventId
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default connect(
  mapState,
  mapDispatch
)(EventMembers);
