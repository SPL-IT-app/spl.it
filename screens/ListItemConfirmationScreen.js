import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  Container,
  Content,
  Header,
  Button,
  Icon,
  List,
  ListItem,
  Form,
  Item,
  Picker,
  Input,
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
  grid: {
    height: 150,
    width: 50,
    backgroundColor: 'yellow',
  },
});

export class ListItemConfirmationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    receipt: this.props.receipt
  }

  handleChange = (event, idx) => {
    this.setState ({
      receipt: {}
    })
  }

  render() {
    const { receipt } = this.props;
    console.log('RECEIPT =====>', receipt);
    return receipt.length ? (
      <Container>
        <Header />
        <Content>
          <View>
            <Grid>
              <Row>
                <Col>
                  <Text>QTY</Text>
                </Col>
                <Col>
                  <Text>DESCRIPTION</Text>
                </Col>
                <Col>
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
