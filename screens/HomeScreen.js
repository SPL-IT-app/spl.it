import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Icon, Content, Container } from 'native-base';
import { MyHeader, LoadingScreen } from '../components';
import { connect } from 'react-redux';
import AllEvents from './AllEvents';
import { makeRef } from '../server/firebaseconfig';
import { setEvent, setReceipt } from '../store/index';
import { withNavigationFocus } from 'react-navigation';

const styles = StyleSheet.create({
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
  buttonText: {
    textAlign: 'center',
    letterSpacing: 2,
    color: 'black',
  },
  button: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
});

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: {},
      // activeEventCount: NaN,
    };
  }

  componentDidMount() {
    // let eventCount = 0;
    const { user } = this.props;

    this.userRef = makeRef(`/users/${user.id}`);

    this.userRef.on('value', snapshot => {
      let currentUser = snapshot.val();
      // const eventsExist = snapshot.hasChild('events');
      // console.log('currentUser', currentUser);
      // console.log('eventsExist', eventsExist);
      // if (!eventsExist || !currentUser.events) {
      //   eventCount = 0;
      // } else {
      //   Object.keys(currentUser.events).forEach(eventId => {
      //     makeRef(`/events/${eventId}/status`).on('value', statusSnap => {
      //       console.log('status snap +++++++++', statusSnap.val());
      //       if (statusSnap.val() === true)
      //         this.setState({
      //           activeEventCount: this.state.activeEventCount + 1,
      //         });
      //     });
      //   });
      // }

      this.setState({
        user: currentUser,
        isLoading: false,
        // activeEventCount: eventCount,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { user } = this.props;

    if (prevProps.user !== this.props.user) {
      this.userRef = makeRef(`/users/${user.id}`);
      this.userRef.on('value', snapshot => {
        let currentUser = snapshot.val();
        this.setState({ user: currentUser, isLoading: false });
      });
    }
  }

  componentWillUnmount() {
    this.userRef.off();
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    // const { activeEventCount } = this.state;
    const { events } = this.state.user;
    return (
      this.props.isFocused && (
        <Container>
          {this.state.isLoading ? (
            <LoadingScreen />
          ) : events ? (
            <AllEvents status={true} />
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
          )}
        </Container>
      )
    );
  }
}

const mapState = state => {
  return { user: state.user.currentUser };
};

const mapDispatch = dispatch => {
  return {
    setReceipt: receiptObj => {
      dispatch(setReceipt(receiptObj));
    },
    setEvent: event => {
      dispatch(setEvent(event));
    },
  };
};

export default withNavigationFocus(
  connect(
    mapState,
    mapDispatch
  )(HomeScreen)
);
