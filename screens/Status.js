import React, { Component } from 'react'
import { Container, Content, Text } from 'native-base';
import { MyHeader, BackButton } from '../components';

class Status extends Component {
    render() {
        return (
            <Container>
                <MyHeader title='Status' right={()=><BackButton />} />
                <Content>
                    <Text>This is Status Page</Text>
                </Content>
            </Container>
        )
    }
}

export default Status
