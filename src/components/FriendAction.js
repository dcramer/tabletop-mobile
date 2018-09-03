import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
          isFriend: item.length,
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
    if (this.state.isFollowing) {
      this.props
        .follow(this.props.userId)
        .then(() => {
          this.setState({ isFriend: false, loading: false });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    } else {
      this.props
        .unfollow(this.props.userId)
        .then(() => {
          this.setState({ isFriend: true, loading: false });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    }
  };

  render() {
    let { isFollowing, loading } = this.state;
    if (loading) return null;
    return (
      <TouchableOpacity onPress={this.toggleFriend}>
        <View style={styles.friendAction}>
          <Icon name={isFollowing ? 'user-minus' : 'user-plus'} size={18} />
          <Text>{isFollowing ? 'Remove from friends' : 'Add to Friends'}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  friendAction: {},
});

export default connect(
  ({ auth }) => ({ auth }),
  { getUsers, follow, unfollow }
)(FriendAction);
