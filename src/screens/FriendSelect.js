import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';

import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { colors, margins } from '../styles';
import { getUsers } from '../actions/users';
import AlertCard from '../components/AlertCard';
import Card from '../components/Card';
import LoadingIndicator from '../components/LoadingIndicator';
import ModalHeader from '../components/ModalHeader';
import SearchBar from '../components/SearchBar';

class UserEntry extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onPress: PropTypes.func,
  };

  render() {
    let { user, onPress, selected } = this.props;
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <Card style={styles.cardContainer}>
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
          <Icon
            name={selected ? 'check-square' : 'square'}
            size={24}
            solid={selected}
            color={selected ? colors.primary : colors.default}
            style={styles.action}
          />
        </Card>
      </TouchableOpacity>
    );
  }
}

class FriendSelect extends Component {
  static propTypes = {
    getUsers: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    let { currentValue } = navigation.state.params;
    this.state = {
      query: '',
      items: [],
      loading: true,
      selected: currentValue ? currentValue.map(i => i.id) : [],
    };
  }

  async componentWillMount() {
    this.props
      .getUsers({ scope: 'following' })
      .then(items => {
        this.setState({
          loading: false,
          error: null,
          items,
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  }
  _renderItem = ({ item }) => (
    <UserEntry
      user={item}
      navigation={this.props.navigation}
      selected={this.state.selected.indexOf(item.id) !== -1}
      onPress={() => this.onPressUser(item.id)}
    />
  );

  _keyExtractor = item => item.id;

  onPressUser = value => {
    let selected = this.state.selected;
    if (selected.indexOf(value) !== -1) {
      selected = selected.filter(v => v !== value);
    } else {
      selected = [...selected, value];
    }
    this.setState({ selected });
  };

  onDone = () => {
    let { navigation } = this.props;
    let { selected } = this.state;
    navigation.state.params.onChangeValue(
      selected.map(personId => {
        return this.state.items.find(p => p.id === personId);
      })
    );
    navigation.goBack();
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }
    if (this.state.error) {
      return (
        <View style={styles.activityContainer}>
          <Text>Error: {this.state.error.message}</Text>
        </View>
      );
    }

    let results = this.state.items.filter(i => i.displayName.indexOf(this.state.query) !== -1);
    return (
      <View style={styles.container}>
        <ModalHeader rightActionOnPress={this.onDone} title="Tag Friends" />
        {this.state.items.length === 0 ? (
          <AlertCard
            heading="It's lonely in here"
            subheading="You don't seem to have any friends on Cask."
          />
        ) : (
          <Fragment>
            <SearchBar onChangeValue={query => this.setState({ query })} />
            <FlatList
              data={results}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </Fragment>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 3,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: margins.full,
    paddingBottom: margins.full,
  },
  userName: {
    flex: 1,
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
  action: {},
});

export default connect(
  null,
  { getUsers }
)(withNavigation(FriendSelect));
