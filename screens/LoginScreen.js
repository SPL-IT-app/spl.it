import React from 'react'
import {
    Button,
    Form,
    Container,
    Item,
    Input,
    Label,
    Text,
    Footer,
} from 'native-base'
import firebase from '../server/firebaseconfig'
import { getUser } from "../store/"
import { connect } from 'react-redux'

import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

class LoginScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: 'pug@email.com',
            password: '123456'
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
                        getUser({ id: user.user.uid })

                        firebase
                            .database()
                            .ref('users')
                            .update({
                                [user.user.uid]: {
                                    email
                                }
                            })
                    })
                this.props.navigation.navigate('Main')
            }
        } catch (err) {
            console.error(err)
        }
    }

    loginUser = (email, password) => {
        const { getUser } = this.props
        try {
            if (this.state.password.length < 6) {
                alert('Please enter at least 6 characters')
                return
            }
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(user => {
                    getUser({ id: user.user.uid })
                })
            this.props.navigation.navigate('Main')
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        return (
            <Container>
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
                        onPress={() => this.loginUser(this.state.email, this.state.password)}
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
                <Footer>
                    <Button onPress={()=> {
                        this.setState({email: 'pug@email.com', password: '123456'})
                        this.loginUser(this.state.email, this.state.password)}} >
                        <Text>Skip login</Text>
                    </Button>
                </Footer>
            </Container>
        )
    }
}

export default connect(null, { getUser })(LoginScreen)
