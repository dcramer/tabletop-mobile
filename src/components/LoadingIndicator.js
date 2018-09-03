import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../styles';

export default class LoadingIndicator extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.default} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
