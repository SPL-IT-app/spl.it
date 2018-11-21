import React, { Component } from 'react';
import { Container, Content, Spinner } from 'native-base';

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class CameraProcessing extends Component {
  state = {};

  componentDidMount() {
    // this.makeRef;
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <Spinner />
        </Content>
      </Container>
    );
  }
}
