import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { getUsers } from '../actions/users';
import Friend from '../components/Friend';
import SearchBar from '../components/SearchBar';

class FindFriends extends Component {
  static propTypes = {
    getUsers: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      searchQuery: '',
      searchResults: [],
      searchLoading: false,
    };
  }
  _renderItem = ({ item }) => <Friend user={item} />;

  _keyExtractor = item => item.id;

  onPressPerson = value => {};

  onSearch = searchQuery => {
    this.setState({ searchQuery, searchLoading: true });
    this.props
      .getUsers({ query: searchQuery })
      .then(items => {
        this.setState({
          searchLoading: false,
          searchResults: items,
        });
      })
      .catch(error => {
        this.setState({ searchError: error, searchLoading: false });
      });
  };

  render() {
    let { searchResults, searchQuery } = this.state;
    return (
      <View style={styles.container}>
        <SearchBar onChangeValue={this.onSearch} loading={this.state.searchLoading} />
        {searchQuery && searchResults.length === 0 ? (
          <Text>No results found.</Text>
        ) : (
          <FlatList
            data={this.state.searchResults}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(
  null,
  { getUsers }
)(withNavigation(FindFriends));
