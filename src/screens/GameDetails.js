import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { StyleSheet, ScrollView } from 'react-native';

import { colors } from '../styles';
import Game from '../components/Game';

export default class GameDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    let { game } = navigation.state.params;
    return {
      title: Game.getGameName(game),
    };
  };

  _onCheckin = () => {
    let { navigation } = this.props;
    let { game } = navigation.state.params;
    navigation.navigate('Checkin', { id: game.id, game });
  };

  render() {
    let { navigation } = this.props;
    let { game } = navigation.state.params;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Game canPress={false} game={game} />
        <Button
          title="Check-in"
          onPress={this._onCheckin}
          containerViewStyle={styles.buttonContainer}
          color={colors.background}
          backgroundColor={colors.primary}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    alignSelf: 'stretch',
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'stretch',
  },
});
