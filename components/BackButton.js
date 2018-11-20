import React from 'react';
import { Container, Button, Icon } from 'native-base';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
});

const BackButton = props => {
  return (
    <Button
      style={styles.button}
      onPress={() => {
        props.navigation.navigate('Home');
      }}
    >
      <Icon
        style={{ color: 'black' }}
        type="MaterialCommunityIcons"
        name="arrow-left"
      />
    </Button>
  );
};

export default BackButton;