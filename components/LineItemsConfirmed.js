import React from 'react';
import { Item } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';

import { StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
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

class LineItemsConfirmed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.dataRef + '/' + this.props.id,
      lineItem: this.props.lineItem,
      index: this.props.idx,
      colors: [],
      selected: false,
    };
  }

  componentDidMount() {
    this.lineItemRef = makeRef(this.state.id);
    this.lineItemRef.child('/users').on('child_added', snapshot => {
      const colorRef = makeRef(`/profiles/${snapshot.key}/color`);
      colorRef.once('value', color => {
        this.setState({
          colors: [...this.state.colors, color.val()],
        });
      });
    });
    this.lineItemRef.child('/users').on('child_removed', snapshot => {
      const colorRef = makeRef(`/profiles/${snapshot.key}/color`);
      colorRef.once('value', colSnap => {
        const newColors = this.state.colors.filter(
          color => color !== colSnap.val()
        );
        this.setState({
          colors: newColors,
        });
      });
    });
  }

  toggleSelected() {
    this.setState({
      selected: !this.state.selected,
    });
  }

  handlePress() {
    if (!this.state.selected) {
      this.lineItemRef.child('/users').update({ [this.props.user]: true });
    } else {
      this.lineItemRef.child(`/users/${this.props.user}`).remove();
    }
    this.toggleSelected();
  }

  render() {
    // const color =
    return (
      <Row
        button
        style={{
          ...styles.lineItemRow,
          backgroundImage: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        }}
      >
        <Col style={styles.quantity}>
          <Item type="number" style={styles.input}>
            <Text>1</Text>
          </Item>
        </Col>
        <Col style={styles.description}>
          <Item
            style={styles.input}
            onPress={() => {
              this.handlePress();
              console.log('pressed?');
            }}
          >
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

const mapState = state => {
  return {
    user: state.user.currentUser.id,
  };
};

export default connect(mapState)(LineItemsConfirmed);
