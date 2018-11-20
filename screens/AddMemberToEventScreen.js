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
    // all of user's friends
    this.usersFriendsRef = makeRef(`/users/${this.props.user}/friends`);
    console.log("REFERENCE =====> ", `/users/${this.props.user}/friends`)
    this.usersFriendsRef.on("value", snapshot => {
      console.log("SNAPSHOT ====>", snapshot.val())
      this.friendsArr = Object.keys(snapshot.val());
      this.friendsArr.forEach(friend => {
        this.friendProfileRef = makeRef(`/profiles/${friend}`);
        this.friendProfileRef.once("value", value => {
          this.setState({
            friendProfiles: [...this.state.friendProfiles, value.val()],
          });
        });
      });
    });

    // all of event's members
    this.eventMembersRef = makeRef(`/events/${this.props.event}/members`);
    this.eventMembersRef.on('value', snapshot => {
      this.eventMembersArr = Object.entries(snapshot.val());
      this.friendsArr = this.friendsArr.filter(friend => {
        return !this.eventMembersArr.includes(friend);
      });
      this.eventMembersArr.forEach(member => {
        this.eventMembersArrProfileRef = makeRef(`/profiles/${member}`);
        this.eventMembersArrProfileRef.once("value", value => {
          this.setState({
            eventMemberProfiles: [...this.state.eventMemberProfiles, value.val()],
          });
        });
      });
    });
  }

  // componentWillUnmount() {
  //   this.usersFriendsRef.off();
  //   this.eventMembersRef.off();
  // }

  render() {
    // const { navigate } = this.props.navigation;
    // if (!this.state.friendProfiles) {
    //   return <Text>You don't have any friends!</Text>;
    // }
    return (
      <Container>
        <MyHeader title="Add Members" right={() => <BackButton />} />
        <EventMembers />
        <EventFriends />
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
  return {}
}

export default connect(mapState, mapDispatch)(AddMemberToEventScreen);
