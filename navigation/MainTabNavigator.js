import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import {
  Footer,
  FooterTab,
  Text,
  Button,
  Icon,
  Content,
  Container,
} from 'native-base';

import {
  TabBarIcon,
  HomeScreen,
  Profile,
  More,
  ListItemConfirmationScreen,
  LineItemsConfirmedScreen,
  AddFriend,
  AddMemberToEventScreen,
  CameraView,
  SingleEvent,
  AllEvents,
  MoreScreen
} from '../screens';

import { MyHeader } from '../components';

//import LoginScreen from '../screens/LoginScreen'

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Camera: CameraView,
    ListConfirm: ListItemConfirmationScreen,
    Confirmed: LineItemsConfirmedScreen,
    SingleEvent: SingleEvent,
    AddMembers: AddMemberToEventScreen,
    AllEvents: AllEvents,
  },
  { headerMode: 'none', initialRouteName: 'Home' }
);

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

const ProfileStack = createStackNavigator(
  {
    Profile: Profile,
    AddFriend: AddFriend,
  },
  { headerMode: 'none' }
);

// LinksStack.navigationOptions = {
//   tabBarLabel: 'Links',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
//     />
//   ),
// };

const MoreStack = createStackNavigator(
  {
    More: More,
    AllEvents: AllEvents,
  },
  { headerMode: 'none' }
);

// SettingsStack.navigationOptions = {
//   tabBarLabel: 'Settings',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
//     />
//   ),
// };

export default createBottomTabNavigator(
  {
    HomeStack,
    ProfileStack,
    MoreStack,
  },
  {
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
            <Button
              active={props.navigation.state.index === 0}
              onPress={() => props.navigation.navigate('HomeStack')}
            >
              <Icon type="MaterialCommunityIcons" name="calendar" />
              <Text>Events</Text>
            </Button>
            <Button
              active={props.navigation.state.index === 1}
              onPress={() => props.navigation.navigate('ProfileStack')}
            >
              <Icon type="MaterialCommunityIcons" name="account" />
              <Text>Profile</Text>
            </Button>
            <Button
              active={props.navigation.state.index === 2}
              onPress={() => props.navigation.navigate('MoreStack')}
            >
              <Icon type="MaterialCommunityIcons" name="more" />
              <Text>More</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    },
  }
);
