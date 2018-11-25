import React from 'react';
import { Container, Button, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux'
import { setEvent } from '../store';


const { makeRef } = require('../server/firebaseconfig');

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
});


export class DeleteButton extends React.Component {

  deleteData = ref => {
    const referenceUrl = makeRef(ref);
    referenceUrl.remove();
    // const eventUrl = makeRef(`/events/${this.props.event}/receipts`)
    // eventUrl.on("value", snapshot => {
    //   if(snapshot.val() === null) {
    //     console.log("EVENT MUST BE DELETED FROM ALL MEMBERS ON EVENT")
    //   }
    // })
    console.log('deleted data at ', ref);
  };

  render() {
    return (
      <Button
        warning
        block
        style={styles.button}
        onPress={() => {
          this.deleteData(this.props.url);
          this.props.navigation.goBack();
        }}
      >
        <Icon
          style={{ color: 'black' }}
          type="MaterialCommunityIcons"
          name="close"
        />
      </Button>
    );
  }
}


const mapState = state => {
  return {
    event: state.event.eventId,
  };
};

const mapDispatch = dispatch => {
  return {
    setEvent: id => {
      dispatch(setEvent(id));
    },
  };
};

export default withNavigation(connect(
  mapState,
  mapDispatch
)(DeleteButton));


