import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import CollectionList from '../components/CollectionList';

class Collections extends Component {
  static navigationOptions = {
    title: 'Collections',
  };

  render() {
    return (
      <View style={styles.container}>
        <CollectionList userId={this.props.user.id} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(({ auth }) => ({ user: auth.user }))(Collections);
