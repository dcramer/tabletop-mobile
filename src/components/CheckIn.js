import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TimeAgo from 'react-native-timeago';

import { colors, margins } from '../styles';
import CustomPropTypes from '../propTypes';
import Game from './Game';
import Card from './Card';

class Rating extends Component {
  render() {
    let { value, maxValue } = this.props;
    let nodes = [];
    let totalStars = Math.min(value, maxValue);
    for (var i = 0; i < Math.floor(totalStars); i++) {
      nodes.push(<Icon name="star" solid size={24} key={i} />);
    }
    if (totalStars % 1 > 0.5) {
      nodes.push(<Icon name="star-half" solid size={24} key={0.5} />);
    }
    return <View style={styles.rating}>{nodes}</View>;
  }
}

class Checkin extends Component {
  static propTypes = {
    checkIn: CustomPropTypes.Checkin.isRequired,
    navigation: PropTypes.object.isRequired,
    canPress: PropTypes.bool,
  };

  static defaultProps = {
    canPress: true,
  };

  goToCheckin = () => {
    let { checkIn, navigation } = this.props;
    navigation.navigate('CheckinDetails', { id: checkIn.id, checkIn });
  };

  goToProfile = () => {
    let { checkIn, navigation } = this.props;
    navigation.navigate('UserProfile', { id: checkIn.createdBy.id, user: checkIn.createdBy });
  };

  render() {
    let { checkIn } = this.props;
    let { game, players } = checkIn;
    return (
      <Card style={styles.cardContainer} onPress={this.props.canPress ? this.goToCheckin : null}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.goToProfile} style={styles.user}>
            {players[0].avatar ? (
              <Image
                source={{
                  uri: players[0].avatar,
                }}
                style={styles.userPhoto}
                resizeMode="contain"
              />
            ) : (
              <Icon name="user-circle" size={24} style={styles.userPhoto} />
            )}
            <Text style={styles.userName} numberOfLines={2} ellipsizeMode={'tail'}>
              {players[0].name}
            </Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>
            {!!checkIn.createdAt && <TimeAgo time={checkIn.createdAt} />}
          </Text>
        </View>
        <Game game={game} style={styles.gameCard} />
        {!!checkIn.rating && (
          <View style={styles.ratingContainer}>
            <Rating value={checkIn.rating} maxValue={5} />
          </View>
        )}
        <View style={styles.actionContainer}>
          <Icon name="heart" size={24} color={colors.default} style={styles.action} />
          <Icon name="comments" size={24} color={colors.default} style={styles.action} />
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: margins.half,
    marginBottom: margins.half,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.trim,
  },
  gameCard: {
    borderWidth: 1,
    borderColor: colors.trim,
    borderRadius: 4,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: margins.half,
  },
  user: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  location: {
    flex: 1,
    marginTop: 5,
    fontSize: 14,
    color: colors.default,
  },
  timestamp: {
    textAlign: 'right',
    color: colors.light,
    fontSize: 12,
  },
  ratingContainer: {
    marginTop: margins.half,
  },
  rating: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    marginTop: margins.half,
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    flex: 1,
    textAlign: 'center',
    padding: margins.quarter,
  },
});

export default withNavigation(Checkin);
