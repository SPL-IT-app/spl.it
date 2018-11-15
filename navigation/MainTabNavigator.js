import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Footer, FooterTab, Text, Button, Icon } from 'native-base'

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen'
//import LoginScreen from '../screens/LoginScreen'


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

// HomeStack.navigationOptions = {
//   tabBarLabel: 'Home',
//   tabBarIcon: ({ focused }) => (
//     // <FooterTab>
//     //   <Text>HOME</Text>
//     // </FooterTab>
//     <TabBarIcon
//       focused={focused}
//       name={
//         Platform.OS === 'ios'
//           ? `ios-information-circle${focused ? '' : '-outline'}`
//           : 'md-information-circle'
//       }
//     />
//   ),
// };

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

// LinksStack.navigationOptions = {
//   tabBarLabel: 'Links',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
//     />
//   ),
// };

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

// SettingsStack.navigationOptions = {
//   tabBarLabel: 'Settings',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
//     />
//   ),
// };

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
}, {
  tabBarComponent: props => {
    return (
      <Footer>
        <FooterTab>
          <Button
            active={props.navigation.history === 'HomeStack'}
            onPress={() => props.navigation.navigate("HomeStack")}
          >
            <Icon name='calendar' />
            <Text>
              Events
            </Text>
          </Button>
          <Button
            // active={props.navigationState.index === 0}
            onPress={() => props.navigation.navigate("LinksStack")}
          >
            <Icon type= 'MaterialCommunityIcons' name='account' />
            <Text>
              Profile
            </Text>
          </Button>
          <Button
            // active={props.navigationState.index === 0}
            onPress={() => props.navigation.navigate("SettingsStack")}
          >
            <Icon name='more' />
            <Text>
              More
            </Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
});
