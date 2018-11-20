import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Content, Button, Icon } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {
  LineItemsConfirmed,
  MyHeader,
  DeleteButton,
  EventMembers,
} from '../components';
const { makeRef } = require('../server/firebaseconfig');

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
  button: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
  addItemButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
});

export class LineItemsConfirmedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptNameVisible: false,
      addGroupMemberVisible: false,
      receiptLineItems: [],
      eventMemberProfiles: [],
    };
    this.receiptRef = this.props.navigation.getParam(
      'receiptRef',
      'refWasNotPassed'
    );
  }

  componentDidMount = () => {
    this.receiptRefUrl = makeRef(this.receiptRef);
    let lineItems = {};
    this.receiptRefUrl.on('value', snapshot => {
      lineItems = snapshot.val();
    });
    this.setState({ receiptLineItems: Object.entries(lineItems) });

    this.eventMembersRef = makeRef(`/events/${this.props.event}/members`);
    this.eventMembersRef.on('child_added', snapshot => {
      const profileRef = makeRef(`/profiles/${snapshot.key}`);
      profileRef.once('value', profileSnapshot =>
        this.setState({
          eventMemberProfiles: [
            ...this.state.eventMemberProfiles,
            profileSnapshot.val(),
          ],
        })
      );
    });
    this.eventMembersRef.on('child_removed', snapshot => {
      const profileRef = makeRef(`/profiles/${snapshot.key}`);
      profileRef.once('value', profileSnapshot => {
        const newArr = [...this.state.eventMemberProfiles].filter(member => {
          return member.username !== profileSnapshot.val().username;
        });
        this.setState({ eventMemberProfiles: newArr });
      });
    });
  };

  componentWillUnmount() {
    this.receiptRefUrl.off();
  }

  render() {
    const receipt = this.state.receiptLineItems;
    return (
      <Container>
        <MyHeader
          title="Confirmation"
          right={() => (
            <DeleteButton
              url={this.receiptRef}
              navigation={this.props.navigation}
            />
          )}
        />
        <Content style={styles.content}>
          <Grid>
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
              if (typeof lineItem[1] === 'object') {
                return (
                  <LineItemsConfirmed
                    key={idx}
                    dataRef={this.receiptRef}
                    id={lineItem[0]}
                    lineItem={lineItem[1]}
                    idx={idx}
                  />
                );
              }
            })}
            <EventMembers members={this.state.eventMemberProfiles} />
            <Button
              warning
              block
              style={styles.button}
              onPress={() => {
                this.props.navigation.navigate('AddMembers');
              }}
            >
              <Icon
                type="MaterialCommunityIcons"
                name="account-multiple-plus"
                style={styles.icon}
              />
              <Text style={styles.buttonText}> ADD MEMBERS </Text>
            </Button>
            <Button
              success
              block
              disabled
              style={styles.button}
              // onPress={this.handleConfirmItems}
            >
              <Text style={styles.buttonText}> SAVE RECEIPT </Text>
            </Button>
            <Row style={styles.lastRow} />
          </Grid>
        </Content>
      </Container>
    );
  }
}

const mapState = state => {
  return {
    user: state.user.currentUser.id,
    event: state.event.eventId,
  };
};

export default connect(mapState)(LineItemsConfirmedScreen);
