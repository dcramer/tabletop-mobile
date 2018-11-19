import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, StyleSheet, View } from 'react-native';

import { logOut } from '../actions/auth';
import Activity from '../components/Activity';
import ButtonGroup from '../components/ButtonGroup';
import FriendList from '../components/FriendList';
import Header from '../components/Header';

class MyProfile extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logOut: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  state = {
    selectedButton: 0,
  };

  goToFriends = () => {
    this.props.navigation.navigate('FindFriends');
  };

  renderButtonContent() {
    let { user } = this.props.auth;
    let { selectedButton } = this.state;
    if (selectedButton === 0) return <Activity queryParams={{ user: user.id }} />;
    else if (selectedButton === 1)
      return (
        <View>
          <FriendList userId={user.id} />
        </View>
      );
  }

  render() {
    if (this.state.loading) return null;
    return (
      <View style={styles.container}>
        <Header
          title="Profile"
          leftActionText="Friends"
          leftActionOnPress={this.goToFriends}
          rightActionOnPress={() =>
            Alert.alert('Confirm', 'Do you want to log out of this application?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Continue', onPress: this.props.logOut },
            ])
          }
          rightActionText="Log Out"
        />
        <ButtonGroup
          selectedIndex={this.state.selectedButton}
          onPress={idx => this.setState({ selectedButton: idx })}
          buttons={['Activity', 'Friends', 'Settings']}
        />
        {this.renderButtonContent()}
      </View>
    );
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
  { logOut }
)(MyProfile);
