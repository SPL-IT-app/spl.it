import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebBrowser } from 'expo';
import CameraView from '../components/CameraView';
import { Button, Icon, Content, Container } from 'native-base';
import MyHeader from '../components/Header';
import { connect } from 'react-redux';
import { setReceipt } from '../store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '60%',
    alignSelf: 'center',
  },
});

export class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <MyHeader title="Events" />
        <Container style={styles.container}>
          <Button
            rounded
            info
            large
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate('Camera');
            }}
          >
            <Text>New Receipt</Text>
            <Icon name="ios-camera" style={styles.icon} />
          </Button>

          {/* TEMPORARY BUTTON WITH HARD-CODED RECEIPT */}
          <Button
            rounded
            warning
            large
            style={styles.button}
            onPress={async () => {
              await this.props.setReceipt([
                { quantity: 1, name: "Cheese Curds", price: 7.0 },
                { quantity: 1, name: "Steak", price: 35.20 },
                { quantity: 1, name: "Pepperoni Pizza", price: 15.0 },
                { quantity: 1, name: "Pad Thai with Tofu", price: 18.0 },
                { quantity: 1, name: "Red Curry with Rice", price: 20.0 },
                { quantity: 1, name: "French Fries", price: 4.50 },
                { quantity: 1, name: "Burger", price: 11.99 },
              ]);
              this.props.navigation.navigate('ListConfirm');
            }}
          >
            <Text>HARD CODED RECEIPT</Text>
          </Button>
          {/* END OF TEMPORARY BUTTON WITH HARD-CODED RECEIPT */}


        </Container>
      </Container>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    setReceipt: receiptObj => {
      dispatch(setReceipt(receiptObj));
    },
  };
};

export default connect(
  null,
  mapDispatch
)(HomeScreen);
