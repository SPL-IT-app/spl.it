import React from 'react';
import { Container, Button, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';

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
        props.navigation.goBack();
      }}
    >
      <Icon
        style={{ color: 'black' }}
        type="MaterialCommunityIcons"
        name="chevron-left"
      />
    </Button>
  );
};

export default withNavigation(BackButton);
