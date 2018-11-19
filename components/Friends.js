import React, { Component } from 'react'
import { List, ListItem, Thumbnail, Right } from 'native-base'
import { makeRef } from '../server/firebaseconfig'

export class Friends extends Component {
    constructor(){
        super()
        this.state = {
            friends: []
        }
    }

    componentDidMount(){
        const friends = []
        this.refs = []
        if(this.props.friends){
            console.log('am i even here?')
            console.log(Object.keys(this.props.friends))
            Object.keys(this.props.friends).forEach(id => {
                const friendRef = makeRef(`/profiles/${id}`)
                this.refs.push(friendRef)
                friendRef.on('value', snapshot => {
                    console.log('hey a friend is here', snapshot.val().username)
                    friends.push(snapshot.val())
                })
                // const snapshot = await friendRef.once('value')
                // console.log('SNAPSHOT', snapshot)
                // console.log(snapshot.val())
                // friends.push(await snapshot.val())
            })
        }
        this.setState({friends})
    }

    componentWillUnmount(){
        this.refs.forEach(ref => {
            ref.off()
        })
    }

    render() {
        console.log('friends props', this.props)
        console.log('STATE', this.state)
        if(!this.props.friends) {
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
            </List>
        )
    }
}

export default Friends
