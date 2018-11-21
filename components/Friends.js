import React, { Component } from "react";
import {
  List,
  ListItem,
  Thumbnail,
  Right,
  Left,
  Body,
  Text,
  Button,
  Icon,
  Container,
  Fab
} from "native-base";
import { withNavigation } from "react-navigation";
import { makeRef } from '../server/firebaseconfig'
import { connect } from 'react-redux'
import Dialog from 'react-native-dialog';

export class Friends extends Component {

    constructor(){
        super()
        this.state = {
            dialogVisible: false,
            toBeDeletedFriendId: '',
            toBeDeletedFriendUsername: ''
        }
    }

    handleDelete = () => {
        makeRef(`/users/${this.props.id}/friends`)
        .child(this.state.toBeDeletedFriendId).remove()
        this.setState({toBeDeletedFriendId: '', toBeDeletedFriendUsername: '', dialogVisible: false})
    }

    handleCancel = () => {
        this.setState({toBeDeletedFriendId: '', toBeDeletedFriendUsername: '', dialogVisible: false})
    }

    handleSelect = (id, username) => {
        this.setState({
            toBeDeletedFriendId: id,
            toBeDeletedFriendUsername: username,
            dialogVisible: true
        })
    }

    render() {
        console.log(this.props)
        const { navigate } = this.props.navigation;
        if (!this.props.friends) {
        return (
            <Container>
            <Text>You don't have any friends!</Text>
            <Fab position="bottomRight" onPress={() => navigate("AddFriend")}>
                <Icon type="MaterialCommunityIcons" name="plus" />
            </Fab>
            </Container>
        );
        }
        return (
        <Container>
            <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Unfriend {this.state.toBeDeletedFriendId}</Dialog.Title>
                <Dialog.Description><Text>Do you want to unfriend {this.state.toBeDeletedFriendUsername}?</Text></Dialog.Description>
                <Dialog.Button label='No' onPress={this.handleCancel} />
                <Dialog.Button label='Yes' onPress={this.handleDelete} />
            </Dialog.Container>

            <List>
            {this.props.friends.map(friend => (
                <ListItem avatar key={friend.username} onLongPress={()=>{this.handleSelect(friend.id, friend.username)}}>
                <Left>
                    <Thumbnail source={{ uri: friend.imageUrl }} />
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
                <Button iconLeft onPress={() => navigate("AddFriend", {friends: this.props.friends})}>
                    <Icon type="MaterialIcons" name="add-circle" />
                    <Text>Add Friend</Text>
                </Button>
                </Right>
            </ListItem>
            </List>
            <Container>
                <Fab position="bottomRight" onPress={() => navigate("AddFriend")}>
                <Icon type="MaterialCommunityIcons" name="plus" />
                </Fab>
            </Container>
        </Container>
        )
    }
}

const mapState = state => ({
    id: state.user.currentUser.id
})

export default withNavigation(connect(mapState)(Friends));
