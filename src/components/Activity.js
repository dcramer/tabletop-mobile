import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import { FlatList, Text } from 'react-native';

import CheckIn from '../components/CheckIn';
import LoadingIndicator from '../components/LoadingIndicator';

import { getCheckIns } from '../actions/checkIns';

class Activity extends Component {
  state = { loading: true, error: null, items: [] };

  async componentDidMount() {
    this.props
      .getCheckIns(this.props.queryParams)
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

  _renderItem = ({ item }) => <CheckIn checkIn={item} />;

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
        data={this.state.items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

export default connect(
  null,
  { getCheckIns }
)(Activity);
