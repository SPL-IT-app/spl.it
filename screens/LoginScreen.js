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

export default class LoginScreen extends React.Component {
    constructor(props) {
        super()
        this.state = {}
    }
    render() {
        return (
            <Container style={styles.container}>
                    <Form>
                        <Item floatingLabel>
                            <Input
                                placeholder='Username'
                            />
                        </Item >
                        <Item floatingLabel>
                            <Input
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
