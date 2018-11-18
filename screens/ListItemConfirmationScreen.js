import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Container, Content, Header, Button, Icon, View } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import CameraProcessing from '../components/utilities/CameraProcessing';
import LineItems from '../components/LineItems';
import MyHeader from '../components/Header';
import { addLineItem } from '../store';


const styles = StyleSheet.create({
  // content: {
  //   flex: 1,
  //   backgroundColor: 'blue',
  // },
  icon: {
    margin: 0,
    padding: 0,
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
    color: 'white'
  },
});

export class ListItemConfirmationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { receipt } = this.props;
    console.log('RECEIPT =====>', receipt);
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
            <Button style={styles.addItemButton} onPress={() => {
              console.log('ITEM ADDED')
              this.props.addLineItem()
              }}>
              <Icon style={{'color': "black"}} type="MaterialCommunityIcons" name="plus" />
            </Button>
            <Button
              success
              block
              style={styles.confirmItemsButton}
              onPress={() =>
               console.log('items confirmed - pressed')
              }
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
