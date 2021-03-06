import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { updateCollection } from '../actions/collections';
import { colors, margins } from '../styles';
import TextField from '../components/forms/TextField';

class EditCollection extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Edit Collection',
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    let collection = navigation.getParam('collection');
    this.state = {
      name: collection.name,
      description: collection.description,
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
      .updateCollection(
        {
          collection: navigation.getParam('id'),
          name: state.name,
          description: state.description,
        },
        this.props.auth.user
      )
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
          required
          value={this.state.name}
        />
        <TextField
          onChangeValue={v => this.onChangeValue('description', v)}
          name="Description"
          value={this.state.description}
        />
        <Button
          title="Save Changes"
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
  ({ auth }) => ({ auth }),
  { updateCollection }
)(EditCollection);
