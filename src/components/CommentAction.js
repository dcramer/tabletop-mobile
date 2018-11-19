import React, { Component } from 'react';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { colors } from '../styles';
import CustomPropTypes from '../propTypes';

class CommentAction extends Component {
  static propTypes = {
    checkin: CustomPropTypes.Checkin.isRequired,
    style: ViewPropTypes.style,
  };

  render() {
    return (
      <TouchableOpacity style={this.props.style}>
        <Icon name="comments" size={24} color={colors.default} />
      </TouchableOpacity>
    );
  }
}
export default CommentAction;
