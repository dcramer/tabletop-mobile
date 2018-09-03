import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, ViewPropTypes } from 'react-native';
import Card from './Card';

import { colors, margins } from '../styles';

export default class AlertCard extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    subheading: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['info']),
    style: ViewPropTypes.style,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    type: 'info',
  };

  render() {
    let { type } = this.props;
    return (
      <Card
        onPress={this.props.onPress}
        style={[styles.container, styles[`${type}Container`], this.props.style]}>
        <Text style={styles.heading}>{this.props.heading}</Text>
        <Text style={styles.subheading}>{this.props.subheading}</Text>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: margins.full,
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.default,
  },
  subheading: {
    fontSize: 13,
    color: colors.default,
  },
});
