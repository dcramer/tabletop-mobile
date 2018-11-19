import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { layout, margins } from '../styles';

class Header extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    leftAction: PropTypes.node,
    leftActionText: PropTypes.string,
    leftActionOnPress: PropTypes.func,
    rightAction: PropTypes.node,
    rightActionText: PropTypes.string,
    rightActionOnPress: PropTypes.func,
  };

  static defaultProps = {
    leftActionText: 'Cancel',
    leftActionOnPress: undefined,
    rightActionText: 'Save',
  };

  renderAction({ node, onPress, text }) {
    let body = node ? node : <Text style={styles.actionText}>{text}</Text>;
    if (onPress) {
      return <TouchableOpacity onPress={onPress}>{body}</TouchableOpacity>;
    }
    return body;
  }

  render() {
    let { leftActionOnPress, leftActionText } = this.props;
    if (leftActionOnPress === undefined && leftActionText) {
      leftActionOnPress = () => this.props.navigation.goBack();
    }
    return (
      <View style={styles.container}>
        <View style={styles.action}>
          {this.renderAction({
            node: this.props.leftAction,
            onPress: leftActionOnPress,
            text: this.props.leftActionText,
            style: styles.leftAction,
          })}
        </View>
        <Text style={styles.text}>{this.props.title}</Text>
        <View style={[styles.action, styles.rightAction]}>
          {this.renderAction({
            node: this.props.rightAction,
            onPress: this.props.rightActionOnPress,
            text: this.props.rightActionText,
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#7b6be6',
    paddingTop: layout.statusBarHeight + 2,
    paddingBottom: 11.5,
  },
  action: {
    width: 100,
    paddingRight: margins.threeQuarter,
    paddingLeft: margins.threeQuarter,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
  rightAction: {
    alignItems: 'flex-end',
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default withNavigation(Header);
