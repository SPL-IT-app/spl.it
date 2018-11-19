import React from 'react';
import { Item } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';

import { StyleSheet, Text } from 'react-native';

import numeral from 'numeral';

const styles = StyleSheet.create({
  lineItemRow: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    height: 50,
  },
  input: {
    height: '100%',
    borderColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    width: '100%',
    textAlign: 'left',
  },
  quantity: {
    width: '15%',
  },
  description: {
    width: '60%',
  },
  price: {
    width: '25%',
  },
});

import { makeRef } from '../server/firebaseconfig';
import { MyHeader } from './index';

export default class LineItemsConfirmed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.dataRef + '/' + this.props.id,
      lineItem: this.props.lineItem,
      index: this.props.idx,
    };
  }

  componentDidMount() {
    this.lineItemRef = makeRef(this.state.id);
  }

  render() {
    console.log('lineItemRef ===> ', this.lineItemRef);
    return (
      <Row style={styles.lineItemRow}>
        <Col style={styles.quantity}>
          <Item type="number" style={styles.input}>
            <Text>1</Text>
          </Item>
        </Col>
        <Col style={styles.description}>
          <Item style={styles.input}>
            <Text style={styles.text}>{this.state.lineItem.name}</Text>
          </Item>
        </Col>
        <Col style={styles.price}>
          <Item type="number" style={styles.input}>
            <Text>{numeral(this.state.lineItem.price).format('$0,0.00')}</Text>
          </Item>
        </Col>
      </Row>
    );
  }
}
