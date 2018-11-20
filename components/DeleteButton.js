import React from 'react';
import { Container, Button, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';

const { makeRef } = require('../server/firebaseconfig');

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
});

const deleteData = ref => {
  const referenceUrl = makeRef(ref);
  referenceUrl.remove();
  console.log('deleted data at ', ref);
};

const DeleteButton = props => {
  return (
    <Button
      warning
      block
      style={styles.button}
      onPress={() => {
        deleteData(props.url);
        props.navigation.goBack();
      }}
    >
      <Icon
        style={{ color: 'black' }}
        type="MaterialCommunityIcons"
        name="close"
      />
    </Button>
  );
};

export default withNavigation(DeleteButton);
