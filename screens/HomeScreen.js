import React from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import {
  Button,
  Icon,
  Content,
  Container,
  Footer,
  Thumbnail,
} from 'native-base';
import MyHeader from '../components/Header';
import { connect } from 'react-redux';
import AllEvents from './AllEvents';
import { makeRef } from '../server/firebaseconfig';
import { setEvent, setReceipt } from '../store/index';
import { Grid, Col, Row } from 'react-native-easy-grid';

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
    alignItems: 'center'
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
      isLoading: false,
      user: {},
    };
  }

  componentDidMount() {
    const { user } = this.props;

    this.userRef = makeRef(`/users/${user.id}`);
    this.userRef.on('value', snapshot => {
      let currentUser = snapshot.val();
      this.setState({ user: currentUser });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { user } = this.props;

    if (prevProps.user !== this.props.user) {
      this.userRef = makeRef(`/users/${user.id}`);
      this.userRef.on('value', snapshot => {
        let currentUser = snapshot.val();
        this.setState({ user: currentUser });
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
    const { events } = this.state.user;

    return (
      <Container>
        <MyHeader title="Events" />
        {events ? (
          <AllEvents />
        ) : (
          <Content contentContainerStyle={styles.content}>
            <Text style={styles.mainText}>WELCOME TO $PL/IT</Text>
            <Text style={styles.subText}>Create a New Event...</Text>
            <Button
              rounded
              success
              onPress={() => {
                console.log('PRESSED');
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

export default connect(
  mapState,
  mapDispatch
)(HomeScreen);
