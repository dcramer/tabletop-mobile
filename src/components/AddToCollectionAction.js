import React, { Component } from 'react';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { withNavigation } from 'react-navigation';

import { getCollections, addGameToCollection } from '../actions/collections';
import { colors } from '../styles';
import CustomPropTypes from '../propTypes';

class AddToCollectionAction extends Component {
  static propTypes = {
    game: CustomPropTypes.Game.isRequired,
    style: ViewPropTypes.style,
  };

  addToCollection = collection => {
    this.props.addGameToCollection({
      collection: collection.id,
      game: this.props.game.id,
    });
  };

  onPress = () => {
    this.props.navigation.navigate('RelationSelect', {
      onChangeValue: this.addToCollection,
      onQuery: this.props.getCollections.bind(this, { createdBy: this.props.auth.user.id }),
      title: 'Collection',
      nounSingular: 'collection',
    });
  };

  render() {
    return (
      <TouchableOpacity style={this.props.style} onPress={this.onPress}>
        <Icon name="plus" size={24} color={colors.default} />
      </TouchableOpacity>
    );
  }
}
export default connect(
  ({ auth }) => ({ auth }),
  { getCollections, addGameToCollection }
)(withNavigation(AddToCollectionAction));
