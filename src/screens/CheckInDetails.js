import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';

import CheckIn from '../components/CheckIn';

export default class CheckInDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    let { navigation } = this.props;
    let { checkIn } = navigation.state.params;

    return (
      <ScrollView>
        <CheckIn checkIn={checkIn} canPress={false} />
      </ScrollView>
    );
  }
}
