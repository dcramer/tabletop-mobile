import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CustomPropTypes from '../propTypes';
import { colors, margins } from '../styles';
import Card from '../components/Card';

class Friend extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    navigation: PropTypes.object.isRequired,
    user: CustomPropTypes.User.isRequired,
  };

  goToProfile = () => {
    let { user } = this.props;
    this.props.navigation.navigate('UserProfile', {
      id: user.id,
      user,
    });
  };

  render() {
    let { onPress, user } = this.props;
    if (onPress === undefined) {
      onPress = this.goToProfile;
    }
    return (
      <Card onPress={onPress} style={styles.container}>
        {user.photoURL ? (
          <Image
            source={{
              uri: user.photoURL,
            }}
            style={styles.userPhoto}
            resizeMode="contain"
          />
        ) : (
          <Icon name="user-circle" size={24} style={styles.userPhoto} />
        )}
        <Text style={styles.userName}>{user.displayName}</Text>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.default,
  },
  userPhoto: {
    height: 24,
    width: 24,
    marginRight: margins.half,
    borderRadius: 12,
  },
});

export default withNavigation(Friend);
