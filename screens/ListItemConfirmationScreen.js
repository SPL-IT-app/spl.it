import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Content, Button, Icon, Footer } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {
  CameraProcessing,
  LineItems,
  MyHeader,
  BackButton,
} from '../components';
import { addLineItem, setEvent } from '../store';
const { makeRef } = require('../server/firebaseconfig');
import Dialog from 'react-native-dialog';

const styles = StyleSheet.create({
  tableHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    width: '15%',
  },
  description: {
    display: 'flex',
    alignItems: 'center',
    width: '60%',
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    width: '25%',
  },
  lastRow: {
    paddingBottom: 80,
  },
  buttonText: {
    textAlign: 'center',
    letterSpacing: 2,
    color: 'white',
  },
  confirmItemsButton: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
  addItemButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
  footer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingBottom: 15
  }
});

export class ListItemConfirmationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      eventName: '',
      receiptRef: '',
    };
  }

  static navigationOptions = {
    header: null,
  };

  handleConfirmItems = async () => {
    if (!this.props.event) {
      this.setState({ dialogVisible: true });
    } else {
      await this.handleSubmitEventName();
      this.props.navigation.navigate('Confirmed', {
        receiptRef: this.state.receiptRef,
      });
    }
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleEventName = event => {
    this.setState({ eventName: event });
  };

  handleSubmitEventName = () => {
    this.setState({ dialogVisible: false });
    const newEvent = {
      date: new Date().toString(),
      title: this.state.eventName,
      status: true,
      receipts: {},
      members: { [this.props.user.id]: true },
    };

    const newReceipt = {
      imageUrl: 'http://www.w3.org/wiki/images/a/a9/Munich-dinner-receipt.jpg',
      creator: this.props.user.id,
      dateCreated: new Date().toString(),
      tipPercent: null,
      lineItems: {},
    };

    let receipt = this.props.receipt;
    receipt.forEach(lineItem => {
      if (lineItem.quantity > 1) {
        const repeatLineItem = {
          quantity: 1,
          name: lineItem.name,
          price: lineItem.price / lineItem.quantity,
        };
        receipt.splice(receipt.indexOf(lineItem), 1);
        for (let i = 0; i < lineItem.quantity; i++) {
          receipt.push(repeatLineItem);
        }
      }
    });
    const lineItems = receipt.map(lineItem => {
      return {
        name: lineItem.name,
        price: lineItem.price,
        users: {},
      };
    });

    let eventId = this.props.event;
    if (!this.props.event) {
      const eventsRef = makeRef('/events');
      const newEventRef = eventsRef.push();
      eventId = newEventRef.key;
      newEventRef.set(newEvent);
    }
    const receiptsRef = makeRef(`/events/${eventId}/receipts`);
    const newReceiptRef = receiptsRef.push();
    const receiptID = newReceiptRef.key;
    newReceiptRef.set(newReceipt);

    const lineItemsRef = makeRef(`/events/${eventId}/receipts/${receiptID}`);
    this.setState({ receiptRef: `/events/${eventId}/receipts/${receiptID}` });
    lineItems.forEach(item => {
      lineItemsRef.push().set(item);
    });

    this.props.setEvent(eventId);
    const userRef = makeRef(`/users/${this.props.user.id}/events`);
    userRef.update({
      [eventId]: true,
    });
  };

  render() {
    const { receipt } = this.props;
    return receipt.length ? (
      <Container>
        <MyHeader
          title="Confirmation"
          right={() => <BackButton navigation={this.props.navigation} />}
        />
        <Content style={styles.content}>
          <Grid style={styles.grid}>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>Event Name</Dialog.Title>
              <Dialog.Description>
                Please enter a name for your event
              </Dialog.Description>
              <Dialog.Input lable="test" onChangeText={this.handleEventName} />
              <Dialog.Button label="Cancel" onPress={this.handleCancel} />
              <Dialog.Button
                label="Enter"
                onPress={async () => {
                  await this.handleSubmitEventName();
                  this.props.navigation.navigate('Confirmed', {
                    receiptRef: this.state.receiptRef,
                  });
                }}
              />
            </Dialog.Container>

            <Row style={styles.tableHeader}>
              <Col style={styles.quantity}>
                <Text>QTY</Text>
              </Col>
              <Col style={styles.description}>
                <Text>DESCRIPTION</Text>
              </Col>
              <Col style={styles.price}>
                <Text>PRICE</Text>
              </Col>
            </Row>
            {receipt.map((lineItem, idx) => {
              return <LineItems key={idx} lineItem={lineItem} idx={idx} />;
            })}
            <Button
              style={styles.addItemButton}
              onPress={() => {
                this.props.addLineItem();
              }}
            >
              <Icon
                style={{ color: 'black' }}
                type="MaterialCommunityIcons"
                name="plus"
              />
            </Button>
            {/* <Row style={styles.lastRow} /> */}
          </Grid>
        </Content>
        <Footer style={styles.footer}>
          <Button
            success
            block
            style={styles.confirmItemsButton}
            onPress={this.handleConfirmItems}
          >
            <Text style={styles.buttonText}> CONFIRM ITEMS </Text>
          </Button>
        </Footer>
      </Container>
    ) : (
      <CameraProcessing />
    );
  }
}

const mapState = state => {
  return {
    user: state.user.currentUser,
    receipt: state.receipt.receipt,
    event: state.event.eventId,
  };
};

const mapDispatch = dispatch => {
  return {
    addLineItem: () => {
      dispatch(addLineItem());
    },
    setEvent: id => {
      dispatch(setEvent(id));
    },
  };
};

export default connect(
  mapState,
  mapDispatch
)(ListItemConfirmationScreen);
