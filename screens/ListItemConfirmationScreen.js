import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Content, Button, Icon, Footer, Input, Item} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { LoadingScreen, LineItems, MyHeader, BackButton } from '../components';
import { addLineItem, setEvent } from '../store';
const { makeRef } = require('../server/firebaseconfig');
import Dialog from 'react-native-dialog';
import { Status } from '../screens';

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
    paddingBottom: 15,
    height: 'auto'
  },
  tiptax: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    height: 45,
    justifyContent: 'center',
  },
  formInput: {
    borderColor: 'transparent',
    display: 'flex',
    width: '100%',
  },
  inputText: {
    width: '100%',
    textAlign: 'center',
  },
  tipText: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    backgroundColor: '#eee',
  },
  blankCol: {
    height: '100%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    width: '60%',
    backgroundColor: '#eee',
  },
  tipAmount: {
    height: '100%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    width: '17%',
    backgroundColor: '#eee',
  },
  percentSign: {
    height: '100%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'flex-start',
    width: '8%',
    backgroundColor: '#eee',
  },
});

export class ListItemConfirmationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      eventName: '',
      receiptRef: '',
      eventStatus: true,
      tipPercent: '15',
      taxPercent: '10.25',
    };
  }

  componentDidMount() {
    if (this.props.event.length) {
      this.eventStatus = makeRef(`/events/${this.props.event}/status`).on(
        'value',
        snapshot => {
          this.setState({ eventStatus: snapshot.val() });
        }
      );
    }
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
      tipPercent: Number(this.state.tipPercent),
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

  checkStatus = () => {
    if (!this.state.eventStatus) {
      this.props.navigation.navigate('Status', { eventId: this.props.event });
    }
  };

  handleChange = type => async event => {
    console.log('TIP OR TAX CHANGED ====>', type, event);
    await this.setState({
      [type]: event,
    });
  };

  render() {
    this.checkStatus();
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
                style={{ color: 'black', paddingRight: 10 }}
                type="MaterialCommunityIcons"
                name="plus"
              />
            </Button>
          </Grid>
        </Content>
        <Footer style={styles.footer}>
            <Grid>
              <Row style={styles.tiptax}>
                <Col style={styles.tipText}>
                  <Text style={styles.inputText}>TIP</Text>
                </Col>
                <Col style={styles.blankCol} />
                <Col style={styles.tipAmount}>
                  <Item style={styles.formInput}>
                    <Input
                      style={styles.inputText}
                      keyboardType="phone-pad"
                      returnKeyType="done"
                      name="name"
                      value={this.state.tipPercent}
                      onChangeText={this.handleChange('tipPercent')}
                    />
                  </Item>
                </Col>
                <Col style={styles.percentSign}>
                  <Text>%</Text>
                </Col>
              </Row>
              <Row style={styles.tiptax}>
                <Col style={styles.tipText}>
                  <Text style={styles.inputText}>TAX</Text>
                </Col>
                <Col style={styles.blankCol} />
                <Col style={styles.tipAmount}>
                  <Item style={styles.formInput}>
                    <Input
                      style={styles.inputText}
                      keyboardType="phone-pad"
                      returnKeyType="done"
                      name="name"
                      value={this.state.taxPercent}
                      onChangeText={this.handleChange('taxPercent')}
                    />
                  </Item>
                </Col>
                <Col style={styles.percentSign}>
                  <Text>%</Text>
                </Col>
              </Row>
            </Grid>
          </Footer>
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
      <LoadingScreen />
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
