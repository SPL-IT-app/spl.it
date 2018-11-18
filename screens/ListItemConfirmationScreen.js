import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Content, Button, Icon } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import CameraProcessing from '../components/utilities/CameraProcessing';
import LineItems from '../components/LineItems';
import MyHeader from '../components/Header';
import { addLineItem } from '../store';
const {makeRef} = require('../server/firebaseconfig')


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

export class ListItemConfirmationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  handleConfirmItems = () => {
    console.log('ITEMS CONFIRMED')
    const eventsRef = makeRef('/events')
    const usersRef = makeRef('/users')


  }

  render() {
    const { receipt } = this.props;
    return receipt.length ? (
      <Container>
        <MyHeader title="Confirmation" />
        <Content style={styles.content}>
          <Grid style={styles.grid}>
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
              return <LineItems key={idx} lineItem={lineItem} idx={idx} />;
            })}
            <Button
              style={styles.addItemButton}
              onPress={() => {
                console.log('ITEM ADDED');
                this.props.addLineItem();
              }}
            >
              <Icon
                style={{ color: 'black' }}
                type="MaterialCommunityIcons"
                name="plus"
              />
            </Button>
            <Button
              success
              block
              style={styles.confirmItemsButton}
              onPress={this.handleConfirmItems}
            >
              <Text style={styles.buttonText}> CONFIRM ITEMS </Text>
            </Button>
            <Row style={styles.lastRow} />
          </Grid>
        </Content>
      </Container>
    ) : (
      <CameraProcessing />
    );
  }
}

const mapState = state => {
  return {
    receipt: state.receipt.receipt,
  };
};

const mapDispatch = dispatch => {
  return {
    addLineItem: () => {
      dispatch(addLineItem());
    },
  };
};

export default connect(
  mapState,
  mapDispatch
)(ListItemConfirmationScreen);
