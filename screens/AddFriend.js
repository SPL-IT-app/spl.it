import React, { Component } from 'react';
import {
  Text,
  Container,
  Content,
  Item,
  Icon,
  Input,
  List,
  ListItem,
  Left,
  Thumbnail,
  Right,
  Body,
  Button,
} from 'native-base';
import { MyHeader } from '../components';
import { makeRef } from '../server/firebaseconfig';
import { Alert, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  icon: {
    color: 'black'
  },
  searchUser: {
    padding: 10
  }
});


export class AddFriend extends Component {
  constructor() {
    super();
    this.state = {
      search: '',
      results: [],
      friends: [],
    };
  }

  componentDidMount() {
    this.profileRef = makeRef('/profiles');
    const friends = this.props.navigation
      .getParam('friends')
      .map(friend => friend.username);
    this.setState({ friends });
    this.friendsRef = makeRef(`/users/${this.props.id}/friends`);
  }

  handleChange = value => {
    if (value) {
      this.setState({ search: value });
      this.profileRef
        .orderByChild('username')
        .startAt(value)
        .endAt(value + '\uf8ff')
        .once('value', snapshot => {
          this.setState({ results: snapshot.val() });
        });
    } else {
      this.setState({ search: value, results: [] });
    }
  };

  addFriend = (id, username) => {
    this.addedFriendRef = makeRef(`/users/${id}/friends`)
    this.friendsRef.update({ [id]: true });
    this.addedFriendRef.update({ [this.props.id]: true });
    this.setState({ friends: [...this.state.friends, username] });
  };

  render() {
    return (
      <Container>
        <MyHeader title="Profile" subtitle="Add Friends" />
        <Content>
          <Item style={styles.searchUser}>
            <Icon name="ios-search" />
            <Input
              autoCapitalize="none"
              placeholder="Search"
              value={this.state.search}
              onChangeText={value => this.handleChange(value)}
            />
            <Icon name="ios-people" />
          </Item>
          <List>
            {this.state.results ? (
              Object.entries(this.state.results).map(result => (
                <ListItem key={result[0]} flexGrow={5}>
                  <Left flexGrow={5}>
                    <Thumbnail source={{ uri: result[1].imageUrl }} />
                    <Text>
                      {'  '}
                      {result[1].username}
                    </Text>
                  </Left>
                  <Body />
                  <Right flexGrow={5}>
                    <Button
                      icon
                      transparent
                      onPress={() =>
                        this.addFriend(result[0], result[1].username)
                      }
                    >
                      {this.state.friends.indexOf(result[1].username) >= 0 ? (
                        <Icon
                          type="MaterialCommunityIcons"
                          name="check"
                          style={{ color: '#159192' }}
                        />
                      ) : (
                        <Icon style={styles.icon} type="MaterialCommunityIcons" name="account-plus" />
                      )}
                    </Button>
                  </Right>
                </ListItem>
              ))
            ) : (
              <Text>No Results</Text>
            )}
          </List>
        </Content>
      </Container>
    );
  }
}

const mapState = state => ({
  id: state.user.currentUser.id,
});

export default connect(mapState)(AddFriend);
