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
  Footer,
  Button,
  Icon,
  Separator,
  Toast
} from 'native-base';
import { StyleSheet } from 'react-native';
import { MyHeader, BackButton, LoadingScreen } from '../components';
import { makeRef } from '../server/firebaseconfig';
import { connect } from 'react-redux';
import numeral from 'numeral';

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    letterSpacing: 2,
    color: 'white',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    width: '95%',
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    height: 'auto'
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  lineItemRow: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  price: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  dividerText: {
    letterSpacing: 2,
    fontSize: 13,
    color: 'white'
  },
  unassignedDivider: {
    backgroundColor: '#FFC000',
    height: 'auto'
  },
  userSplits: {
    marginTop: 15,
    backgroundColor: '#159192',
    height: 'auto'

  },
  totalDivider: {
    marginTop: 15,
    height: 'auto',
    backgroundColor: "#1A98FC",
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

    this.calculatePrice = this.calculatePrice.bind(this);
    this.calculateUserOwes = this.calculateUserOwes.bind(this);
  }

  componentDidMount() {
    this.eventRef = makeRef(`events/${this.props.navigation.getParam('eventId')}`);
    this.callback = snapshot => {
      this.setState({ event: snapshot.val() });
    }
    this.eventRef.on('value', this.callback );

    this.membersRef = makeRef(
      `events/${this.props.navigation.getParam('eventId')}/members`
    );
    this.membersRef.on('value', snapshot => {
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
    this.eventRef.off('value', this.callback);
    this.membersRef.off();
  }

  calculatePrice(price, count, tipPercent = 15) {
    return (price / count) * (1 + tipPercent / 100 + 0.1025);
  }

  calculateUserOwes() {
    this.moneyToSendOrReceive = { unassigned: 0 };
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
                : (this.moneyToSendOrReceive[userKey] = -userLineItemTotal); // open a tab for them
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

  calculateTotal = () => {
    let copy = Object.assign(this.moneyToSendOrReceive, { unassigned: 0 });
    return Object.values(copy).reduce((a, b) => a + b, 0);
  };

  isReadyToClose = () => {
    for (let key in this.state.event.receipts) {
      let receipt = this.state.event.receipts[key];
      let lineItems = Object.values(receipt).filter(
        value => typeof value === 'object'
      );
      for (let i = 0; i < lineItems.length; i++) {
        if (!lineItems[i].users) return false;
        else if (!Object.keys(lineItems[i].users)) return false;
      }
    }
    return true;
  };

  closeEvent = () => {
    this.eventRef.update({ status: false }, error => {
      if (!error) {
        Toast.show({
          text: 'Event Closed!',
          buttonText: 'UNDO',
          type: 'success',
          duration: 3000,
          onClose: reason => {
            if (reason === 'user') {
              this.eventRef.update({ status: true });
            }
          },
        });
      }
    });
  };

  render() {
    this.calculateUserOwes();
    if (Object.keys(this.state.members).length < this.state.memberCount) {
      return <LoadingScreen />;
    }
    const members = this.state.members;
    return (
      <Container>
        <MyHeader
          title={
            this.props.navigation.getParam('history') ? 'History' : 'Status'
          }
          subtitle={this.state.event.title}
          right={() => <BackButton />}
        />
        <Content>
          <List>

            {Object.entries(this.moneyToSendOrReceive).map(entry => {
              if (entry[0] === 'unassigned') {
                if (!entry[1]) return(
                  <React.Fragment>
                    <Separator bordered style={styles.unassignedDivider}>
                      <Text style={styles.dividerText}>
                        NO UNASSIGNED LINE ITEMS
                      </Text>
                    </Separator>
                    <ListItem style={styles.lineItemRow} avatar key={entry[0]}>
                      <Left>
                        <Thumbnail
                          source={{
                            uri:
                              'https://cdn3.iconfinder.com/data/icons/account-1/64/Account-06-512.png',
                          }}
                        />
                      </Left>
                      <Body>
                        <Text>Unassigned</Text>
                      </Body>
                      <Right style={styles.price}>
                        <Text style={{ color: 'orange' }}>
                          {numeral(0).format('$0,0.00')}
                        </Text>
                      </Right>
                    </ListItem>
                    <Separator bordered style={styles.userSplits}>
                      <Text style={styles.dividerText}>USER SPLITS</Text>
                    </Separator>
                  </React.Fragment>
                );
                return (
                  <React.Fragment>
                    <Separator bordered style={styles.unassignedDivider}>
                      <Text style={styles.dividerText}>
                        UNASSIGNED LINE ITEMS
                      </Text>
                    </Separator>
                    <ListItem style={styles.lineItemRow} avatar key={entry[0]}>
                      <Left>
                        <Thumbnail
                          source={{
                            uri:
                              'https://cdn3.iconfinder.com/data/icons/account-1/64/Account-06-512.png',
                          }}
                        />
                      </Left>
                      <Body>
                        <Text>Unassigned</Text>
                      </Body>
                      <Right style={styles.price}>
                        <Text style={{ color: 'orange' }}>
                          {numeral(entry[1]).format('$0,0.00')}
                        </Text>
                      </Right>
                    </ListItem>
                    <Separator bordered style={styles.userSplits}>
                      <Text style={styles.dividerText}>USER SPLITS</Text>
                    </Separator>
                  </React.Fragment>
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
                        {numeral(Math.abs(entry[1])).format('$0,0.00')}
                      </Text>
                    </Right>
                  </ListItem>
                );
              }
            })}
            <Separator bordered style={styles.totalDivider}>
              <Text style={styles.dividerText}>YOUR NET TOTAL</Text>
            </Separator>
            <ListItem avatar style={styles.lineItemRow}>
              <Left>
                <Thumbnail
                  source={{ uri: members[this.props.id].imageUrl }}
                  style={{
                    borderWidth: 4,
                    borderColor: members[this.props.id].color
                      ? members[this.props.id].color
                      : randomColor({
                          luminosity: 'light',
                          hue: 'random',
                        }).toString(),
                  }}
                />
              </Left>
              <Body>
                <Text>{members[this.props.id].username}</Text>
              </Body>
              <Right style={styles.price}>
                <Text
                  style={{ color: this.calculateTotal() > 0 ? 'red' : 'green' }}
                >
                  {numeral(Math.abs(this.calculateTotal())).format('$0,0.00')}
                </Text>
              </Right>
            </ListItem>
          </List>
        </Content>

        {!this.props.navigation.getParam('history') && this.state.event.status && (
          <Footer style={styles.footer}>
            <Button
              danger={this.isReadyToClose()}
              disabled={!this.isReadyToClose()}
              block
              style={styles.button}
              onPress={this.closeEvent}
            >
              <Icon
                type="MaterialCommunityIcons"
                name="close-circle"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>CHECKOUT THE EVENT</Text>
            </Button>
          </Footer>
        )}
      </Container>
    );
  }
}

const mapState = state => ({
  id: state.user.currentUser.id,
  event: state.event.eventId,
});

export default connect(mapState)(Status);
