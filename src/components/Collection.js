import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

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
      onPress = this.goTo;
    }
    return (
      <Card onPress={onPress} style={this.props.style}>
        <View style={styles.container}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{collection.name}</Text>
            {collection.description && (
              <Text style={styles.description}>{collection.description}</Text>
            )}
          </View>
          <View style={styles.countContainer}>
            <Text style={styles.count}>{collection.numGames.toLocaleString()}</Text>
          </View>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  nameContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.default,
  },
  description: {
    fontSize: 14,
    marginTop: margins.half,
    color: colors.light,
  },
  count: {
    fontSize: 14,
    color: colors.light,
  },
});

export default withNavigation(Collection);
