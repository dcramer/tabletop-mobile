import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, StyleSheet, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import { logOut } from '../actions/auth';
import { colors, margins } from '../styles';
import Activity from '../components/Activity';
import FriendList from '../components/FriendList';
import ModalHeader from '../components/ModalHeader';

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
        <ModalHeader
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
          containerStyle={styles.buttonGroup}
          textStyle={styles.buttonText}
          selectedIndex={this.state.selectedButton}
          innerBorderStyle={styles.buttonGroupInnerBorderStyle}
          selectedButtonStyle={styles.buttonActive}
          selectedTextStyle={styles.buttonActiveText}
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
  buttonGroup: {
    backgroundColor: '#fff',
    borderColor: colors.primary,
    marginTop: margins.half,
    marginBottom: margins.half,
    borderWidth: 2,
  },
  buttonGroupInnerBorderStyle: {
    color: colors.primary,
    width: 2,
  },
  buttonText: {
    color: colors.default,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonActiveText: {
    color: '#fff',
  },
});

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { logOut }
)(MyProfile);
