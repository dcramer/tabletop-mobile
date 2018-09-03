import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ViewPropTypes } from 'react-native';
import { SearchBar as RNESearchBar } from 'react-native-elements';

import { colors } from '../styles';

export default class SearchBar extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: ViewPropTypes.style,
    loading: PropTypes.bool,
    header: PropTypes.bool,
  };

  render() {
    return (
      <RNESearchBar
        lightTheme
        autoCorrect={false}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        onChangeText={this.props.onChangeValue}
        onClearText={this.props.onChangeValue}
        inputStyle={[styles.input, this.props.header && styles.headerInput]}
        containerStyle={[styles.container, this.props.header && styles.headerContainer]}
        showLoadingIcon={this.props.loading}
        placeholder="Search"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0,
  },
  headerContainer: {
    backgroundColor: colors.primary,
  },
  input: {
    fontSize: 14,
  },
  headerInput: {
    color: colors.dark,
    backgroundColor: '#eee',
  },
});
