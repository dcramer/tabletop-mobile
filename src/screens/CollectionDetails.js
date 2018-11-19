import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';

import Collection from '../components/Collection';

class CollectionDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    let { collection } = navigation.state.params;
    return {
      title: collection.name,
    };
  };

  render() {
    let { navigation } = this.props;
    let { collection } = navigation.state.params;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Collection onPress={null} collection={collection} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(({ auth }) => ({ auth }))(withNavigation(CollectionDetails));
