import React from 'react';
import {
  Button,
  Form,
  Label,
  Item,
  Input,
  Text,
  View,
  Icon,
  Container,
} from 'native-base';

import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native';

import firebase from '../server/firebaseconfig';
import { getUser } from '../store/';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: '200',
    letterSpacing: 2,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
  icon: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
  },
});



class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      username: '',
    };
  }

  signUpUser = (email, password) => {
    const { getUser } = this.props;
    try {
      if (this.state.password.length < 6) {
        Alert.alert('Error', 'Please enter at least 6 characters');
        return;
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(user => {
            const { firstName, lastName, phone, username } = this.state;
            firebase
              .database()
              .ref('users')
              .update({
                [user.user.uid]: {
                  firstName,
                  lastName,
                  phone,
                  email,
                },
              });
            firebase
              .database()
              .ref('profiles')
              .update({
                [user.user.uid]: {
                  imageUrl: 'https://bit.ly/2qQRtn6',
                  username,
                },
              });
            getUser({ id: user.user.uid });
          });
        this.props.navigation.navigate('Main');
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <Container style={styles.root}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.icon}>
            <TouchableOpacity>
              <Icon
                type="MaterialCommunityIcons"
                name="arrow-left"
                onPress={() => this.props.navigation.navigate('Login')}
              />
            </TouchableOpacity>
          </View>
          <Form style={styles.form}>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                value={this.state.username}
                onChangeText={username => this.setState({ username })}
              />
            </Item>
            <Item floatingLabel>
              <Label>First Name</Label>
              <Input
                value={this.state.firstName}
                autoCorrect={false}
                onChangeText={firstName => this.setState({ firstName })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Last Name</Label>
              <Input
                value={this.state.lastName}
                autoCorrect={false}
                onChangeText={lastName => this.setState({ lastName })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                keyboardType="email-address"
                value={this.state.email}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Phone</Label>
              <Input
                returnKeyType="done"
                keyboardType="phone-pad"
                maxLength={11}
                dataDetectorTypes="phoneNumber"
                value={this.state.phone}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={phone => this.setState({ phone })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                value={this.state.password}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={password => this.setState({ password })}
              />
            </Item>
            <Button
              success
              block
              style={styles.button}
              onPress={() =>
                this.signUpUser(this.state.email, this.state.password)
              }
            >
              <Text style={styles.text}>SIGN UP</Text>
            </Button>
          </Form>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default connect(
  null,
  { getUser }
)(SignUpScreen);
