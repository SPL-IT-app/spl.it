import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Container, Button, Icon, List, ListItem } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import  CameraProcessing  from '../components/utilities/CameraProcessing';

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
        <View>
          {/* <Grid> */}
              {receipt.map((lineItem, idx) => {
                return <Text key={idx}>{lineItem.name}</Text>;
              })}
          {/* </Grid> */}
        </View>
        <View>
          <Button>
            <Icon type="MaterialCommunityIcons" name="plus" />
          </Button>
        </View>
        <View >
          <Button info large block style={styles.button} onPress={() => {}}>
            <Text>Confirm Items</Text>
          </Button>
        </View>
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
