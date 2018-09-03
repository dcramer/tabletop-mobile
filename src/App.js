import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import { refreshSession } from './actions/auth';
import { RootNavigator, UnauthenticatedNavigator } from './router';
import Loading from './screens/Loading';

// const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

class App extends Component {
  async componentWillMount() {
    await this.props.refreshSession();
  }

  render() {
    return <View style={styles.container}>{this.renderBody()}</View>;
  }

  renderBody() {
    if (this.props.auth.validToken === null) {
      return <Loading />;
    }
    if (!this.props.auth.validToken) {
      return <UnauthenticatedNavigator {...this.props} />;
    }
    return <RootNavigator {...this.props} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { refreshSession }
)(App);
