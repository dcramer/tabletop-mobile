import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';

import { colors, margins } from '../styles';

export default class Panel extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: ViewPropTypes.style,
    title: PropTypes.string.isRequired,
  };

  render() {
    let { children, style, title } = this.props;
    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{title.toUpperCase()}</Text>
          {this.props.header}
        </View>
        <View style={styles.body}>{children}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: margins.half,
    paddingBottom: margins.half,
  },
  header: {
    padding: margins.half,
  },
  headerText: {
    paddingLeft: margins.half,
    paddingRight: margins.half,
    color: colors.default,
    fontWeight: 'bold',
  },
});
