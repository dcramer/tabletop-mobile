import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../styles';

export default class Loading extends Component {
  static navigationOptions = {
    title: 'Loading',
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
});
