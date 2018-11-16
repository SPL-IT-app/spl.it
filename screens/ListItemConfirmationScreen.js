import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Container, Button, Icon } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

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

export default class ListItemConfirmationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <View>
          <Grid />
        </View>
        <View>
          <Button>
            <Icon type="MaterialCommunityIcons" name="plus" />
          </Button>
        </View>
        <View style={styles.container}>
          <Button info large block style={styles.button} onPress={() => {}}>
            <Text>Confirm Items</Text>
          </Button>
        </View>
      </Container>
    );
  }
}
