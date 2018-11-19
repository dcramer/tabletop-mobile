import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, StyleSheet, ScrollView, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Swipeout from 'react-native-swipeout';

import {
  addGameToCollection,
  getCollection,
  getCollectionGames,
  removeGameFromCollection,
} from '../actions/collections';
import AlertCard from '../components/AlertCard';
import Collection from '../components/Collection';
import Game from '../components/Game';
import GameSearchWithOverlay from '../components/GameSearchWithOverlay';
import Header from '../components/Header';
import LoadingIndicator from '../components/LoadingIndicator';

class GameList extends Component {
  static propTypes = {
    onGameDelete: PropTypes.func.isRequired,
  };

  _renderItem = ({ item }) => {
    let swipeBtns = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => this.props.onGameDelete(item),
      },
    ];

    return (
      <Swipeout right={swipeBtns} autoClose backgroundColor="transparent">
        <Game game={item} />
      </Swipeout>
    );
  };

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
      <View style={styles.gameListContainer}>
        <FlatList data={results} keyExtractor={this._keyExtractor} renderItem={this._renderItem} />
      </View>
    );
  }
}

class CollectionDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getCollection: PropTypes.func.isRequired,
    getCollectionGames: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);

    let { navigation } = this.props;

    this.state = {
      loading: true,
      error: false,
      gameList: [],
      collection: navigation.getParam('collection'),
    };
  }
  async componentWillMount() {
    let { navigation } = this.props;
    let id = navigation.getParam('id');
    let [collection, gameList] = await Promise.all([
      this.props.getCollection({ id }),
      this.props.getCollectionGames({ id }),
    ]);

    this.setState({
      error: null,
      loading: false,
      gameList,
      collection,
    });

    // .then(items => {
    // })
    // .catch(error => {
    //   this.setState({ error, loading: false });
    //   Sentry.captureException(error);
    // });
  }

  onGameAdd = item => {
    this.props
      .addGameToCollection(
        {
          collection: this.state.collection.id,
          game: item.id,
        },
        this.props.auth.user
      )
      .then(({ game }) => {
        this.setState({
          gameList: [...this.state.gameList, game],
          collection: { ...this.state.collection, numGames: this.state.collection.numGames + 1 },
        });
      });
  };

  onGameDelete = item => {
    this.props
      .removeGameFromCollection(
        {
          collection: this.state.collection.id,
          game: item.id,
        },
        this.props.auth.user
      )
      .then(() => {
        this.setState({
          gameList: this.state.gameList.filter(i => i.id !== item.id),
          collection: { ...this.state.collection, numGames: this.state.collection.numGames - 1 },
        });
      });
  };

  goToEdit = () => {
    let { navigation } = this.props;
    navigation.navigate('EditCollection', {
      id: navigation.state.params.id,
      collection: this.state.collection,
    });
  };

  render() {
    let { collection, loading, error, gameList } = this.state;

    return (
      <View style={styles.container}>
        <Header
          title={collection.name}
          leftActionText=""
          leftActionOnPress={null}
          rightActionOnPress={this.goToEdit}
          rightActionText="Edit"
        />
        <View style={styles.container}>
          <Collection onPress={null} collection={collection} />
          <GameSearchWithOverlay
            placeholder="Add a game to this collection"
            onPress={this.onGameAdd}>
            <ScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator>
              <GameList
                loading={loading}
                error={error}
                results={gameList}
                onGameDelete={this.onGameDelete}
              />
            </ScrollView>
          </GameSearchWithOverlay>
        </View>
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
  ({ auth }) => ({ auth }),
  { addGameToCollection, getCollection, getCollectionGames, removeGameFromCollection }
)(withNavigation(CollectionDetails));
