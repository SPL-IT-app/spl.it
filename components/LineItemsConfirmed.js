import React from 'react';
import { Item } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';

import { StyleSheet } from 'react-native';

import numeral from 'numeral';

const styles = StyleSheet.create({
  lineItemRow: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    height: 50,
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
  constructor() {
    super();
  }

  componentDidMount() {
    this.receiptRef = makeRef(`/events/`);
  }

  render() {
    return <MyHeader />;
  }
}
