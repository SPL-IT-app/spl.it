import React from 'react';
import { Icon } from 'expo';

import Colors from '../constants/Colors';

import { Footer, FooterTab, Text } from 'native-base'

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
      // <Footer>
      //   <FooterTab>
      //     <Text>{this.props.name}</Text>
      //   </FooterTab>
      // </Footer>
    );
  }
}
