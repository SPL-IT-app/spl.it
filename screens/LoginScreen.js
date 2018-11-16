import React from 'react'
import * as firebase from 'firebase'
//const {firebaseRef} = require('../server/firebaseconfig')
import {
    Button,
    Form,
    Container,
    Content,
    Item,
    Input,
    Label,
    Text,
} from 'native-base'

import { StyleSheet, View } from 'react-native'
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "spl-it-91619.firebaseapp.com",
    databaseURL: "https://spl-it-91619.firebaseio.com",
    projectId: "spl-it-91619",
    storageBucket: "spl-it-91619.appspot.com"
}

firebase.initializeApp(firebaseConfig)

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }
    

    signUpUser = (email, password) => {
        console.log(firebase, '1<<<<<<')
        try {
            if (this.state.password.length < 6) {
                alert('Please enter at least 6 characters')
                return
            }
            firebase.auth().createUserWithEmailAndPassword(email, password)
            this.props.navigation.navigate('Main')
        } catch (err) {
            console.error(err)
        }
    }

    loginUser = (email, password) => {
        console.log(firebase, '2<<<<<<')
        try {
            if (this.state.password.length < 6) {
                alert('Please enter at least 6 characters')
                return
            }
            firebase.auth().signInWithEmailAndPassword(email, password)
            this.props.navigation.navigate('Main')
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Form>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input
                            value={this.state.email}
                            autoCorrect={false}
                            autoCapitalize='none'
                            onChangeText={(email) => this.setState({ email })}
                        />
                    </Item >
                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input
                            value={this.state.password}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(password) => this.setState({ password })}
                        />
                    </Item>
                    <Button
                        full
                        rounded
                        style={{ marginTop: 10 }}
                        onPress={() => this.loginUser(this.state.email, this.state.password)}//{ this.props.navigation.navigate('Main') }}
                    >
                        <Text> Login </Text>
                    </Button>
                    <Button
                        full
                        rounded
                        style={{ marginTop: 10 }}
                        onPress={() => this.signUpUser(this.state.email, this.state.password)}
                    >
                        <Text> Sign Up </Text>
                    </Button>
                </Form>
            </Container>
        )
    }
}
