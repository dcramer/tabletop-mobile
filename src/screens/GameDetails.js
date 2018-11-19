import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { StyleSheet, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';

import { colors } from '../styles';
import Activity from '../components/Activity';
import ButtonGroup from '../components/ButtonGroup';
import Game from '../components/Game';
import Panel from '../components/Panel';

class GameDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    let { game } = navigation.state.params;
    return {
      title: Game.getGameName(game),
    };
  };

  state = { activityScope: 'friends' };

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
        <Button
          title="Add to collection"
          onPress={this._onCheckin}
          containerViewStyle={styles.buttonContainer}
          color={colors.background}
          backgroundColor={colors.primary}
        />
        <Panel
          title="Recent Activity"
          header={
            <ButtonGroup
              selectedIndex={this.state.activityScope === 'friends' ? 0 : 1}
              onPress={idx => this.setState({ activityScope: idx === 0 ? 'friends' : 'public' })}
              buttons={['Friends', 'All']}
            />
          }>
          <Activity auth={this.props.auth} scope={this.state.activityScope} game={game.id} />
        </Panel>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'stretch',
  },
});

export default connect(({ auth }) => ({ auth }))(withNavigation(GameDetails));
