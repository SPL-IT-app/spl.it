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
} from 'native-base';
import { setReceipt } from '../store';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import { BackButton, MyHeader } from '../components';
import Swipeable from 'react-native-swipeable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 'auto',
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
    };
  }

  componentDidMount() {
    this.eventRef = makeRef(`/events/${this.props.event}`);
    this.receiptsRef = makeRef(`/events/${this.props.event}/receipts`);

    // ON EVENT CHANGE
    this.eventRef.once('value', snapshot => {
      console.log('EVENT ===> ', snapshot.val());
      this.setState({
        event: snapshot.val(),
      });
    });

    // ON EVENT RECEIPT ADDED
    this.receiptsRef.on('child_added', async snapshot => {
      await this.setState({
        receiptIds: [...this.state.receiptIds, snapshot.key],
        receipts: [...this.state.receipts, snapshot.val()],
      });
    });

    // ON EVENT RECEIPT REMOVED
    this.receiptsRef.on('child_removed', snapshot => {
      const removeReceiptIdx = this.state.receiptIds.indexOf(snapshot.key)

      const newReceiptIds = this.state.receiptIds.slice()
      newReceiptIds.splice(removeReceiptIdx, 1)

      const newReceipts = this.state.receipts.slice()
      newReceipts.splice(removeReceiptIdx, 1)
      this.setState({
        receiptIds: newReceiptIds,
        receipts: newReceipts,
      });
    });
  }

  handleSelectReceipt = receiptId => {
    const receiptRef = `/events/${this.props.event}/receipts/${receiptId}`;
    this.props.navigation.navigate('Confirmed', {
      receiptRef: receiptRef,
    });
  };

  componentWillUnmount() {
    this.eventRef.off();
    this.receiptsRef.off();
  }

  render() {
    const { event, receipts } = this.state;
    console.log('RECEIPTS ARRAY FROM RENDER ====>', receipts);
    if (!event.title) return <Container />;
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
                    key={idx}
                    // onPress={() => {
                    //   this.handleRemoveEvent(event.id);
                    // }}
                  >
                    <Text style={styles.deleteText}>DELETE</Text>
                  </TouchableHighlight>,
                ];
                return (
                  <Swipeable key={idx} rightButtons={rightButtons}>
                    <ListItem
                      thumbnail
                      button
                      onPress={() =>
                        this.handleSelectReceipt(this.state.receiptIds[idx])
                      }
                    >
                      <Left>
                        <Thumbnail square source={{ uri: receipt.imageUrl }} />
                      </Left>
                      <Body>
                        <Text style={styles.receiptText}>{`Receipt ${idx + 1}`.toUpperCase()}</Text>
                        <Text note numberOfLines={1}>
                          Its time to build a difference . .
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
            disabled
            block
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate('Home');
            }}
          >
            <Icon
              type="MaterialCommunityIcons"
              name="credit-card"
              style={styles.icon}
            />
            <Text style={styles.buttonText}> CHECKOUT </Text>
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
