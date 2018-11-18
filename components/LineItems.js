import React from 'react';
import { Item, Input } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { updateLineItem } from '../store';
import {StyleSheet} from 'react-native';
import numeral from 'numeral'



const styles = StyleSheet.create({
  lineItemRow: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    height: 50
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
    textAlign: 'center'
  },
  quantity: {
    width: '15%',
  },
  description: {
    width: '60%',
  },
  price: {
    width: '25%',
  }
});

export class LineItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: this.props.lineItem.quantity,
      price: this.props.lineItem.price,
      description: this.props.lineItem.name,
    };
  }

  handleChange = type => async event => {
    await this.setState({
      [type]: event,
    });
    this.props.updateLineItem(this.state, this.props.idx);
  };

  render() {
    return (
      <Row style={styles.lineItemRow}>
        <Col style={styles.quantity}>
          <Item type="number" style={styles.formInput}>
            <Input
              style ={styles.inputText}
              name="quantity"
              placeholder="quantity"
              value={this.state.quantity.toString()}
              onChangeText={this.handleChange('quantity')}
            />
          </Item>
        </Col>

        <Col style={styles.description}>
          <Item style={styles.formInput}>
            <Input
              name="description"
              placeholder="description"
              value={this.state.description}
              onChangeText={this.handleChange('description')}
            />
          </Item>
        </Col>

        <Col style={styles.price}>
          <Item type="number" style={styles.formInput}>
            <Input
              style ={styles.inputText}
              name="price"
              placeholder="price"
              value={this.state.price.toString()}
              onChangeText={this.handleChange('price')}
            />
          </Item>
        </Col>
      </Row>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    updateLineItem: (lineItem, idx) => {
      dispatch(updateLineItem(lineItem, idx));
    },
  };
};

export default connect(
  null,
  mapDispatch
)(LineItems);
