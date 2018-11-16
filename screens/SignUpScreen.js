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
} from 'native-base'

import { StyleSheet, TouchableOpacity, KeyboardAvoidingView} from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

import firebase from '../server/firebaseconfig'
import { getUser } from "../store/"
import { connect } from 'react-redux'

class SignUpScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            username: '',
        }
    }

    signUpUser = (email, password) => {
        const { getUser } = this.props
        try {
            if (this.state.password.length < 6) {
                alert('Please enter at least 6 characters')
                return
            } else {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(user => {
                        const { firstName, lastName, phone, username } = this.state
                        firebase
                            .database()
                            .ref('users')
                            .update({
                                [user.user.uid]: {
                                    firstName,
                                    lastName,
                                    phone,
                                    email
                                }
                            })
                        firebase
                            .database()
                            .ref('profiles')
                            .update({
                                [user.user.uid]: {
                                    imageUrl: 'https://bit.ly/2qQRtn6',
                                    username
                                }
                            })
                        getUser({ id: user.user.uid })
                    })
                this.props.navigation.navigate('Main')
            }
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <View style={{ marginLeft: 10 }}>
                        <TouchableOpacity><Icon type='MaterialCommunityIcons' name='arrow-left' onPress={() => this.props.navigation.navigate('Login')} /></TouchableOpacity>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input
                                autoCorrect={false}
                                autoCapitalize='none'
                                value={this.state.username}
                                onChangeText={(username) => this.setState({ username })}
                            />
                        </Item >
                        <Item floatingLabel>
                            <Label>First Name</Label>
                            <Input
                                value={this.state.firstName}
                                autoCorrect={false}
                                onChangeText={(firstName) => this.setState({ firstName })}
                            />
                        </Item >
                        <Item floatingLabel>
                            <Label>Last Name</Label>
                            <Input
                                value={this.state.lastName}
                                autoCorrect={false}
                                onChangeText={(lastName) => this.setState({ lastName })}
                            />
                        </Item >
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                keyboardType='email-address'
                                value={this.state.email}
                                autoCorrect={false}
                                autoCapitalize='none'
                                onChangeText={(email) => this.setState({ email })}
                            />
                        </Item >
                        <Item floatingLabel>
                            <Label>Phone</Label>
                            <Input
                                returnKeyType='done'
                                keyboardType='phone-pad'
                                maxLength={11}
                                dataDetectorTypes='phoneNumber'
                                value={this.state.phone}
                                autoCorrect={false}
                                autoCapitalize='none'
                                onChangeText={(phone) => this.setState({ phone })}
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
                            style={{ marginTop: 10, backgroundColor: 'steelblue' }}
                            onPress={() => this.signUpUser(this.state.email, this.state.password)}
                        >
                            <Text>Sign Up</Text>
                        </Button>
                    </Form>
            </KeyboardAvoidingView>
        )
    }
}

export default connect(null, { getUser })(SignUpScreen)

