import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { addPublisher } from '../actions/publishers';
import { colors, margins } from '../styles';
import TextField from '../components/forms/TextField';

class AddPublisher extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Add Publisher',
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    this.state = {
      name: navigation.getParam('name') || '',
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
      .addPublisher({
        name: state.name,
      })
      .then(result => {
        let onComplete = navigation.getParam('onComplete');
        onComplete && onComplete(result);
        navigation.goBack(null);
      })
      .catch(error => {
        this.setState({ error, submitting: false });
      });
  };

  isValid = () => {
    let state = this.state;
    return state.name;
  };

  render() {
    return (
      <ScrollView>
        {!!this.state.error && <Text>Error: {this.state.error.message}</Text>}
        <TextField
          onChangeValue={v => this.onChangeValue('name', v)}
          name="Name"
          placeholder="e.g. Stonemaker Games"
          value={this.state.name}
        />
        <Button
          title="Add Publisher"
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
  { addPublisher }
)(AddPublisher);
