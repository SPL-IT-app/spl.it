import React from 'react';
import { Button, Form, Container, Item, Input, Label, Text } from 'native-base';
import firebase from '../server/firebaseconfig';
import { getUser } from '../store/';
import { connect } from 'react-redux';

import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
    letterSpacing: 2
  },
  signUpText: {
    marginTop: 20,
    letterSpacing: 2
  },
  signUp: {
    fontWeight: 'bold',
    color: '#159192',
  },
  logoText: {
    textAlign: 'center',
    paddingBottom: 30,
    fontSize: 50,
    fontWeight: '200',
    letterSpacing: 15,
  },
  button: {
    marginTop: 20,
  },
  form: {
      width: '100%',
  }
});

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'pug@email.com',
      password: '123456',
    };
  }

  loginUser = (email, password) => {
    const { getUser } = this.props;
    try {
      if (this.state.password.length < 6) {
        alert('Please enter at least 6 characters');
        return;
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          getUser({ id: user.user.uid });
        });
      this.props.navigation.navigate('Main');
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
        <Container style={styles.root}>
      <Container style={styles.container}>
        <Text style={styles.logoText}>SPL/IT</Text>
        <Form style={styles.form}>
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
            warning
            block
            style={styles.button}
            onPress={() =>
              this.loginUser(this.state.email, this.state.password)
            }
          >
            <Text style={styles.text}> LOGIN </Text>
          </Button>
        </Form>
        <View>
          <Text style={styles.signUpText}> New to SPL/IT? <Text
            style={styles.signUp}
            onPress={() => this.props.navigation.navigate('SignUp')}
          >
            Sign Up
          </Text></Text>

        </View>
      </Container>
      </Container>
    );
  }
}

export default connect(
  null,
  { getUser }
)(LoginScreen);
