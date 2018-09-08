import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';

import Checkin from '../components/Checkin';

export default class CheckinDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    let { navigation } = this.props;
    let { checkIn } = navigation.state.params;

    return (
      <ScrollView>
        <Checkin checkIn={checkIn} canPress={false} />
      </ScrollView>
    );
  }
}
