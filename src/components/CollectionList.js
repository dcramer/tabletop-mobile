import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Sentry } from 'react-native-sentry';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { getCollections } from '../actions/collections';
import AlertCard from '../components/AlertCard';
import Collection from '../components/Collection';
import LoadingIndicator from '../components/LoadingIndicator';
import SearchBar from '../components/SearchBar';

class CollectionList extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  state = { loading: true, error: null, items: [], query: '' };

  async componentDidMount() {
    this.props
      .getCollections({ createdBy: this.props.userId })
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
    return <Collection collection={item} />;
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

    let results = this.state.items.filter(i => i.name.indexOf(this.state.query) !== -1);
    return (
      <View style={styles.activityContainer}>
        {this.state.items.length === 0 ? (
          <AlertCard
            heading="It's lonely in here"
            subheading="You haven't created any collections on Tabletop."
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
  { getCollections }
)(CollectionList);
