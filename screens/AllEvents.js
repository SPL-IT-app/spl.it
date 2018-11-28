import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableHighlight } from 'react-native';
import {
  Icon,
  Container,
  List,
  Body,
  Right,
  ListItem,
  Fab,
  Content,
  Button,
} from 'native-base';
import { setEvent } from '../store';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import { withNavigation } from 'react-navigation';
import Swipeable from 'react-native-swipeable';
const dateFormat = require('dateformat');
import { MyHeader } from '../components';

const styles = StyleSheet.create({
  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
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
  addEventFab: {
    backgroundColor: '#1A98FC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    alignSelf: 'center',
    // color: 'black'
  },
  cameraButton: {
    alignSelf: 'center',
    height: 60,
    width: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '300',
    letterSpacing: 4,
  },
  subText: {
    padding: 20,
    color: '#363731',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '200',
    letterSpacing: 3,
  },
});

class AllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      eventIds: [],
    };
  }

  componentDidMount() {
    const { user } = this.props;

    this.userEventsRef = makeRef(`/users/${user.id}/events`);
    // this.eventRef = makeRef(`events`)

    // ON USER EVENT ADDED
    this.userEventsRef.on('child_added', snapshot => {
      const eventsRef = makeRef(`/events/${snapshot.key}`);
      eventsRef.on('value', eventSnapshot => {
        if (this.state.eventIds.includes(snapshot.key)) {
          const { events } = this.state;
          const newEvents = events.map(event => {
            if (event.id === snapshot.key) {
              return { id: snapshot.key, info: eventSnapshot.val() };
            }
            return event;
          });
          this.setState({ events: newEvents });
        } else {
          this.setState(prevState => ({
            events: [
              ...prevState.events,
              { id: snapshot.key, info: eventSnapshot.val() },
            ],
            eventIds: [...prevState.eventIds, snapshot.key],
          }));
        }
      });
    });

    // ON USER EVENT REMOVED
    this.userEventsRef.on('child_removed', snapshot => {
      const eventsRef = makeRef(`/events/${snapshot.key}`);
      eventsRef.once('value', eventSnapshot => {
        const { events, eventIds } = this.state;
        const newEvents = events.filter(event => {
          return event.id !== snapshot.key;
        });
        const newEventIds = eventIds.filter(id => id !== snapshot.key);
        this.setState({
          events: newEvents,
          eventIds: newEventIds,
        });
      });
    });
  }

  handleRemoveEvent = eventId => {
    this.swipeable.recenter();
    const eventMembersRef = makeRef(`events/${eventId}/members`);
    eventMembersRef.once('value', snapshot => {
      snapshot.forEach(childSnapshot => {
        const userEventRef = makeRef(
          `users/${childSnapshot.key}/events/${eventId}`
        );
        userEventRef.remove();
      });
    });
  };

  handleEventClick = async id => {
    const { navigation, status } = this.props;

    if (status) {
      await this.props.setEvent(id);
      navigation.navigate('SingleEvent', {
        id,
      });
    } else {
      navigation.navigate('Status', {
        eventId: id,
        history: true,
      });
    }
  };

  handleEventAdd = async () => {
    const { navigation } = this.props;

    await this.props.setEvent('');
    navigation.navigate('Camera');
  };

  componentWillUnmount() {
    if (this.userEventsRef) {
      this.userEventsRef.off();
    }
    if (this.eventsRef) {
      this.eventsRef.off();
    }
  }

  swipeable = null;

  render() {
    const { events } = this.state;
    const { status } = this.props;
    const activeEvents = events.filter(event => event.info.status === true);
    const inactiveEvents = events.filter(event => event.info.status === false);

    if (events.length === 0) return <Container />;

    return (
      <Container>
        <MyHeader title={status ? 'Events' : 'History'} />
        {status ? (
          activeEvents.length ? (
            <ScrollView>
              <List>
                {activeEvents.map((event, idx) => {
                  const rightButtons = [
                    <TouchableHighlight
                      style={styles.deleteButton}
                      key={parseInt(idx, 2)}
                      onPress={() => {
                        this.handleRemoveEvent(event.id);
                      }}
                    >
                      <Text style={styles.deleteText}>DELETE</Text>
                    </TouchableHighlight>,
                  ];
                  return (
                    <Swipeable 
                      onRef={ref => (this.swipeable = ref)}
                      rightButtons={rightButtons} 
                      key={event.id}>
                      <ListItem
                        selected
                        button
                        onPress={() => this.handleEventClick(event.id)}
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
                  );
                })}
              </List>
            </ScrollView>
          ) : (
            <Content contentContainerStyle={styles.content}>
              <Text style={styles.mainText}>WELCOME TO $PL/IT</Text>
              <Text style={styles.subText}>Create a New Event...</Text>
              <Button
                rounded
                success
                onPress={async () => {
                  await this.props.setEvent('');
                  this.props.navigation.navigate('Camera');
                }}
                style={styles.cameraButton}
              >
                <Icon
                  type="MaterialCommunityIcons"
                  name="camera"
                  style={styles.icon}
                />
              </Button>
            </Content>
          )
        ) : (
          <ScrollView>
            <List>
              {inactiveEvents.map((event, idx) => {
                return (
                  <ListItem
                    selected
                    button
                    onPress={() => this.handleEventClick(event.id)}
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
                );
              })}
            </List>
          </ScrollView>
        )}
        <Container>
          {status ? (
            <Fab
              position="bottomRight"
              style={styles.addEventFab}
              onPress={() => this.handleEventAdd()}
            >
              <Icon type="MaterialCommunityIcons" name="plus" />
            </Fab>
          ) : (
            <Container />
          )}
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
