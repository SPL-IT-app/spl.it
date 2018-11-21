import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  Button,
  Icon,
  Container,
  Content,
  List,
  Text,
  ListItem,
  Card,
  CardItem,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { setReceipt } from '../store';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import Header from '../components/Header';

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
    const { navigation } = this.props;

    this.eventRef = makeRef(`/events/${this.props.event}`);
    this.receiptsRef = makeRef(`/events/${this.props.event}/receipts`);

    this.receiptsRef.on('child_added', snapshot => {
      console.log('SNAPSHOT ====>', snapshot.key);
      this.setState({
        receiptIds: [...this.state.receiptIds, snapshot.key],
        receipts: [...this.state.receipts, snapshot.val()],
      });
    });

    this.eventRef.on('value', snapshot => {
      this.setState({
        event: snapshot.val(),
      });
    });
  }

  componentWillUnmount() {
    this.eventRef.off();
    this.receiptsRef.off();
  }

  handleSelectReceipt = receiptId => {
    const { navigation } = this.props;
    console.log('SELECTED RECEIPT', receiptId);

    const receiptRef = `/events/${this.props.event}/receipts/${receiptId}`
    console.log("RECEIPT REF ====>", receiptRef)
    this.props.navigation.navigate('Confirmed', {
        receiptRef: receiptRef,
      });
  };

  render() {
    const { event, receipts } = this.state;
    if (!event.title) return <Container />;
    console.log('RECEIPT IDs=====>', this.state.receiptIds);
    console.log('RECEIPTS=====>', this.state.receipts);
    return (
      <Container styles={styles.container}>
        <Header />
        <List>
          <ListItem style={styles.eventTitle}>
            <TouchableOpacity>
              <Icon
                type="MaterialCommunityIcons"
                name="arrow-left"
                onPress={() => this.props.navigation.goBack()}
              />
            </TouchableOpacity>
            <Text>{event.title.toUpperCase()}</Text>
            <Text />
          </ListItem>
        </List>

        <Content>
          {receipts.length > 0 ? (
            receipts.map((receipt, idx) => {
              console.log('RECEIPT FROM MAP =====>', receipt);
              return (
                <Card key={parseInt(idx, 2)}>
                    <CardItem
                        button
                        onPress={() => this.handleSelectReceipt(this.state.receiptIds[idx])}
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
        event: state.event.eventId
    }
}

export default connect(
  mapState,
  { setReceipt }
)(SingleEvent);
