import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CustomPropTypes from '../propTypes';
import { colors, margins } from '../styles';
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
      onPress = this.goToProfile;
    }
    return (
      <Card onPress={onPress} style={styles.container}>
        <Text style={styles.name}>{collection.name}</Text>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.default,
  },
});

export default withNavigation(Collection);
