import React from 'react'
import {
    Button,
    Form,
    Container,
    Item,
    Input,
    Label,
    Text,
    View,
} from 'native-base'
import { StyleSheet } from 'react-native'
import firebase from '../server/firebaseconfig'
import { getUser } from "../store/"
import { connect } from 'react-redux'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        marginTop: 10,
    },
    signUp: {
        fontWeight: "bold",
        textAlign: 'center',
        color: 'steelblue'
    },
})

class LoginScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
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
            <Container style={styles.container}>
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 50 }}>SPL/IT</Text>
                </View>
                <Form>
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
                        warning
                        full
                        rounded
                        style={{ marginTop: 10 }}
                        onPress={() => this.loginUser(this.state.email, this.state.password)}
                    >
                        <Text> Login </Text>
                    </Button>

                </Form>
                <View>
                    <Text style={styles.text}> New to SPL/IT? </Text><Text style={styles.signUp} onPress={() => this.props.navigation.navigate('SignUp')}>Sign Up</Text>
                </View>
            </Container>
        )
    }
}

export default connect(null, { getUser })(LoginScreen)
