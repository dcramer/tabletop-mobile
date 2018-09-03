import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Sentry } from 'react-native-sentry';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { getUsers } from '../actions/users';
import AlertCard from '../components/AlertCard';
import LoadingIndicator from '../components/LoadingIndicator';
import Friend from '../components/Friend';
import SearchBar from '../components/SearchBar';

class FriendList extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  state = { loading: true, error: null, items: [], query: '' };

  async componentDidMount() {
    this.props
      .getUsers({ scope: 'following' })
      .then(items => {
        this.setState({
          loading: false,
          error: null,
          items,
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        Sentry.captureException(error);
      });
  }

  _renderItem = ({ item }) => {
    return <Friend user={item} />;
  };

  _keyExtractor = item => item.id;

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }
    if (this.state.error) {
      return (
        <View style={styles.activityContainer}>
          <Text>Error: {this.state.error.message}</Text>
        </View>
      );
    }

    let results = this.state.items.filter(i => i.displayName.indexOf(this.state.query) !== -1);
    return (
      <View style={styles.activityContainer}>
        {this.state.items.length === 0 ? (
          <AlertCard
            heading="It's lonely in here"
            subheading="You don't seem to have any friends on Cask."
          />
        ) : (
          <Fragment>
            <SearchBar onChangeValue={query => this.setState({ query })} />
            <FlatList
              data={results}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </Fragment>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default connect(
  null,
  { getUsers }
)(FriendList);
