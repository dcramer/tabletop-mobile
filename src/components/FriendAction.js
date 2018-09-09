import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { margins } from '../styles';
import { getUsers, follow, unfollow } from '../actions/users';

class FriendAction extends Component {
  static propTypes = {
    getUsers: PropTypes.func.isRequired,
    follow: PropTypes.func.isRequired,
    unfollow: PropTypes.func.isRequired,
  };

  state = {
    loading: true,
    isFriend: null,
    saving: false,
  };

  async componentWillMount() {
    await this.fetchStatus();
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.userId !== nextProps.userId) {
      await this.fetchStatus();
    }
  }

  async fetchStatus() {
    this.props
      .getUsers({ id: this.props.userId, scope: 'following' })
      .then(item => {
        this.setState({
          loading: false,
          isFriend: item.length !== 0,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error,
        });
      });
  }

  toggleFriend = () => {
    this.setState({ loading: true });
    if (this.state.isFriend) {
      this.props
        .follow(this.props.userId)
        .then(() => {
          this.setState({ isFriend: false, saving: false });
        })
        .catch(error => {
          console.error(error);
          this.setState({ error, saving: false });
        });
    } else {
      this.props
        .unfollow(this.props.userId)
        .then(() => {
          this.setState({ isFriend: true, saving: false });
        })
        .catch(error => {
          console.error(error);
          this.setState({ error, saving: false });
        });
    }
  };

  render() {
    let { isFriend, loading, saving } = this.state;
    if (loading) return null;
    return (
      <TouchableOpacity onPress={!saving ? this.toggleFriend : null}>
        <Icon
          style={styles.icon}
          name={isFriend ? 'user-minus' : 'user-plus'}
          color={this.props.color}
          size={18}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {},
});

export default connect(
  ({ auth }) => ({ auth }),
  { getUsers, follow, unfollow }
)(FriendAction);
