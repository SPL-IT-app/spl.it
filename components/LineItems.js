import React from 'react';
import { Item, Input } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import {connect} from 'react-redux'
import {updateLineItem} from '../store'

export class LineItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: this.props.lineItem.quantity,
      price: this.props.lineItem.price,
      description: this.props.lineItem.name,
    };
  }

  // componentDidMount() {
  //   this.setState({
  //     quantity: this.props.lineItem.quantity,
  //     price: this.props.lineItem.price,
  //     description: this.props.lineItem.description,
  //   });
  // }

  // componentDidUpdate (prevProps, prevState) {
  //   if(prevState !== this.state){
  //     this.setState({
  //       quantity: this.props.lineItem.quantity,
  //       price: this.props.lineItem.price,
  //       description: this.props.lineItem.description,
  //     });
  //   }
  // }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.props.updateLineItem(this.state, this.props.idx)
  };

  render() {
    console.log("STATE ======>>", this.state)
    return (
      <Row>
        <Col>
          <Item>
            <Input
              name="quantity"
              placeholder="quantity"
              value={this.state.quantity}
              onChangeText={this.handleChange}
            />
          </Item>
        </Col>

        <Col>
          <Item>
            <Input
              name="description"
              placeholder="description"
              value={this.state.description}
              onChangeText={this.handleChange}
            />
          </Item>
        </Col>

        <Col>
          <Item>
            <Input
              name="price"
              placeholder="price"
              value={this.state.price}
              onChangeText={this.handleChange}
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
      dispatch(updateLineItem(lineItem, idx))
    }
  }
}


export default connect(null, mapDispatch)(LineItems)
