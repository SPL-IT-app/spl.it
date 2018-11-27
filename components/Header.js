import React, { Component } from 'react';
import {
  Header,
  Body,
  Title,
  Left,
  Right,
  Button,
  Icon,
  Thumbnail,
  Container,
  Subtitle
} from 'native-base';
import { Image, Platform, View } from 'react-native';
import { Asset, Constants } from 'expo';
import { BackButton, DeleteButton } from './index';

export class MyHeader extends Component {
  render() {
    return (
      <View>
          <View
            style={{
              backgroundColor: "#b3b3cc",
              height: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
            }}
          />
        <Header>
          <Left>
            <Image
              resizeMode="stretch"
              source={require('../assets/images/logo.png')}
              style={{ width: 57, height: 30 }}
              fadeDuration={0}
            />
          </Left>
          <Body>
            <Title>{this.props.title}</Title>
            {this.props.subtitle && <Subtitle>{this.props.subtitle}</Subtitle>}
          </Body>
          <Right>{this.props.right ? this.props.right() : null}</Right>
        </Header>

      </View>
    );
  }
}

export default MyHeader;
