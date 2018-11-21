import React, { Component } from 'react';
import { Container, Content, Thumbnail, Text } from 'native-base';
import { ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import { randomColor } from 'randomcolor';

const styles = StyleSheet.create({
  view: {
    height: 115,
    padding: 10,
  },
  item: {
    padding: 10,
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'red',
  },
});

export class EventMembers extends Component {
  constructor() {
    super();
    this.state = {
      eventMemberProfiles: [],
    };
  }
  componentDidMount() {
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

  render() {
    return (
      <Container style={styles.view}>
        <ScrollView horizontal={true}>
          {this.state.eventMemberProfiles.map((member, idx) => {
            return (
              <Content key={idx} style={styles.item}>
                <Thumbnail
                  source={{ uri: member.imageUrl }}
                  style={{
                    ...styles.avatar,
                    borderColor: member.color
                      ? member.color
                      : randomColor({
                          luminosity: 'bright',
                          hue: 'random',
                        }).toString(),
                  }}
                />
                <Text>{member.username.substring(0, 5)}...</Text>
              </Content>
            );
          })}
        </ScrollView>
      </Container>
    );
  }
}

const mapState = state => {
  return {
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
