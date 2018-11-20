import React, { Component } from 'react'
import { Text, Container, Content, Item, Icon, Input, List, ListItem, Left, Thumbnail, Right, Body, Button } from 'native-base'
import { MyHeader } from '../components';
import { makeRef } from '../server/firebaseconfig'
import { Alert } from 'react-native'

export class AddFriend extends Component {

    constructor(){
        super()
        this.state = {
            search: '',
            results: [],
            friends: []
        }
    }

    componentDidMount(){
        this.profileRef = makeRef('/profiles')
        const friends = this.props.navigation.getParam('friends').map(friend => friend.username)
        this.setState({friends})
    }

    handleChange = value => {
        this.setState({search: value})
        this.profileRef.orderByChild('username').startAt(value).endAt(value + "\uf8ff").once('value', snapshot => {
            this.setState({results: snapshot.val()})
        })
    }

    render() {
        return (
            <Container>
                <MyHeader title='Profile' subtitle='Add Friends' />
                <Content>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" value={this.state.search} onChangeText={value=>this.handleChange(value)} />
                        <Icon name="ios-people" />
                    </Item>
                    <List>
                        {this.state.results ?
                        Object.entries(this.state.results).map(result => (
                            <ListItem key={result[0]} flexGrow={5} >
                                <Left flexGrow={5}>
                                    <Thumbnail source={{uri: result[1].imageUrl}} />
                                    <Text>{'  '}{result[1].username}</Text>
                                </Left>
                                <Body />
                                <Right flexGrow={5}>
                                    <Button icon transparent>
                                        {this.state.friends.indexOf(result[1].username) >= 0
                                            ?
                                            <Icon type='MaterialCommunityIcons' name='check' style={{color: '#159192'}}  />
                                            :
                                            <Icon name='person-add' />

                                        }
                                    </Button>
                                </Right>
                            </ListItem>
                        ))
                        : <Text>No Results</Text>
                    }
                    </List>
                </Content>
            </Container>
        )
    }
}

export default AddFriend
