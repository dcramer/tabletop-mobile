import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { layout, margins } from '../styles';

class ModalHeader extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    leftActionText: PropTypes.string,
    leftActionOnPress: PropTypes.func,
    rightActionText: PropTypes.string,
    rightActionOnPress: PropTypes.func,
  };

  static defaultProps = {
    leftActionText: 'Cancel',
    leftActionOnPress: undefined,
    rightActionText: 'Save',
  };

  render() {
    let { leftActionOnPress } = this.props;
    if (leftActionOnPress === undefined) {
      leftActionOnPress = () => this.props.navigation.goBack();
    }
    return (
      <View style={styles.container}>
        {leftActionOnPress ? (
          <TouchableOpacity onPress={leftActionOnPress}>
            <Text style={[styles.action, styles.leftAction]}>{this.props.leftActionText}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.action, styles.leftAction]} />
        )}
        <Text style={styles.text}>{this.props.title}</Text>
        {this.props.rightActionOnPress ? (
          <TouchableOpacity onPress={this.props.rightActionOnPress}>
            <Text style={[styles.action, styles.rightAction]}>{this.props.rightActionText}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.action, styles.rightAction]} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7b6be6',
    paddingTop: layout.statusBarHeight + 2,
    paddingBottom: 11.5,
  },
  action: {
    color: '#fff',
    fontSize: 14,
    flex: 0,
    width: 100,
    paddingRight: margins.threeQuarter,
    paddingLeft: margins.threeQuarter,
  },
  rightAction: {
    textAlign: 'right',
  },
  text: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
  },
});

export default withNavigation(ModalHeader);
