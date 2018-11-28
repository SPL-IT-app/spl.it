import React from 'react';
import { Item, Input } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { updateLineItem, removeLineItem } from '../store';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import Swipeable from 'react-native-swipeable';

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
    width: '57%',
  },
  price: {
    width: '25%',
  },
  dummy: {
    width: '3%',
  },
  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#FF7E79',
    height: '100%',
  },
  deleteText: {
    paddingLeft: 15,
    color: 'white',
  },
});

export class LineItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: this.props.lineItem.quantity,
      price: this.props.lineItem.price,
      name: this.props.lineItem.name,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        quantity: this.props.lineItem.quantity,
        price: this.props.lineItem.price,
        name: this.props.lineItem.name,
      });
    }
  }

  handleChange = type => async event => {
    await this.setState({
      [type]: event,
    });
    this.props.updateLineItem(this.state, this.props.idx);
  };

  handleRemoveItem = () => {
    this.swipeable.recenter();
    this.props.removeLineItem(this.props.idx);
  };

  swipeable = null;

  render() {
    return (
      <Swipeable
        onRef={ref => (this.swipeable = ref)}
        key={this.props.idx}
        rightButtons={[
          <TouchableHighlight
            key={this.props.idx}
            style={styles.deleteButton}
            onPress={this.handleRemoveItem}
          >
            <Text style={styles.deleteText}>DELETE</Text>
          </TouchableHighlight>,
        ]}
      >
        <Row style={styles.lineItemRow}>
          <Col style={styles.quantity}>
            <Item type="number" style={styles.formInput}>
              <Input
                style={styles.inputText}
                keyboardType="phone-pad"
                returnKeyType="done"
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
                name="name"
                placeholder="description"
                value={this.state.name}
                onChangeText={this.handleChange('name')}
              />
            </Item>
          </Col>

          <Col style={styles.price}>
            <Item type="number" style={styles.formInput}>
              <Input
                style={styles.inputText}
                keyboardType="phone-pad"
                returnKeyType="done"
                name="price"
                placeholder="price"
                value={this.state.price.toString()}
                onChangeText={this.handleChange('price')}
              />
            </Item>
          </Col>
          <Col style={styles.dummy} />
        </Row>
      </Swipeable>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    updateLineItem: (lineItem, idx) => {
      dispatch(updateLineItem(lineItem, idx));
    },
    removeLineItem: lineItem => {
      dispatch(removeLineItem(lineItem));
    },
  };
};

export default connect(
  null,
  mapDispatch
)(LineItems);
