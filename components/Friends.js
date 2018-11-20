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

export class Friends extends Component {

  render() {
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
        <List>
          {this.props.friends.map(friend => (
            <ListItem avatar key={friend.username}>
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

export default withNavigation(Friends);
