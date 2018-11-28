import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import {
  Button,
  Container,
  Content,
  List,
  Text,
  ListItem,
  Icon,
  Left,
  Body,
  Right,
  Thumbnail,
  Footer,
  Badge,
} from 'native-base';
import { setReceipt } from '../store';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import { BackButton, MyHeader } from '../components';
import Swipeable from 'react-native-swipeable';
const dateFormat = require('dateformat');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#FF7E79',
    height: '100%',
  },
  receiptText: {
    fontWeight: '200',
    letterSpacing: 2,
  },
  receiptDateText: {
    fontWeight: '200',
    color: '#838383',
    letterSpacing: 2,
    paddingTop: 5,
    fontSize: 10,
  },
  deleteText: {
    paddingLeft: 15,
    color: 'white',
  },
  buttonText: {
    textAlign: 'center',
    letterSpacing: 2,
    color: 'white',
  },
  button: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingBottom: 15,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
});

class SingleEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      event: {},
      receipts: [],
      receiptIds: [],
      receiptCountUnassigned: [],
      eventStatus: true,
    };
  }

  componentDidMount() {
    this.eventRef = makeRef(`/events/${this.props.event}`);
    this.receiptsRef = makeRef(`/events/${this.props.event}/receipts`);

    if (this.props.event.length) {
      this.eventStatus = makeRef(`/events/${this.props.event}/status`).on(
        'value',
        snapshot => {
          this.setState({ eventStatus: snapshot.val() });
        }
      );
    }

    // ON EVENT CHANGE
    this.callback = snapshot => {
      this.setState({
        event: snapshot.val(),
      });
    }
    this.eventRef.once('value', this.callback);

    // ON EVENT RECEIPT ADDED
    this.receiptsRef.on('child_added', async snapshot => {
      const receiptData = snapshot.val();
      let countUnassigned = 0;
      await snapshot.forEach(child => {
        if (child.hasChildren() && !child.hasChild('users')) countUnassigned++;
      });
      await this.setState(prevState => ({
        receiptIds: [...prevState.receiptIds, snapshot.key],
        receipts: [...prevState.receipts, receiptData],
        receiptCountUnassigned: [
          ...prevState.receiptCountUnassigned,
          countUnassigned,
        ],
      }))
    });

    this.receiptsRef.on('child_changed', async snapshot => {
      const receiptIdx = this.state.receiptIds.indexOf(snapshot.key);
      let countUnassigned = 0;
      await snapshot.forEach(child => {
        if (child.hasChildren() && !child.hasChild('users')) countUnassigned++;
      });
      const newCounts = [...this.state.receiptCountUnassigned];
      newCounts.splice(receiptIdx, 1, countUnassigned);
      this.setState({
        receiptCountUnassigned: newCounts,
      });
    });

    // ON EVENT RECEIPT REMOVED
    this.receiptsRef.on('child_removed', snapshot => {
      const removeReceiptIdx = this.state.receiptIds.indexOf(snapshot.key);

      const newReceiptIds = this.state.receiptIds.slice();
      newReceiptIds.splice(removeReceiptIdx, 1);

      const newReceipts = this.state.receipts.slice();
      newReceipts.splice(removeReceiptIdx, 1);

      const newCounts = this.state.receiptCountUnassigned.slice();
      newCounts.splice(removeReceiptIdx, 1);

      this.setState({
        receiptIds: newReceiptIds,
        receipts: newReceipts,
        receiptCountUnassigned: newCounts,
      });
    });
  }

  handleSelectReceipt = receiptId => {
    const receiptRef = `/events/${this.props.event}/receipts/${receiptId}`;
    this.props.navigation.navigate('Confirmed', {
      receiptRef: receiptRef,
    });
  };

  handleRemoveReceipt = receiptId => {
    const receiptRef = makeRef(
      `events/${this.props.event}/receipts/${receiptId}`
    );
    receiptRef.remove();
  };

  checkStatus = () => {
    if (!this.state.eventStatus) {
      this.props.navigation.navigate('Status', { eventId: this.props.event });
    }
  };

  componentWillUnmount() {
    this.eventRef.off('value', this.callback);
    this.receiptsRef.off();
  }

  render() {
    this.checkStatus();
    const { event, receipts, receiptIds } = this.state;
    if (!event.title) {
      return <MyHeader title="Add Event" right={() => <BackButton />} />;
    }
    return (
      <Container styles={styles.container}>
        <MyHeader title={event.title} right={() => <BackButton />} />
        <Content>
          <List>
            {receipts.length > 0 ? (
              receipts.map((receipt, idx) => {
                const rightButtons = [
                  <TouchableHighlight
                    style={styles.deleteButton}
                    key={parseInt(idx, 2)}
                    onPress={() => {
                      this.handleRemoveReceipt(receiptIds[idx]);
                    }}
                  >
                    <Text style={styles.deleteText}>DELETE</Text>
                  </TouchableHighlight>,
                ];
                return (
                  <Swipeable key={parseInt(idx, 2)} rightButtons={rightButtons}>
                    <ListItem
                      thumbnail
                      button
                      onPress={() => this.handleSelectReceipt(receiptIds[idx])}
                    >
                      <Left>
                        <Thumbnail square source={{ uri: receipt.imageUrl }} />
                      </Left>
                      <Body>
                        <Text style={styles.receiptText}>
                          {`Receipt ${idx + 1}`.toUpperCase()}
                        </Text>
                        <Text note style={styles.receiptDateText}>
                          {dateFormat(receipt.dateCreated, 'mediumDate')}
                        </Text>
                      </Body>
                      <Right>
                        {this.state.receiptCountUnassigned[idx] ? (
                          <Badge>
                            <Text>
                              {this.state.receiptCountUnassigned[idx]}
                            </Text>
                          </Badge>
                        ) : (
                          <Icon
                            type="MaterialCommunityIcons"
                            name="chevron-right"
                          />)}
                        </Right>
                      </ListItem>
                    </Swipeable>
                  );
                })
              ) : (
                  <Text>No Receipts</Text>
                )}
            </List>
          </Content>


        <Footer style={styles.footer}>
          <Button
            warning
            block
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Camera')}
          >
            <Icon
              type="MaterialCommunityIcons"
              name="camera"
              style={styles.icon}
            />
            <Text style={styles.buttonText}> ADD RECEIPT </Text>
          </Button>
        </Footer>

        <Footer style={styles.footer}>
          <Button
            success
            block
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate('Status', {
                eventId: this.props.event,
              });
            }}
          >
            <Icon
              type="MaterialCommunityIcons"
              name="cash-multiple"
              style={styles.icon}
            />
            <Text style={styles.buttonText}> STATUS </Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const mapState = state => {
  return {
    event: state.event.eventId,
  };
};

export default connect(
  mapState,
  { setReceipt }
)(SingleEvent);
