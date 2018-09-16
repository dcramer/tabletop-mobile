import React, { Component } from 'react';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import { FlatList, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

import Checkin from '../components/Checkin';
import LoadingIndicator from '../components/LoadingIndicator';

import { getCheckins } from '../actions/checkins';

class Activity extends Component {
  state = { loading: true, error: null, itemIds: [] };

  static propTypes = {
    game: PropTypes.string,
    scope: PropTypes.string,
    user: PropTypes.string,
  };

  constructor(...args) {
    super(...args);
    this._willFocus = this.props.navigation.addListener('willFocus', payload => {
      this.setState({ loading: true }, this.reload);
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   // TODO(dcramer): how do we deep equal with RN? lodash?
  //   console.warn()
  //   if (!isEqual(this.props, nextProps)) {
  //     this.setState({ loading: true }, this.reload);
  //   }
  // }

  componentDidMount = () => {
    this.reload();
  };

  componentWillUnmount = () => {
    this._willFocus.remove();
  };

  reload = () => {
    this.props
      .getCheckins({
        scope: this.props.scope,
        game: this.props.game,
        user: this.props.user,
      })
      .then(items => {
        this.setState({
          loading: false,
          error: null,
          itemIds: items.map(i => i.id),
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        Sentry.captureException(error);
      });
  };

  _renderItem = ({ item }) => <Checkin checkin={item} />;

  _keyExtractor = item => item.id;

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }
    if (this.state.error) {
      return <Text>Error: {this.state.error.message}</Text>;
    }
    return (
      <FlatList
        data={this.state.itemIds.map(id => this.props.checkinCache[id]).filter(i => !!i)}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

export default connect(
  ({ checkins }) => ({
    checkinCache: checkins.checkinCache,
  }),
  { getCheckins }
)(withNavigation(Activity));
