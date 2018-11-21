import React, { Component } from 'react';
import { Container } from 'native-base';
import { Text } from 'react-native';
import { makeRef } from '../server/firebaseconfig';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import {
  EventFriends,
  EventMembers,
  BackButton,
  MyHeader,
} from '../components';

export class AddMemberToEventScreen extends Component {
  constructor() {
    super();
    this.state = {
      eventMemberProfiles: [],
      friendProfiles: [],
    };
  }

  componentDidMount() {
    this.usersFriendsRef = makeRef(`/users/${this.props.user}/friends`);
    this.usersFriendsRef.on('child_added', snapshot => {
      const profileRef = makeRef(`/profiles/${snapshot.key}`);
      profileRef.once('value', profileSnapshot =>
        this.setState({
          friendProfiles: [
            ...this.state.friendProfiles,
            {profile: profileSnapshot.val(), id: snapshot.key},
          ],
        })
      );
    });
    this.usersFriendsRef.on('child_removed', snapshot => {
      const profileRef = makeRef(`/profiles/${snapshot.key}`);
      profileRef.once('value', profileSnapshot => {
        const newArr = [...this.state.friendProfiles].filter(friend => {
          return friend.profile.username !== profileSnapshot.val().username;
        });
        this.setState({ friendProfiles: newArr });
      });
    });


    // all of event's members

    this.eventMembersRef = makeRef(`/events/${this.props.event}/members`);
    this.eventMembersRef.on('child_added', snapshot => {
      const profileRef = makeRef(`/profiles/${snapshot.key}`);
      profileRef.once('value', profileSnapshot =>
        this.setState({
          eventMemberProfiles: [
            ...this.state.eventMemberProfiles,
            profileSnapshot.val(),
          ],
        })
      );
    });
    this.eventMembersRef.on('child_removed', snapshot => {
      const profileRef = makeRef(`/profiles/${snapshot.key}`);
      profileRef.once('value', profileSnapshot => {
        const newArr = [...this.state.eventMemberProfiles].filter(member => {
          return member.username !== profileSnapshot.val().username;
        });
        this.setState({ eventMemberProfiles: newArr });
      });
    });
  }

  componentWillUnmount() {
    this.usersFriendsRef.off();
    this.eventMembersRef.off();
  }

  render() {

    console.log('state====> ', this.state);
    // const { navigate } = this.props.navigation;
    // if (!this.state.friendProfiles) {
    //   return <Text>You don't have any friends!</Text>;
    // }
    return (
      <Container>
        <MyHeader title="Add Members" right={() => <BackButton />} />
        <EventMembers members={this.state.eventMemberProfiles} />
        <EventFriends friends={this.state.friendProfiles} />
      </Container>
    );
  }
}

const mapState = state => {
  return {
    user: state.user.currentUser.id,
    event: state.event.eventId,
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default connect(
  mapState,
  mapDispatch
)(AddMemberToEventScreen);
