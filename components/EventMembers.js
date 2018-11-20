import React, { Component } from 'react';
import { Container, Content, Thumbnail, Text } from 'native-base';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import { StyleSheet } from 'react-native';
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
  render() {
    return (
      <Container style={styles.view}>
        <ScrollView horizontal={true}>
          {this.props.members.map((member, idx) => {
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
