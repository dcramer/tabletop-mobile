import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

import CustomPropTypes from '../propTypes';
import { colors } from '../styles';
import Card from '../components/Card';

class Collection extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    navigation: PropTypes.object.isRequired,
    collection: CustomPropTypes.Collection.isRequired,
  };

  goTo = () => {
    let { collection } = this.props;
    this.props.navigation.navigate('CollectionDetails', {
      id: collection.id,
      collection,
    });
  };

  render() {
    let { onPress, collection } = this.props;
    if (onPress === undefined) {
      onPress = this.goTo;
    }
    return (
      <Card onPress={onPress}>
        <Text style={styles.name}>{collection.name}</Text>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.default,
  },
});

export default withNavigation(Collection);
