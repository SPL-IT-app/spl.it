import React, { Component } from 'react';
import { Content, Container, List, ListItem } from 'native-base';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { makeRef } from '../server/firebaseconfig';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import {
  EventFriends,
  EventMembers,
  BackButton,
  MyHeader,
} from '../components';
import { Status } from '../screens';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  eventFriends: {
    height: '50%',
  },
  friendText: {
    fontSize: 15,
    fontWeight: '200',
    letterSpacing: 3,
  },
});

export class AddMemberToEventScreen extends Component {
  constructor() {
    super();
    this.state = {
      friendProfiles: [],
      eventStatus: true,
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
            { profile: profileSnapshot.val(), id: snapshot.key },
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
    if (this.props.event.length) {
      this.eventStatus = makeRef(`/events/${this.props.event}/status`).on(
        'value',
        snapshot => {
          this.setState({ eventStatus: snapshot.val() });
        }
      );
    }
  }

  componentWillUnmount() {
    this.usersFriendsRef.off();
    // this.eventMembersRef.off();
  }

  checkStatus = () => {
    if (!this.state.eventStatus) {
      this.props.navigation.navigate('Status', { eventId: this.props.event });
    }
  };

  render() {
    this.checkStatus();

      if (!this.state.friendProfiles) {
        return <Text>You don't have any friends!</Text>;
      }
      return (
        <Container>
          <MyHeader title="Add Members" right={() => <BackButton />} />
          <Content contentContainerStyle={styles.content}>
            <Container>
              <EventMembers />
            </Container>
            <List>
              <ListItem>
                <Text style={styles.friendText}>FRIENDS</Text>
              </ListItem>
            </List>
            <ScrollView style={styles.eventFriends}>
              <EventFriends friends={this.state.friendProfiles} />
            </ScrollView>
          </Content>
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
