import React, { Component } from 'react'
import { Header, Body, Title, Left, Right, Button, Icon, Thumbnail, Container } from 'native-base'
import { Image } from 'react-native'
import { Asset } from 'expo'

export class MyHeader extends Component {
    render() {
        return (
            <Header>
                <Left>
                     <Image
                        resizeMode='stretch'
                        source={require('../assets/images/logo.png')}
                        style={{width:57, height:30}}
                        fadeDuration={0}
                      />
                </Left>
                <Body>
                    <Title>{this.props.title}</Title>
                </Body>
                <Right />
            </Header>
        )
    }
}

export default MyHeader
