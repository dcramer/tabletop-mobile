import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { colors, layout, margins } from '../styles';
import AlertCard from '../components/AlertCard';
import Game from '../components/Game';
import LoadingIndicator from '../components/LoadingIndicator';

class GameSearchResults extends Component {
  static propTypes = {
    onPress: PropTypes.func,
  };

  _renderItem = ({ item }) => <Game game={item} onPress={this.props.onPress} />;

  _keyExtractor = item => item.id;

  render() {
    return <View style={styles.container}>{this.renderChild()}</View>;
  }

  renderChild() {
    let { query, error, loading, results } = this.props;
    if (error) {
      return <Text>{error.message}</Text>;
    }

    if (query && !loading && !results.length) {
      return (
        <AlertCard
          onPress={() => {
            this.props.navigation.navigate('AddGame', { name: this.props.query });
          }}
          heading="Can't find a game?"
          subheading={`Tap here to add ${query}.`}
        />
      );
    }

    if (loading && !results.length) {
      return <LoadingIndicator />;
    }

    if (query) {
      return (
        <View>
          <FlatList
            data={results}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
          <AlertCard
            onPress={() => {
              this.props.navigation.navigate('AddGame', { name: this.props.query });
            }}
            heading="Can't find a game?"
            subheading={`Tap here to add ${this.props.query}.`}
          />
        </View>
      );
    }

    return <Text>Type something!</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withNavigation(GameSearchResults);
