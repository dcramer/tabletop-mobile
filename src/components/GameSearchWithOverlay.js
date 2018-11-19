import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import { StyleSheet, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { colors, layout, margins } from '../styles';
import { getGames } from '../actions/games';
import GameSearchResults from '../components/GameSearchResults';
import SearchBar from '../components/SearchBar';

class GameSearchWithOverlay extends Component {
  static propTypes = {
    getGames: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    header: PropTypes.bool,
    onPress: PropTypes.func,
  };

  state = {
    query: null,
    results: [],
    loading: false,
    active: false,
  };

  constructor(...args) {
    super(...args);

    this._willFocus = this.props.navigation.addListener('willFocus', payload => {
      this.resetSearch();
    });
  }

  componentWillUnmount = () => {
    this._willFocus.remove();
    if (this._activeQuery) this._activeQuery.cancel();
  };

  resetSearch = () => {
    this.setState({
      active: false,
    });
  };

  onPress = item => {
    this.resetSearch();
    this.props.onPress(item);
  };

  onSearch = query => {
    this.setState({ query, loading: true });
    if (this._activeQuery) this._activeQuery.cancel();
    this._activeQuery = this.props
      .getGames({ query, first: 25 })
      .then(items => {
        this.setState({
          error: null,
          loading: false,
          results: items,
          active: true,
        });
        this._activeQuery = null;
      })
      .catch(error => {
        this._activeQuery = null;
        this.setState({ error, loading: false });
        Sentry.captureException(error);
      });
  };

  render() {
    let { header, placeholder } = this.props;
    return (
      <View style={styles.container}>
        <View style={header && styles.header}>
          <SearchBar
            onChangeValue={this.onSearch}
            style={styles.searchBarContainer}
            loading={this.state.loading}
            placeholder={placeholder}
            header={header}
            value={this.state.query}
            onFocus={() => this.setState({ active: true })}
          />
        </View>
        {this.state.active && this.state.query ? (
          <View style={styles.resultsContainer}>
            <GameSearchResults
              query={this.state.query}
              loading={this.state.loading}
              error={this.state.error}
              results={this.state.results}
              onPress={this.props.onPress ? this.onPress : null}
            />
          </View>
        ) : (
          this.props.children
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    paddingTop: margins.half,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: layout.statusBarHeight,
  },
});

export default connect(
  ({ auth }) => ({ auth }),
  { getGames }
)(withNavigation(GameSearchWithOverlay));
