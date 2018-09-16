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
import CommentAction from './CommentAction';
import LikeAction from './LikeAction';

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
    checkin: CustomPropTypes.Checkin.isRequired,
    navigation: PropTypes.object.isRequired,
    canPress: PropTypes.bool,
  };

  static defaultProps = {
    canPress: true,
  };

  goToCheckin = () => {
    let { checkin, navigation } = this.props;
    navigation.navigate('CheckinDetails', { id: checkin.id, checkin });
  };

  goToProfile = () => {
    let { checkin, navigation } = this.props;
    let { players } = checkin;
    navigation.navigate('UserProfile', { id: players[0].id, user: players[0] });
  };

  render() {
    let { checkin } = this.props;
    let { game, players } = checkin;
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
            {!!checkin.createdAt && <TimeAgo time={checkin.createdAt} />}
          </Text>
        </View>
        <Game game={game} style={styles.gameCard} />
        {!!checkin.rating && (
          <View style={styles.ratingContainer}>
            <Rating value={checkin.rating} maxValue={5} />
          </View>
        )}
        <View style={styles.actionContainer}>
          <LikeAction style={styles.action} color={colors.default} checkin={checkin} />
          <CommentAction style={styles.action} color={colors.default} checkin={checkin} />
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
    marginTop: margins.half,
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
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    flex: 1,
    alignItems: 'center',
    padding: margins.quarter,
  },
});

export default withNavigation(Checkin);
