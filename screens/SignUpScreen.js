import React from 'react';
import {
    Button,
    Form,
    Container,
    Content,
    Item,
    Input,
    Text,
} from 'native-base'

import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})

export default class SignUpScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <Container style={styles.container}>
                    <Form>
                        <Item >
                            <Input
                            floatingLabel
                                placeholder='Username'
                            />
                        </Item >
                        <Item >
                            <Input
                            floatingLabel
                                placeholder='Password'
                                secureTextEntry={true}
                            />
                        </Item>
                    <Button
                    full
                    rounded
                    style={{marginTop: 10}}
                        onPress={() => { this.props.navigation.navigate('Main') }}
                    >
                        <Text>
                            Sign In
                        </Text>
                    </Button>
                    </Form>
            </Container>
        )
    }
}
