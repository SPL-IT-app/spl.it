import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Icon, Container } from 'native-base';
import MyHeader from '../components/Header';
import { connect } from 'react-redux';
import { setReceipt, setEvent } from '../store';

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
            onPress={async () => {
              await this.props.setEvent('');
              this.props.navigation.navigate('Camera');
            }}
          >
            <Text>New Receipt</Text>
            <Icon
              type="MaterialCommunityIcons"
              name="camera"
              style={styles.icon}
            />
          </Button>

          {/* TEMPORARY BUTTON WITH HARD-CODED RECEIPT */}
          <Button
            rounded
            warning
            large
            style={styles.button}
            onPress={async () => {
              await this.props.setReceipt([
                { quantity: 1, name: 'Cheese Curds', price: 7.0 },
                { quantity: 1, name: 'Steak', price: 35.5 },
                {
                  quantity: 1,
                  name: 'Pepperoni Pizza with Olives, Spinach, and Onions',
                  price: 15.0,
                },
                { quantity: 1, name: 'Pad Thai with Tofu', price: 18.0 },
                { quantity: 1, name: 'Red Curry with Rice', price: 20.0 },
                { quantity: 1, name: 'French Fries', price: 4.5 },
                { quantity: 1, name: 'Burger', price: 14 },
                { quantity: 1, name: 'Last Item', price: 12 },
              ]);
              // await this.props.setEvent('-LRdZ9WLN-pidwhU5bQE')
              await this.props.setEvent('');
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
    setEvent: event => {
      dispatch(setEvent(event));
    },
  };
};

export default connect(
  null,
  mapDispatch
)(HomeScreen);
