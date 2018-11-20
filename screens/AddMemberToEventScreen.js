import React, { Component } from 'react';
import {
  List,
  ListItem,
  Thumbnail,
  Right,
  Left,
  Body,
  Text,
  Button,
  Icon,
} from 'native-base';
import { makeRef } from '../server/firebaseconfig';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

export class Friends extends Component {
  constructor() {
    super();
    this.state = {
      eventMemberProfiles: [],
      friendProfiles: [],
    };
  }

  componentDidMount() {
    let friendsArr = [];
    let eventMembersArr = [];

    // all of user's friends
    const usersFriendsRef = makeRef(`/users/${this.props.user}/friends`);
    usersFriendsRef.on('value', snapshot => {
      friendsArr = Object.keys(snapshot.val());
    });
    // all of event's members
    const eventMembersRef = makeRef(`/events/${this.props.event}/members`);
    eventMembersRef.on('value', snapshot => {
      eventMembersArr = Object.entries(snapshot.val());
    });

    // get usernames
    friendsArr.forEach(friend => {
      const friendProfileRef = makeRef(`/profiles/${friend}`);
      friendProfileRef.once(value => {
        this.setState({
          friendProfiles: this.state.friendProfiles.push(value),
        });
      });
    });

    eventMembersArr.forEach(member => {
      const eventMembersArrProfileRef = makeRef(`/profiles/${member}`);
      eventMembersArrProfileRef.once(value => {
        this.setState({
          eventMemberProfiles: this.state.eventMemberProfiles.push(value),
        });
      });
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.props.friends || !this.state.friends) {
      return <Text>You don't have any friends!</Text>;
    }
    return (
      <List>
        {this.state.friends.map(friend => (
          <ListItem avatar key={friend.username}>
            <Left>
              <Thumbnail source={{ uri: friend.imageUrl }} />
            </Left>
            <Body>
              <Text>{friend.username}</Text>
            </Body>
            <Right />
          </ListItem>
        ))}
        <ListItem>
          <Left />
          <Body />
          <Right flexGrow={5}>
            <Button iconLeft onPress={() => navigate('AddFriend')}>
              <Icon type="MaterialIcons" name="add-circle" />
              <Text>Add Friend</Text>
            </Button>
          </Right>
        </ListItem>
      </List>
    );
  }
}

const mapState = state => {
  return {
    user: state.user.currentUser.id,
    event: state.event.eventId,
  };
};
export default connect(mapState)(withNavigation(Friends));
