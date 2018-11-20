import React, { Component } from 'react'
import { Text, Container, Content, Item, Icon, Input, List, ListItem } from 'native-base'
import { MyHeader } from '../components';
import { makeRef } from '../server/firebaseconfig'

export class AddFriend extends Component {

    constructor(){
        super()
        this.state = {
            search: '',
            results: []
        }
    }

    componentDidMount(){
        this.profileRef = makeRef('/profiles')
    }

    handleChange = event => {
        this.setState({search: event.value})
        this.profileRef.orderByChild('username').startAt(this.state.value).once('child_added', snapshot => {
            console.log(snapshot.val())
            // this.setState({results: snapshot.val()})
        })
    }

    render() {
        return (
            <Container>
                <MyHeader title='Profile' subtitle='Add Friends' />
                <Content>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" value={this.state.search} onChangeText={this.handleChange} />
                        <Icon name="ios-people" />
                    </Item>
                    <List>
                        {this.state.results ?
                        this.state.results.map(result => (
                            <ListItem>{result.username}</ListItem>
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
