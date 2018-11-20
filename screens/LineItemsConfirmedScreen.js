import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Content, Button, Icon } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { LineItemsConfirmed, MyHeader, DeleteButton } from '../components';
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
  confirmItemsButton: {
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

export default class LineItemsConfirmedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptNameVisible: false,
      addGroupMemberVisible: false,
      receiptLineItems: [],
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
            <Button
              success
              block
              style={styles.confirmItemsButton}
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