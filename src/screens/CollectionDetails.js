import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet, ScrollView, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { getCollectionGames } from '../actions/collections';
import AlertCard from '../components/AlertCard';
import Collection from '../components/Collection';
import Game from '../components/Game';
import LoadingIndicator from '../components/LoadingIndicator';

class GameList extends Component {
  _renderItem = ({ item }) => <Game game={item} />;

  _keyExtractor = item => item.id;

  render() {
    return <View>{this.renderChild()}</View>;
  }

  renderChild() {
    let { error, loading, results } = this.props;
    if (error) {
      return <Text>{error.message}</Text>;
    }

    if (loading && !results.length) {
      return <LoadingIndicator />;
    }

    if (results.length === 0) {
      return (
        <View>
          <AlertCard
            heading="No games"
            subheading="This collection doesn't have any games listed."
          />
        </View>
      );
    }
    return (
      <View>
        <FlatList data={results} keyExtractor={this._keyExtractor} renderItem={this._renderItem} />
      </View>
    );
  }
}

class CollectionDetails extends Component {
  state = {
    loading: true,
    error: false,
    results: [],
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getCollectionGames: PropTypes.func.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    let { collection } = navigation.state.params;
    return {
      title: collection.name,
    };
  };

  componentDidMount() {
    let { navigation } = this.props;
    let { id } = navigation.state.params;
    this.props
      .getCollectionGames({ id })
      .then(items => {
        this.setState({
          error: null,
          loading: false,
          results: items,
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        Sentry.captureException(error);
      });
  }

  render() {
    let { navigation } = this.props;
    let { collection } = navigation.state.params;

    let { loading, error, results } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Collection onPress={null} collection={collection} />
        <GameList loading={loading} error={error} results={results} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(
  ({ auth }) => ({ auth }),
  { getCollectionGames }
)(withNavigation(CollectionDetails));
