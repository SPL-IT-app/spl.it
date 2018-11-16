import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebBrowser } from 'expo';
import CameraView from '../components/CameraView';
import { Button, Icon, Content, Container } from 'native-base';
import MyHeader from '../components/Header';

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

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <MyHeader title='Events' />
        <Container style={styles.container}>
          <Button
            rounded
            info
            large
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate('Camera');
            }}
          >
            <Text>New Receipt</Text>
            <Icon name="ios-camera" style={styles.icon} />
          </Button>
        </Container>
      </Container>
    );
  }
}
