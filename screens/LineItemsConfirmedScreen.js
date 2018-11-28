import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Content, Footer, Input, Item } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {
  LineItemsConfirmed,
  MyHeader,
  EventMembers,
  BackButton,
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  amountText: {
    width: '100%',
    textAlign: 'right',
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
    alignItems: 'center',
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
  footer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingBottom: 15,
    height: 'auto',
  },
  avatarFooter: {
    borderColor: 'transparent',
    height: 'auto',
  },
});

export class LineItemsConfirmedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptLineItems: [],
      tipPercent: '0',
      eventStatus: true,
      taxPercent: '10.25',
    };
    this.receiptRef = this.props.navigation.getParam(
      'receiptRef',
      'refWasNotPassed'
    );
  }

  componentDidMount = () => {
    this.receiptRefUrl = makeRef(this.receiptRef);
    let newItem;

    this.receiptRefUrl.on('value', snapshot => {
      this.setState({ tipPercent: snapshot.val().tipPercent });
    });

    this.receiptRefUrl.on('child_added', snapshot => {
      const newArr = this.state.receiptLineItems.slice();
      if (snapshot.hasChildren()) {
        newItem = { id: snapshot.key, info: snapshot.val() };
        newArr.push(newItem);
        this.setState(prevState => ({
          receiptLineItems: [
            ...prevState.receiptLineItems,
            { id: snapshot.key, info: snapshot.val() },
          ],
        }));
      }
    });

    this.receiptRefUrl.on('child_removed', snapshot => {
      let newArr = this.state.receiptLineItems.slice();
      if (snapshot.hasChildren()) {
        newArr = newArr.filter(item => {
          return item.id !== snapshot.key;
        });
      }
      this.setState({
        receiptLineItems: newArr,
      });
    });

    if (this.props.event.length) {
      this.eventStatus = makeRef(`/events/${this.props.event}/status`).on(
        'value',
        snapshot => {
          this.setState({ eventStatus: snapshot.val() });
        }
      );
    }
  };

  componentWillUnmount = () => {
    this.receiptRefUrl.off();
  };

  checkStatus = () => {
    if (!this.state.eventStatus) {
      this.props.navigation.navigate('Status', { eventId: this.props.event });
    }
  };

  render() {
    this.checkStatus();
    const receipt = this.state.receiptLineItems;
    return (
      <Container>
        <MyHeader title="Assign Items" right={() => <BackButton />} />

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
            {receipt.map(lineItem => {
              return (
                <LineItemsConfirmed
                  key={lineItem.id}
                  dataRef={this.receiptRef}
                  id={lineItem.id}
                  lineItem={lineItem.info}
                />
              );
            })}
            <Row style={styles.lastRow} />
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
                  <Text style={styles.amountText}>{this.state.tipPercent}</Text>
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
                  <Text style={styles.amountText}>{this.state.taxPercent}</Text>
                </Col>
                <Col style={styles.percentSign}>
                  <Text>%</Text>
                </Col>
              </Row>
            </Grid>
          </Footer>
        <Footer style={styles.avatarFooter}>
          <EventMembers
            members={this.state.eventMemberProfiles}
            display={true}
          />
        </Footer>
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
