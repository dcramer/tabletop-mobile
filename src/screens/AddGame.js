import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { addGame } from '../actions/games';
import { getPublishers } from '../actions/publishers';
import { colors, margins } from '../styles';
import RelationField from '../components/forms/RelationField';
import TextField from '../components/forms/TextField';

class AddGame extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Add Game',
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    this.state = {
      name: navigation.getParam('name') || '',
      publisher: null,
      minPlayers: null,
      maxPlayers: null,
      duration: null,
      durationType: null,
      error: null,
      submitting: false,
    };
  }

  onChangeValue = (name, value) => {
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    if (!this.isValid()) return;
    if (this.state.submitting) return;
    let state = this.state;
    let { navigation } = this.props;
    this.setState({ error: null, submitting: true });
    this.props
      .addGame({
        name: state.name,
        publisher: state.publisher ? state.publisher.id : null,
        minPlayers: state.minPlayers ? parseInt(state.minPlayers, 10) : null,
        maxPlayers: state.maxPlayers ? parseInt(state.maxPlayers, 10) : null,
        duration: state.duration ? parseInt(state.duration, 10) : null,
        durationType: state.durationType || null,
      })
      .then(game => {
        navigation.replace('GameDetails', {
          id: game.id,
          game,
        });
      })
      .catch(error => {
        this.setState({ error, submitting: false });
      });
  };

  isValid = () => {
    let state = this.state;

    if (!state.name) return false;

    if (!state.publisher) return false;

    if (state.minPlayers && !(parseInt(state.minPlayers, 10) > 0)) return false;
    if (state.maxPlayers && !(parseInt(state.maxPlayers, 10) > 0)) return false;
    if ((state.maxPlayers && !state.minPlayers) || state.maxPlayers < state.minPlayers)
      return false;

    if (state.duration && !(parseInt(state.duration, 10) > 0)) return false;
    if (state.duration && !state.durationType) return false;

    return true;
  };

  render() {
    return (
      <ScrollView>
        {!!this.state.error && <Text>Error: {this.state.error.message}</Text>}
        <TextField
          onChangeValue={v => this.onChangeValue('name', v)}
          name="Name"
          placeholder="e.g. Settlers of Catan"
          value={this.state.name}
        />
        <RelationField
          onChangeValue={v => this.onChangeValue('publisher', v)}
          onQuery={this.props.getPublishers}
          name="Publisher"
          placeholder="e.g. Stonemaker Games"
          nounSingular="publisher"
          addScreen="AddPublisher"
          value={this.state.publisher}
        />
        <TextField
          onChangeValue={v => this.onChangeValue('minPlayers', v)}
          name="Min Players"
          placeholder="e.g. 2"
          keyboardType="number-pad"
          value={this.state.minPlayers}
        />
        <TextField
          onChangeValue={v => this.onChangeValue('maxPlayers', v)}
          name="Max Players"
          placeholder="e.g. 6"
          keyboardType="number-pad"
          value={this.state.maxPlayers}
        />
        <Button
          title="Add Game"
          onPress={this.onSubmit}
          containerViewStyle={styles.buttonContainer}
          disabled={!this.isValid() || this.state.submitting}
          buttonStyle={styles.button}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: margins.full,
    marginBottom: margins.full,
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
  },
});

export default connect(
  null,
  { addGame, getPublishers }
)(AddGame);
