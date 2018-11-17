import React from 'react';
import { Item, Input } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { updateLineItem } from '../store';

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
      <Row>
        <Col>
          <Item type="number">
            <Input
              name="quantity"
              placeholder="quantity"
              value={this.state.quantity.toString()}
              onChangeText={this.handleChange('quantity')}
            />
          </Item>
        </Col>

        <Col>
          <Item>
            <Input
              name="description"
              placeholder="description"
              value={this.state.description}
              onChangeText={this.handleChange('description')}
            />
          </Item>
        </Col>

        <Col>
          <Item type="number">
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
