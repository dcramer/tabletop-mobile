import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { addCollection } from '../actions/collections';
import { colors, margins } from '../styles';
import TextField from '../components/forms/TextField';

class AddCollection extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Add Collection',
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    this.state = {
      name: navigation.getParam('name') || '',
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
      .addCollection({
        name: state.name,
        games: state.games || [],
      })
      .then(collection => {
        navigation.replace('CollectionDetails', {
          id: collection.id,
          collection,
        });
      })
      .catch(error => {
        this.setState({ error, submitting: false });
      });
  };

  isValid = () => {
    let state = this.state;

    if (!state.name) return false;

    return true;
  };

  render() {
    return (
      <ScrollView>
        {!!this.state.error && <Text>Error: {this.state.error.message}</Text>}
        <TextField
          onChangeValue={v => this.onChangeValue('name', v)}
          name="Name"
          placeholder="e.g. My 4x Games"
          value={this.state.name}
        />
        <Button
          title="Add Collection"
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
  { addCollection }
)(AddCollection);
