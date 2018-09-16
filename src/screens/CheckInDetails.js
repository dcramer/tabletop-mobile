import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';

import Checkin from '../components/Checkin';

class CheckinDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    let { navigation } = this.props;
    let { id } = navigation.state.params;

    return (
      <ScrollView>
        <Checkin checkin={this.props.checkinCache[id]} canPress={false} />
      </ScrollView>
    );
  }
}

export default connect(({ checkins }) => ({
  checkinCache: checkins.checkinCache,
}))(CheckinDetails);
