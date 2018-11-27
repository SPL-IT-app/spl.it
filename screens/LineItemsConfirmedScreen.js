import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Container,
  Content,
  Footer,
  Input,
  Item
} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {
  LineItemsConfirmed,
  MyHeader,
  EventMembers,
  BackButton,
} from '../components';
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
  tiptax: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
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
    alignItems: 'center',
    width: '25%',
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
      tipPercent: 0,
      dialogVisible: false,
      eventStatus: true,
      taxPercent: 0
    };
    this.receiptRef = this.props.navigation.getParam(
      'receiptRef',
      'refWasNotPassed'
    );
  }

  componentDidMount = () => {
    this.receiptRefUrl = makeRef(this.receiptRef);
    let lineItems = {};
    let tipPercent = null;
    this.receiptRefUrl.on('value', snapshot => {
      lineItems = snapshot.val();
      tipPercent = snapshot.val().tipPercent;
      this.setState({ tipPercent: tipPercent });
    });
    this.setState({ receiptLineItems: Object.entries(lineItems) });

    this.eventStatus = makeRef(`/events/${this.props.event}/status`).on(
      'value',
      snapshot => {
        this.setState({ eventStatus: snapshot.val() });
      }
    );
  };

  componentWillUnmount = () => {
    this.receiptRefUrl.off();
  };

  handleTipChange = event => {
    this.setState({ tipPercent: event });
  };

  handleSaveReceipt = async () => {
    if (!this.state.tipPercent) {
      this.setState({ dialogVisible: true });
    } else {
      await this.handleSubmitTip();
      this.props.navigation.navigate('Home');
    }
  };

  handleSubmitTip = () => {
    this.setState({ dialogVisible: false });
    this.receiptRefUrl = makeRef(this.receiptRef);
    this.receiptRefUrl.update({ tipPercent: Number(this.state.tipPercent) });
  };

  handleChange = async () => {
    await this.setState({
      [type]: event,
    });
  }

  handleChange = type => async event => {
    console.log("TIP OR TAX CHANGED ====>", type, event)
    await this.setState({
      [type]: event,
    });
  };

  render() {
    if (this.state.eventStatus) {
      const receipt = this.state.receiptLineItems;
      return (
        <Container>
          <MyHeader title="Assign Items" right={() => <BackButton />} />

          <Content style={styles.content}>
            <Grid>
              <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Tip Percent</Dialog.Title>
                <Dialog.Description>Please enter a tip %</Dialog.Description>
                <Dialog.Input
                  lable="test"
                  onChangeText={this.handleTipChange}
                />
                <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                <Dialog.Button
                  label="Enter"
                  onPress={async () => {
                    await this.handleSubmitTip();
                    this.props.navigation.navigate('Home');
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
                  <Text style={styles.inputText}>20%</Text>
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
                      name="name"
                      placeholder="0%"
                      value={this.state.taxPercent}
                      onChangeText={this.handleChange('tax')}
                    />
                  </Item>
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
          {/* <Footer style={styles.footer}>
            <Button
              success
              block
              style={styles.button}
              onPress={() => {
                this.handleSaveReceipt();
              }}
            >
              <Text style={styles.buttonText}> SAVE RECEIPT </Text>
            </Button>
          </Footer> */}
        </Container>
      );
    } else {
      return <Status />;
    }
  }
}

const mapState = state => {
  return {
    user: state.user.currentUser.id,
    event: state.event.eventId,
  };
};

export default connect(mapState)(LineItemsConfirmedScreen);
