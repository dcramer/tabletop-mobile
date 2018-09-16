import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { colors } from '../styles';
import { addLike, removeLike } from '../actions/checkins';
import CustomPropTypes from '../propTypes';
import Game from './Game';
import Card from './Card';

class LikeAction extends Component {
  static propTypes = {
    addLike: PropTypes.func.isRequired,
    checkin: CustomPropTypes.Checkin.isRequired,
    removeLike: PropTypes.func.isRequired,
    style: ViewPropTypes.style,
  };

  onToggleLike = () => {
    let { checkin } = this.props;
    if (!checkin.isLiked) {
      this.props.addLike({
        checkin: checkin.id,
      });
    } else {
      this.props.removeLike({
        checkin: checkin.id,
      });
    }
  };

  render() {
    return (
      <TouchableOpacity style={this.props.style} onPress={this.onToggleLike}>
        <Icon
          name="heart"
          solid={this.props.checkin.isLiked}
          size={24}
          color={this.props.checkin.isLiked ? colors.primary : colors.default}
        />
      </TouchableOpacity>
    );
  }
}
export default connect(
  null,
  { addLike, removeLike }
)(LikeAction);
