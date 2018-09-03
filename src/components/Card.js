import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View, ViewPropTypes } from 'react-native';

import { colors, margins } from '../styles';

export default class Card extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: ViewPropTypes.style,
    onPress: PropTypes.func,
  };

  render() {
    let { children, style, onPress } = this.props;
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.container, style]}>{children}</View>
        </TouchableOpacity>
      );
    }
    return <View style={[styles.container, style]}>{children}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: margins.half,
    paddingLeft: margins.full,
    paddingRight: margins.full,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.trim,
  },
});
