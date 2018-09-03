import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import CustomPropTypes from '../propTypes';
import { margins } from '../styles';

class PersonItem extends Component {
  static propTypes = {
    user: CustomPropTypes.User.isRequired,
    style: ViewPropTypes.style,
  };

  render() {
    let { user, style } = this.props;
    return (
      <View style={[styles.listItem, style]}>
        {user.photoURL ? (
          <Image
            source={{
              uri: user.photoURL,
            }}
            style={styles.userPhoto}
            resizeMode="contain"
          />
        ) : (
          <Icon name="user-circle" size={22} style={styles.userPhoto} />
        )}
      </View>
    );
  }
}

export default class PersonList extends Component {
  static propTypes = {
    personList: PropTypes.arrayOf(CustomPropTypes.User.isRequired).isRequired,
    style: ViewPropTypes.style,
  };

  render() {
    return (
      <View style={[styles.listContainer, this.props.style]}>
        {this.props.personList.map(user => (
          <PersonItem user={user} key={user.id} />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  listItem: {
    marginRight: margins.quarter,
  },
  userPhoto: {
    height: 22,
    width: 22,
    borderRadius: 11,
  },
});
