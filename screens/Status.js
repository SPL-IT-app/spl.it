import React, { Component } from 'react';
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from 'native-base';
import { StyleSheet } from 'react-native';
import { MyHeader, BackButton, LoadingScreen } from '../components';
import { makeRef } from '../server/firebaseconfig';
import { connect } from 'react-redux';
import numeral from 'numeral';

const styles = StyleSheet.create({
  lineItemRow: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  text: {
    width: '100%',
    textAlign: 'left',
  },
  left: {
    width: '15%',
  },
  body: {
    width: '60%',
  },
  price: {
    // width: '25%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

class Status extends Component {
  constructor() {
    super();
    this.state = {
      members: {},
      event: {},
      memberCount: Infinity,
    };
    this.moneyToSendOrReceive = { unassigned: 0 };
    this.calculatePrice = this.calculatePrice.bind(this);
    this.calculateUserOwes = this.calculateUserOwes.bind(this);
  }

  componentDidMount() {
    this.eventRef = makeRef(
      `events/${this.props.navigation.getParam('eventId')}`
    );
    this.eventRef.on('value', snapshot => {
      this.setState({ event: snapshot.val() });
    });

    this.membersRef = makeRef(
      `events/${this.props.navigation.getParam('eventId')}/members`
    );
    this.membersRef.once('value', snapshot => {
      this.setState({ memberCount: Object.keys(snapshot.val()).length });
    });
    this.membersRef.on('child_added', snapshot => {
      makeRef(`profiles/${snapshot.key}`).once('value', profSnap => {
        this.setState({
          members: { ...this.state.members, [profSnap.key]: profSnap.val() },
        });
      });
    });
    this.membersRef.on('child_removed', snapshot => {
      makeRef(`profiles/${snapshot.key}`).once('value', profSnap => {
        let newMembers = { ...this.state.members };
        delete newMembers[profSnap.key];
        this.setState({ members: newMembers });
      });
    });
  }

  componentWillUnmount() {
    this.eventRef.off();
    this.membersRef.off();
  }

  calculatePrice(price, count, tipPercent = 15) {
    return (price / count) * (1 + tipPercent / 100 + 0.1025);
  }

  calculateUserOwes() {
    for (let key in this.state.event.receipts) {
      let receipt = this.state.event.receipts[key];
      const creator = receipt.creator;
      const lineItems = Object.values(receipt).filter(
        value => typeof value === 'object'
      );
      const isCreator = creator === this.props.id;
      lineItems.forEach(item => {
        if (
          !isCreator &&
          item.users &&
          item.users.hasOwnProperty(this.props.id)
        ) {
          // if you are assigned to an item on a receipt you didn't pay for
          const countUsers = Object.keys(item.users).length;
          // get the total count of ppl you're splitting with
          const lineItemTotal = this.calculatePrice(
            item.price,
            countUsers,
            receipt.tipPercent
          ); // each user's owes
          this.moneyToSendOrReceive.hasOwnProperty(creator)
            ? (this.moneyToSendOrReceive[creator] += lineItemTotal) // add to your tab with the user who footed the bill
            : (this.moneyToSendOrReceive[creator] = lineItemTotal); // start your tab
        }
        if (isCreator) {
          //if you footed the bill
          if (item.users) {
            //if the lineitem has at least one user
            const countUsers = Object.keys(item.users).length; // get the count of users
            for (let userKey in item.users) {
              if (userKey === this.props.id) continue; // don't owe yourself anything
              const userLineItemTotal = this.calculatePrice(
                item.price,
                countUsers,
                receipt.tipPercent
              ); // each user's owes
              this.moneyToSendOrReceive.hasOwnProperty(userKey)
                ? (this.moneyToSendOrReceive[userKey] -= userLineItemTotal) // discount what they already owe
                : (this.moneyToSendOrReceive[userKey] = userLineItemTotal); // open a tab for them
            }
          } else {
            // if no one has taken responsibility
            lineItemTotal = this.calculatePrice(
              item.price,
              1,
              receipt.tipPercent
            );
            this.moneyToSendOrReceive.unassigned += lineItemTotal;
          }
        }
      });
    }
  }

  render() {
    this.calculateUserOwes();
    if (Object.keys(this.state.members).length < this.state.memberCount) {
      return <LoadingScreen />;
    }
    const members = this.state.members;
    return (
      <Container>
        <MyHeader title="Status" right={() => <BackButton />} />
        <Content>
          <List>
            {Object.entries(this.moneyToSendOrReceive).map(entry => {
              if (entry[0] === 'unassigned') {
                if (!entry[1]) return;
                return (
                  <ListItem style={styles.lineItemRow} avatar key={entry[0]}>
                    <Left>
                      <Thumbnail source={{ uri: 'https://bit.ly/2PWwduR'}}/>
                    </Left>
                    <Body>
                      <Text>Unassigned</Text>
                    </Body>
                    <Right style={styles.price}>
                      <Text style={{ color: 'orange' }}>{numeral(entry[1]).format('$0,0.00')}</Text>
                    </Right>
                  </ListItem>
                );
              } else {
                return (
                  <ListItem avatar style={styles.lineItemRow} key={entry[0]}>
                    <Left>
                      <Thumbnail
                        source={{ uri: members[entry[0]].imageUrl }}
                        style={{
                          borderWidth: 4,
                          borderColor: members[entry[0]].color
                            ? members[entry[0]].color
                            : randomColor({
                                luminosity: 'light',
                                hue: 'random',
                              }).toString(),
                        }}
                      />
                    </Left>
                    <Body>
                      <Text>{members[entry[0]].username}</Text>
                    </Body>
                    <Right style={styles.price}>
                      <Text style={{ color: entry[1] > 0 ? 'red' : 'green' }}>
                        {numeral(entry[1]).format('$0,0.00')}
                      </Text>
                    </Right>
                  </ListItem>
                );
              }
            })}
          </List>
        </Content>
      </Container>
    );
  }
}

const mapState = state => ({
  id: state.user.currentUser.id,
});

export default connect(mapState)(Status);
