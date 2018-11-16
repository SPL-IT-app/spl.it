import React from 'react';
import { ScrollView, StyleSheet, Image, StatusBar } from 'react-native';
import { Container } from 'native-base';
import MyHeader from '../components/Header';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
    return (
      <Container>
        <MyHeader title='Profile' />
        <ScrollView style={styles.container}>

        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
