import React, { Component } from 'react';

import Activity from '../components/Activity';
import ButtonGroup from '../components/ButtonGroup';
import GameSearchWithOverlay from '../components/GameSearchWithOverlay';

export default class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    activityScope: 'friends',
  };

  render() {
    return (
      <GameSearchWithOverlay header>
        <ButtonGroup
          selectedIndex={this.state.activityScope === 'friends' ? 0 : 1}
          onPress={idx => this.setState({ activityScope: idx === 0 ? 'friends' : 'public' })}
          buttons={['Friends', 'All']}
        />
        <Activity auth={this.props.auth} scope={this.state.activityScope} />
      </GameSearchWithOverlay>
    );
  }
}
