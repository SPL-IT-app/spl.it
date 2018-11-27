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
import { makeRef } from '../server/firebaseconfig';

const styles = StyleSheet.create({
  listItem: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  right: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export class EventMembers extends Component {
  state = {
    eventName: '',
    addedFriends: [],
  };
  componentDidMount() {
    console.log('MOUNTED');
    this.eventNameRef = makeRef(`/events/${this.props.event}/title`);
    this.eventRef = makeRef(`/events/${this.props.event}/members`);
    this.usersFriendsRef = makeRef(`/users/${this.props.user}/friends`);
    this.eventNameRef.once('value', snapshot => {
      this.setState({
        eventName: snapshot.val(),
      });
    });
    this.eventRef.on('value', snapshot => {
      const friendIds = snapshot.val() ? snapshot.val() : {};
      this.setState({
        addedFriends: Object.keys(friendIds),
      });
    });
  }

  sendPushNotification(token, title, body) {
    return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: { message: `${title} - ${body}` },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }

  handleSelect = (val, id) => {
    this.eventMemberRef = makeRef(`/events/${this.props.event}/members/${id}`);
    this.userRef = makeRef(`/users/${id}/events`);
    this.userEventRef = makeRef(`/users/${id}/events/${this.props.event}`);
    if (val === true) {
      this.eventRef.update({
        [id]: true,
      });
      this.userRef.update({
        [this.props.event]: true,
      });

      // SEND PUSH NOTIFICATION TO NEW MEMBER
      let expoToken = '';
      this.userExpoTokenRef = makeRef(`/users/${id}/expoToken`);
      this.userExpoTokenRef.once('value', snapshot => {
        expoToken = snapshot.val();
        const title = `You've been invited to an event: `;
        const body = `${this.state.eventName}`;
        this.sendPushNotification(expoToken, title, body);
      });
    } else if (val === false) {
      this.eventMemberRef.remove();
      this.userEventRef.remove();
    }
  };

  componentWillUnmount() {
    this.eventNameRef.off();
    this.eventRef.off();
<<<<<<< HEAD
    this.usersFriendsRef.off()
=======
    this.usersFriendsRef.off();
>>>>>>> 5fbf049a3b28e68b90b10acdcb3e68d571f23772
  }

  render() {
    const { friends } = this.props;
    return (
      <Container>
        <List>
          {friends.map(friend => {
            return (
              <ListItem
                style={styles.listItem}
                avatar
                key={friend.profile.username}
              >
                <Left>
                  <Thumbnail source={{ uri: friend.profile.imageUrl }} />
                </Left>
                <Body style={styles.body}>
                  <Text>{friend.profile.username}</Text>
                </Body>
                <Right style={styles.right}>
                  <CheckBox
                    onChange={val => this.handleSelect(val, friend.id)}
                    checked={this.state.addedFriends.includes(friend.id)}
                    iconName="matCircleMix"
                  />
                </Right>
              </ListItem>
            );
          })}
        </List>
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
)(EventMembers);
