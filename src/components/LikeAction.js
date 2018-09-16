import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { addLike } from '../actions/likes';
import CustomPropTypes from '../propTypes';
import Game from './Game';
import Card from './Card';

class LikeAction extends Component {
  static propTypes = {
    addLike: PropTypes.func.isRequired,
    checkin: CustomPropTypes.Checkin.isRequired,
    style: ViewPropTypes.style,
    color: PropTypes.string,
  };

  addLike = () => {
    this.props.addLike({
      checkin: this.props.checkin.id,
    });
  };

  render() {
    return (
      <TouchableOpacity style={this.props.style}>
        <Icon name="heart" size={24} color={this.props.color} />
      </TouchableOpacity>
    );
  }
}
export default connect(
  null,
  { addLike }
)(LikeAction);
