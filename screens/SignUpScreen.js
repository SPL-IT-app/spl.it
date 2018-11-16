import React from 'react';
import {
    Button,
    Form,
    Container,
    Label,
    Item,
    Input,
    Text,
    View,
    Icon
} from 'native-base'

import { StyleSheet, TouchableOpacity } from 'react-native'

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
            password: ''
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
                        const { firstName, lastName, phone } = this.state
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
                        getUser(user.user)
                    })
                this.props.navigation.navigate('Main')
            }
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <View style={{marginLeft: 10}}>
                    <TouchableOpacity><Text onPress={() => this.props.navigation.navigate('Login')}>Back</Text></TouchableOpacity>
                </View>
                <Form>
                    <Item floatingLabel>
                        <Label>First Name</Label>
                        <Input
                            value={this.state.firstName}
                            onChangeText={(firstName) => this.setState({ firstName })}
                        />
                    </Item >
                    <Item floatingLabel>
                        <Label>Last Name</Label>
                        <Input
                            value={this.state.lastName}
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
                            returnKeyLabel={true}
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
                        style={{ marginTop: 10 }}
                        onPress={() => this.signUpUser(this.state.email, this.state.password)}
                    >
                        <Text>Sign Up</Text>
                    </Button>
                </Form>
            </Container>
        )
    }
}

export default connect(null, { getUser })(SignUpScreen)

