import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import CollectionList from '../components/CollectionList';
import ModalHeader from '../components/ModalHeader';

class Collections extends Component {
  static navigationOptions = {
    title: 'Collections',
    header: null,
  };

  goToAddCollection = () => {
    this.props.navigation.navigate('AddCollection');
  };

  render() {
    return (
      <View style={styles.container}>
        <ModalHeader
          title="Collections"
          leftActionText={null}
          rightActionOnPress={this.goToAddCollection}
          rightActionText="Add"
        />
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

export default connect(({ auth }) => ({ user: auth.user }))(withNavigation(Collections));
