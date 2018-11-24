import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  Button,
  Container,
  Content,
  List,
  Text,
  ListItem,
  Card,
  CardItem,
  Icon,
  Left,
  Body,
  Right,
  Thumbnail,
} from 'native-base';
import { setReceipt } from '../store';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import { BackButton, MyHeader } from '../components';

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
      console.log(
        'SNAPSHOT ADDED====>',
        'KEY',
        snapshot.key,
        'VALUE',
        snapshot.val()
      );
      await this.setState({
        receiptIds: [...this.state.receiptIds, snapshot.key],
        receipts: [...this.state.receipts, snapshot.val()],
      });
      console.log('STATE RECEIPTS===> ', this.state.receipts);
    });

    // ON EVENT RECEIPT REMOVED
    this.receiptsRef.on('child_removed', snapshot => {
      console.log('SNAPSHOT REMOVED ====>', snapshot.key);
      const newReceiptIds = this.state.receiptIds.filter(receiptId => {
        return receiptId !== snapshot.key;
      });
      const newReceipts = this.state.receipts.filter(receipt => {
        return receipt !== snapshot.val();
      });
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
        {/* <Content>
          {receipts.length > 0 ? (
            receipts.map((receipt, idx) => {
              console.log('RECEIPT FROM MAP =====>', receipt);
              return (
                <Card key={this.state.receiptIds[idx]}>
                  <CardItem
                    button
                    onPress={() =>
                      this.handleSelectReceipt(this.state.receiptIds[idx])
                    }
                  >
                    <Image
                      source={{ uri: receipt.imageUrl }}
                      style={{ height: 100, width: null, flex: 1 }}
                    />
                  </CardItem>
                  <CardItem>
                    <Text>Receipt {idx + 1}</Text>
                  </CardItem>
                </Card>
              );
            })
          ) : (
            <Text>No receipts</Text>
          )}
        </Content> */}

        <Content>
          <List>
            {receipts.length > 0 ? (
              receipts.map((receipt, idx) => {
                return (
                  <ListItem
                    thumbnail
                    button
                    onPress={() =>
                      this.handleSelectReceipt(this.state.receiptIds[idx])
                    }
                    key={idx}
                  >
                    <Left>
                      <Thumbnail square source={{ uri: receipt.imageUrl }} />
                    </Left>
                    <Body>
                      <Text>Receipt {idx + 1}</Text>
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
                );
              })
            ) : (
              <Text>No Receipts</Text>
            )}
          </List>
        </Content>

        <Button block onPress={() => this.props.navigation.navigate('Camera')}>
          <Text>Add Receipt</Text>
        </Button>
        <Button block disabled={true}>
          <Text>Checkout Event</Text>
        </Button>
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
