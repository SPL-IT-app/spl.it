import React, { Component } from 'react'
import { List, ListItem, Thumbnail, Right, Left, Body, Text, Button, Icon } from 'native-base'
import { makeRef } from '../server/firebaseconfig'

export class Friends extends Component {
    constructor(){
        super()
        this.state = {
            friends: []
        }
    }

    componentDidMount(){
        this.refs = []
        if(this.props.friends){
            Object.keys(this.props.friends).forEach(id => {
                const friendRef = makeRef(`/profiles/${id}`)
                this.refs.push(friendRef)
                friendRef.on('value', snapshot => {
                    this.setState({friends: [...this.state.friends, snapshot.val()]})
                })
            })
        }
    }

    componentWillUnmount(){
        this.refs.forEach(ref => {
            ref.off()
        })
    }

    render() {
        if(!this.props.friends || !this.state.friends) {
            return <Text>You don't have any friends!</Text>
        }
        return (
            <List>
                {this.state.friends.map(friend => (
                    <ListItem avatar key = {friend.username}>
                        <Left>
                            <Thumbnail source={{uri: friend.imageUrl}} />
                        </Left>
                        <Body>
                            <Text>{friend.username}</Text>
                        </Body>
                        <Right />
                    </ListItem>
                ))}
                <ListItem>
                    <Left />
                    <Body />
                    <Right flexGrow={5}>
                        <Button iconLeft  >
                            <Icon type='MaterialIcons' name='add-circle' />
                            <Text>Add Friend</Text>
                        </Button>
                    </Right>
                </ListItem>
            </List>
        )
    }
}

export default Friends
