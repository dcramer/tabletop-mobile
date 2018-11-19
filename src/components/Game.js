import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View, ViewPropTypes } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { colors, margins } from '../styles';
import CustomPropTypes from '../propTypes';
import Card from './Card';

class Game extends Component {
  static propTypes = {
    game: CustomPropTypes.Game.isRequired,
    navigation: PropTypes.object.isRequired,
    style: ViewPropTypes.style,
    canPress: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    canPress: true,
  };

  static getGameName = game => {
    return game.name;
  };

  _onPress = () => {
    let { game, navigation } = this.props;
    if (this.props.onPress) {
      this.props.onPress(game);
    } else {
      navigation.navigate('GameDetails', { id: game.id, game });
    }
  };

  render() {
    let { game, style } = this.props;
    return (
      <Card
        style={[styles.cardContainer, style]}
        onPress={this.props.canPress ? this._onPress : null}>
        {game.image ? (
          <Image
            source={{ uri: game.image.url }}
            width="50"
            height="50"
            style={styles.thumbnail}
            resizeMode="contain"
          />
        ) : (
          <Icon name="file-image" size={64} style={styles.thumbnail} color={colors.trim} />
        )}
        <View style={styles.rowText}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode={'tail'}>
            {game.name}
          </Text>
          <Text style={styles.publisher} numberOfLines={1} ellipsizeMode={'tail'}>
            {game.yearPublished || ''}
          </Text>
          <View style={styles.meta}>
            <Icon name="users" size={16} style={styles.playersIcon} color={colors.default} />
            <Text style={styles.players} numberOfLines={1} ellipsizeMode={'tail'}>
              {game.minPlayers !== game.maxPlayers
                ? `${game.minPlayers} - ${game.maxPlayers}`
                : game.minPlayers}
            </Text>
          </View>
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
  publisher: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: colors.default,
  },
  meta: {
    flex: 2,
    flexDirection: 'row',
    paddingLeft: 10,
    marginTop: 5,
  },
  playersIcon: {
    marginRight: 5,
  },
  players: {
    flex: 1,
    fontSize: 14,
    color: colors.default,
  },
  thumbnail: {
    flex: 1,
    alignSelf: 'stretch',
    // alignSelf: 'center',
    height: undefined,
    width: undefined,
  },
  rowText: {
    flex: 4,
    flexDirection: 'column',
  },
});

export default withNavigation(Game);
