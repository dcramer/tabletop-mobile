import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View, ViewPropTypes } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { colors, margins } from '../styles';
import CustomPropTypes from '../propTypes';
import Card from './Card';

class Bottle extends Component {
  static propTypes = {
    bottle: CustomPropTypes.Bottle.isRequired,
    navigation: PropTypes.object.isRequired,
    style: ViewPropTypes.style,
    canPress: PropTypes.bool,
  };

  static defaultProps = {
    canPress: true,
  };

  static getBottleName = bottle => {
    if (bottle.name) return bottle.name;
    return `${bottle.distillery.name} ${bottle.statedAge || ''}`;
  };

  _onPress = () => {
    let { bottle, navigation } = this.props;
    navigation.navigate('BottleDetails', { id: bottle.id, bottle });
  };

  render() {
    let { bottle, style } = this.props;
    return (
      <Card
        style={[styles.cardContainer, style]}
        onPress={this.props.canPress ? this._onPress : null}>
        {bottle.thumbnail ? (
          <Image source={{ uri: bottle.thumbnail }} style={styles.thumbnail} resizeMode="contain" />
        ) : (
          <Icon name="file-image" size={64} style={styles.thumbnail} color={colors.trim} />
        )}
        <View style={styles.rowText}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode={'tail'}>
            {Bottle.getBottleName(bottle)} {!!bottle.series && bottle.series}
          </Text>
          <Text style={styles.distillery} numberOfLines={1} ellipsizeMode={'tail'}>
            {bottle.distillery.name}
          </Text>
          <Text style={styles.category} numberOfLines={1} ellipsizeMode={'tail'}>
            {bottle.category} {!!bottle.statedAge && `${bottle.statedAge} yo`}
          </Text>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingTop: margins.full,
    paddingBottom: margins.full,
  },
  name: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.default,
  },
  distillery: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: colors.default,
  },
  category: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: colors.default,
  },
  thumbnail: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  rowText: {
    flex: 4,
    flexDirection: 'column',
  },
});

export default withNavigation(Bottle);
