import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CustomPropTypes from '../propTypes';
import Game from './Game';
import Card from './Card';

class CommentAction extends Component {
  static propTypes = {
    checkin: CustomPropTypes.Checkin.isRequired,
    style: ViewPropTypes.style,
    color: PropTypes.string,
  };

  render() {
    return (
      <TouchableOpacity style={this.props.style}>
        <Icon name="comments" size={24} color={this.props.color} />
      </TouchableOpacity>
    );
  }
}
export default CommentAction;
