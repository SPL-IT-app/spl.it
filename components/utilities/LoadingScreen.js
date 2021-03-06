import React, { Component } from 'react';
import { Container, Spinner, Content } from 'native-base';

import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class LoadingScreen extends Component {
  state = {};

  componentDidMount() {
    // this.makeRef;
  }

  render() {
    return (
      <Container style={styles.container}>
        <Spinner color='#159192'/>
        <Text>Loading...</Text>
      </Container>
    );
  }
}
