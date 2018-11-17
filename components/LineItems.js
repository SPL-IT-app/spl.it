import React from 'react';
import { Item, Input } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { updateLineItem } from '../store';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  lineItemRow: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  formInput: {
    borderColor: 'transparent',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantity: {
    width: '15%',
    backgroundColor: 'yellow',
  },
  description: {
    width: '60%',
    backgroundColor: 'blue'
  },
  price: {
    width: '25%',
    backgroundColor: 'orange'
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
    console.log("EVENT=====>", event)
    await this.setState({
      [type]: event,
    });
    this.props.updateLineItem(this.state, this.props.idx);
  };

  render() {
    console.log('STATE ======>>', this.state);
    return (
      <Row style={styles.lineItemRow}>
        <Col style={styles.quantity}>
          <Item type="number" style={styles.formInput}>
            <Input
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
