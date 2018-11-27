import React, { Component } from 'react';
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
  Fab,
  Footer,
  Content,
} from 'native-base';
import { withNavigation } from 'react-navigation';
import { makeRef } from '../server/firebaseconfig';
import { connect } from 'react-redux';
import Dialog from 'react-native-dialog';
import { StyleSheet, ScrollView } from 'react-native';

const styles = StyleSheet.create({
  button: {
    marginTop: 40,
    width: '95%',
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingBottom: 15,
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-end',
  },
});

export class Friends extends Component {
  constructor() {
    super();
    this.state = {
      dialogVisible: false,
      toBeDeletedFriendId: '',
      toBeDeletedFriendUsername: '',
    };
  }

  handleDelete = () => {
    makeRef(`/users/${this.props.id}/friends`)
      .child(this.state.toBeDeletedFriendId)
      .remove();
    this.setState({
      toBeDeletedFriendId: '',
      toBeDeletedFriendUsername: '',
      dialogVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      toBeDeletedFriendId: '',
      toBeDeletedFriendUsername: '',
      dialogVisible: false,
    });
  };

  handleSelect = (id, username) => {
    this.setState({
      toBeDeletedFriendId: id,
      toBeDeletedFriendUsername: username,
      dialogVisible: true,
    });
  };

  render() {
    const { navigate } = this.props.navigation;
    if (!this.props.friends) {
      return (
        <Container>
          <Text>You don't have any friends!</Text>
          <Fab position="bottomRight" onPress={() => navigate('AddFriend')}>
            <Icon type="MaterialCommunityIcons" name="plus" />
          </Fab>
        </Container>
      );
    }
    return (
      <Container>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Unfriend</Dialog.Title>
            <Dialog.Description>
              <Text>
                Do you want to unfriend {this.state.toBeDeletedFriendUsername}?
              </Text>
            </Dialog.Description>
            <Dialog.Button label="No" onPress={this.handleCancel} />
            <Dialog.Button label="Yes" onPress={this.handleDelete} />
          </Dialog.Container>
          <List>
            {this.props.friends.map(friend => (
              <ListItem
                avatar
                style={styles.listItem}
                key={friend.username}
                onLongPress={() => {
                  this.handleSelect(friend.id, friend.username);
                }}
                onPress={() => {
                  console.log('simpe press');
                }}
              >
                <Left>
                  <Thumbnail source={{ uri: friend.imageUrl }} />
                </Left>
                <Body>
                  <Text>{friend.username}</Text>
                </Body>
              </ListItem>
            ))}
          </List>
        <Footer style={styles.footer}>
          <Button
            success
            block
            style={styles.button}
            onPress={() =>
              navigate('AddFriend', { friends: this.props.friends })
            }
          >
            <Icon type="MaterialCommunityIcons" name="account-plus" style={styles.icon} />
            <Text>Add Friend</Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const mapState = state => ({
  id: state.user.currentUser.id,
});

export default withNavigation(connect(mapState)(Friends));
