import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Content, Button, Icon, Footer } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {
  LineItemsConfirmed,
  MyHeader,
  DeleteButton,
  EventMembers,
  BackButton,
} from '../components';
const { makeRef } = require('../server/firebaseconfig');
import Dialog from 'react-native-dialog';

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
  footer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingBottom: 15,
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
      tipPercent: null,
      dialogVisible: false
    };
    this.receiptRef = this.props.navigation.getParam(
      'receiptRef',
      'refWasNotPassed'
    );
  }

  componentDidMount = () => {
    this.receiptRefUrl = makeRef(this.receiptRef);
    let lineItems = {};
    let tipPercent = null
    this.receiptRefUrl.on('value', snapshot => {
      lineItems = snapshot.val();
      console.log("SNAPSHOT TIP PERCENT ===> ", snapshot.val().tipPercent)
      tipPercent = snapshot.val().tipPercent
      this.setState({tipPercent: tipPercent})
    });
    console.log("TIP PERCENT FROM FIREBASE ====>", tipPercent)
    this.setState({ receiptLineItems: Object.entries(lineItems)});
  };

  componentWillUnmount = () => {
    this.receiptRefUrl.off();
  }

  handleTipChange = (event) => {
    this.setState({ tipPercent: event });
  }

  handleSaveReceipt = async () => {
    console.log("TIP PERCENT ====>", this.state.tipPercent)
    if (!this.state.tipPercent) {
      this.setState({ dialogVisible: true });
    } else {
      await this.handleSubmitTip();
      this.props.navigation.navigate('Home')
    }
  }

  handleSubmitTip = () => {
    this.setState({ dialogVisible: false });
    this.receiptRefUrl = makeRef(this.receiptRef);
    this.receiptRefUrl.update({tipPercent: Number(this.state.tipPercent)})
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  }

  render() {
    const receipt = this.state.receiptLineItems
    return (
      <Container>
        <MyHeader title="Add Members" right={() => <BackButton />} />

        <Content style={styles.content}>
          <Grid>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>Tip Percent</Dialog.Title>
              <Dialog.Description>
                Please enter a tip %
              </Dialog.Description>
              <Dialog.Input lable="test" onChangeText={this.handleTipChange} />
              <Dialog.Button label="Cancel" onPress={this.handleCancel} />
              <Dialog.Button
                label="Enter"
                onPress={async () => {
                  await this.handleSubmitTip();
                  this.props.navigation.navigate('Home')
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
        <Footer style={styles.avatarFooter}>
          <EventMembers members={this.state.eventMemberProfiles} />
        </Footer>
        <Footer style={styles.footer}>
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
        </Footer>

        <Footer style={styles.footer}>
          <Button
            success
            block
            style={styles.button}
            onPress={() => {
              this.handleSaveReceipt()
            }}
          >
            <Text style={styles.buttonText}> SAVE RECEIPT </Text>
          </Button>
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
