import React, { Component } from 'react';
import { ViewPropTypes } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import { getCollections } from '../actions/collections';
import { updateGame } from '../actions/games';
import { colors } from '../styles';
import CustomPropTypes from '../propTypes';

class CollectionsButton extends Component {
  static propTypes = {
    game: CustomPropTypes.Game.isRequired,
    style: ViewPropTypes.style,
  };

  updateCollections = collections => {
    this.props.updateGame({
      game: this.props.game.id,
      collections: collections.map(c => c.id),
    });
  };

  onPress = () => {
    this.props
      .getCollections({ createdBy: this.props.auth.user.id, game: this.props.game.id })
      .then(items => {
        this.props.navigation.navigate('MultiRelationSelect', {
          currentValue: items,
          onChangeValue: this.updateCollections,
          onQuery: this.props.getCollections.bind(this, { createdBy: this.props.auth.user.id }),
          title: 'Collection',
          nounSingular: 'collection',
        });
      });
  };

  render() {
    return <Button title="Collections" {...this.props} onPress={this.onPress} />;
  }
}
export default connect(
  ({ auth }) => ({ auth }),
  { getCollections, updateGame }
)(withNavigation(CollectionsButton));
