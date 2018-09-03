import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput } from 'react-native';

import { colors, margins } from '../../styles';
import Card from '../Card';
import FormLabel from '../FormLabel';

export default class TextField extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,
    value: PropTypes.string,
  };

  constructor(...args) {
    super(...args);
    this.state = { value: this.props.value };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    return (
      <Card style={styles.container}>
        <FormLabel>{this.props.name}</FormLabel>
        <TextInput
          placeholder={this.props.placeholder}
          placeholderTextColor={colors.light}
          value={this.state.value}
          onChangeText={this.setValue}
          keyboardType={this.props.keyboardType}
        />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
  },
  labelLeft: {
    flex: 1,
    alignSelf: 'stretch',
  },
  labelRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: margins.half,
    marginBottom: margins.half,
  },
});
