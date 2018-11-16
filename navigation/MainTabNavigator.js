import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Footer, FooterTab, Text, Button, Icon, Content, Container } from 'native-base'

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/Profile';
import SettingsScreen from '../screens/SettingsScreen'
import MyHeader from '../components/Header';
//import LoginScreen from '../screens/LoginScreen'


const HomeStack = createStackNavigator({
  Home: HomeScreen,
} , {headerMode: 'none'});

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

const ProfileStack = createStackNavigator({
  Links: LinksScreen,
}, {headerMode: 'none'});

// LinksStack.navigationOptions = {
//   tabBarLabel: 'Links',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
//     />
//   ),
// };

const MoreStack = createStackNavigator({
  Settings: SettingsScreen,
}, {headerMode:'none'});

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
  ProfileStack,
  MoreStack,
}, {
  tabBarComponent: props => {
    return (
        <Footer>
          <FooterTab>
            <Button
              active={props.navigation.state.index === 0}
              onPress={() => props.navigation.navigate("HomeStack")}
            >
              <Icon name='calendar' />
              <Text>
                Events
              </Text>
            </Button>
            <Button
              active = {props.navigation.state.index === 1}
              onPress={() => props.navigation.navigate("ProfileStack")}
            >
              <Icon type= 'MaterialCommunityIcons' name='account' />
              <Text>
                Profile
              </Text>
            </Button>
            <Button
              active={props.navigation.state.index === 2}
              onPress={() => props.navigation.navigate("MoreStack")}
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
