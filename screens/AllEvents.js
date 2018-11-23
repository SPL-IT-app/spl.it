import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableHighlight } from 'react-native';
import { Icon, Container, List, Body, Right, ListItem, Fab } from 'native-base';
import { setEvent } from '../store';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import { withNavigation } from 'react-navigation';
import Swipeable from 'react-native-swipeable';
var dateFormat = require('dateformat');

const styles = StyleSheet.create({
  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FF7E79',
    height: '100%',
  },
  deleteText: {
    paddingLeft: 15,
    color: 'white',
  },
  eventText: {
    fontWeight: '200',
    letterSpacing: 2,
  },
  eventDateText: {
    fontWeight: '200',
    color: '#838383',
    letterSpacing: 2,
    paddingTop: 5,
    fontSize: 10,
  },
});

class AllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    const { user } = this.props;
    this.eventIds = [];

    this.userEventsRef = makeRef(`/users/${user.id}/events`);

    this.userEventsRef.on('child_added', snapshot => {
      const eventsRef = makeRef(`/events/${snapshot.key}`);
      eventsRef.once('value', eventSnapshot => {
        this.setState({
          events: [...this.state.events, {id: snapshot.key, info: eventSnapshot.val()}],
        });
        this.eventIds.push(eventSnapshot.key);
      });
    });

    this.userEventsRef.on('child_removed', snapshot => {
      console.log('CHILD REMOVED (EVENT) ====>, ', snapshot.key);
      const eventsRef = makeRef(`/events/${snapshot.key}`);
      eventsRef.once('value', eventSnapshot => {
        console.log("EVENT SNAPSHOT (REMOVED) ====>", eventSnapshot.val())
        const newEvents = this.state.events.filter(event => {
          console.log("EVENT INFO CHECK ====>", event.id!== snapshot.key)
          return event.id !== snapshot.key;
        });
        console.log('NEW EVENTS (REMOVED) ====>, ', newEvents);
        this.setState({
          events: newEvents,
        });
      }).then(() => {
        eventsRef.remove();
      });
    });
  }


  handleRemoveEvent = (eventId) => {
    const eventMembersRef = makeRef(`events/${eventId}/members`)
    eventMembersRef.once("value", snapshot => {
      snapshot.forEach( childSnapshot => {
        const userEventRef = makeRef(`users/${childSnapshot.key}/events/${eventId}`)
         userEventRef.remove()
      })
    }).then(() => {
      // const eventRef = makeRef(`events/${eventId}`)
      // eventRef.remove()
    })

  }

  componentWillUnmount() {
    if(this.userEventsRef) {
      this.userEventsRef.off();
    }
    if(this.eventsRef){
      this.eventsRef.off();
    }
  }

  handleEventClick = async id => {
    const { navigation } = this.props;
    await this.props.setEvent(id);
    navigation.navigate('SingleEvent', {
      id,
    });
  };



  handleEventAdd = async () => {
    const { navigation } = this.props;

    await this.props.setEvent('');
    navigation.navigate('Camera');
  };

  render() {
    const { events } = this.state;
    if (events.length === 0) return <Container />;
    console.log("EVENTS ====>", events)
    return (
      <Container>
        <ScrollView>
          <List>
            {events.map((event, idx) => {
              console.log("EVENT IN MAP", event)
              const rightButtons = [
                <TouchableHighlight
                  style={styles.deleteButton}
                  key={event.id}
                  onPress={() => {this.handleRemoveEvent(event.id)}}
                >
                  <Text style={styles.deleteText}>DELETE</Text>
                </TouchableHighlight>,
              ];
              return event.info.status ? (
                <Swipeable rightButtons={rightButtons}>
                  <ListItem
                    selected
                    button
                    onPress={() => this.handleEventClick(this.eventIds[idx])}
                    key={event.id}
                  >
                    <Body>
                      <Text style={styles.eventText}>
                        {event.info.title === ''
                          ? `Event ${idx + 1}`.toUpperCase()
                          : event.info.title.toUpperCase()}
                      </Text>
                      <Text note style={styles.eventDateText}>
                        {dateFormat(event.info.date, 'mediumDate')}
                      </Text>
                    </Body>

                    <Right>
                      <Icon
                        type="MaterialCommunityIcons"
                        name="chevron-right"
                      />
                    </Right>
                  </ListItem>
                </Swipeable>
              ) : (
                <Text />
              );
            })}
          </List>
        </ScrollView>
        <Container>
          <Fab position="bottomRight" onPress={() => this.handleEventAdd()}>
            <Icon type="MaterialCommunityIcons" name="plus" />
          </Fab>
        </Container>
      </Container>
    );
  }
}

const mapState = state => {
  return { user: state.user.currentUser };
};

const mapDispatch = dispatch => {
  return {
    setEvent: eventId => {
      dispatch(setEvent(eventId));
    },
  };
};

export default withNavigation(
  connect(
    mapState,
    mapDispatch
  )(AllEvents)
);
