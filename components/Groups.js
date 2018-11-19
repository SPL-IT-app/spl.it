import React, { Component } from 'react'
import { makeRef } from '../server/firebaseconfig'
import { Text, List, ListItem, Right, Left, Body } from 'native-base';

export class Groups extends Component {
    constructor(){
        super()
        this.state = {
            groups: []
        }
    }

    componentDidMount(){
        this.refs = []
        if(this.props.groups){
            Object.keys(this.props.groups).forEach(id => {
                const groupRef = makeRef(`groups/${id}`)
                this.refs.push(groupRef)
                groupRef.on('value', snapshot => {
                    this.setState({groups: [...this.state.groups, snapshot.val()]})
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
        if(!this.props.groups || !this.state.groups){
            return <Text>You don't have any groups!</Text>
        }
        return (
            <List>
                {this.state.groups.map(group => (
                    <ListItem key={group.name}>
                        <Left flexGrow={7}>
                        <Text>{group.name}</Text>
                        </Left>
                        <Body />
                        <Right flexGrow={3} >
                            {group.members &&
                            <Text note>{Object.keys(group.members).length} members</Text>}
                        </Right>
                    </ListItem>
                ))}
            </List>
        )
    }
}

export default Groups
