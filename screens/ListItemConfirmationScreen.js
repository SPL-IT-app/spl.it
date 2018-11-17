import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  Container,
  Content,
  Header,
  Button,
  Icon
} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import CameraProcessing from '../components/utilities/CameraProcessing';
import LineItems from '../components/LineItems'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '60%',
    alignSelf: 'center',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '15%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
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
  }
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
        <Header />
        <Content>
          <View>
            <Grid>
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
                return (
                  <LineItems key={idx} lineItem={lineItem} idx={idx}/>
                );
              })}
            </Grid>
          </View>
          <View>
            <Button>
              <Icon type="MaterialCommunityIcons" name="plus" />
            </Button>
          </View>
          <View>
            <Button info large block style={styles.button} onPress={() => {}}>
              <Text>Confirm Items</Text>
            </Button>
          </View>
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
  return {};
};
export default connect(
  mapState,
  mapDispatch
)(ListItemConfirmationScreen);
