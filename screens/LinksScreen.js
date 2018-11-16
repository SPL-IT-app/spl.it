import React from 'react';
import { ScrollView, StyleSheet, Image, StatusBar } from 'react-native';
import { Header, Body, Title, Left, Right, Button, Icon, Thumbnail, Container } from 'native-base';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
              {/* <Icon name='menu' /> */}
              <Image resizeMode='stretch'
            source={require('../assets/images/logo.png')}
            style={{width:57, height:30}}
          />
          {/* <Thumbnail square large source={{ uri: '../assets/images/logo.png' }} /> */}

          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right />
        </Header>
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
