import React from 'react';
import { Container, Text, Footer, Button, Icon, Content, FooterTab } from 'native-base'
import { MyHeader } from '../components'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'

const styles = StyleSheet.create({

});

class MoreScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    return (
      <Container>
        <MyHeader title="More" />
        <Content>
          <Button
            onPress={() => this.props.navigation.navigate('AllEvents', {
              status: false,
            })}
          >
            <Text>History</Text>
          </Button>
          <Text>More stuff here!</Text>
          <Text>this is to test logout:</Text>
          {this.props.id ?
            <Text>{this.props.id}</Text> :
            <Text>No ID</Text>
          }

        </Content>
      </Container>
    );
  }
}

const mapState = state => ({
  id: state.user.currentUser.id
})

export default connect(mapState)(MoreScreen)
