import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Notifications extends Component {
  static navigationOptions = {
    title: 'Notifications',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
