import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import CameraView from '../components/CameraView';
import SignUpScreen from '../screens/SignUpScreen';
import ListItemConfirmationScreen from '../screens/ListItemConfirmationScreen';

export default createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Login: LoginScreen,
    SignUp: SignUpScreen,
    Camera: CameraView,
    ListConfirm: ListItemConfirmationScreen,
  },
  {
    initialRouteName: 'Login',
  }
);
