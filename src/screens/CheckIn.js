import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Slider } from 'react-native-elements';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { addCheckIn } from '../actions/checkIns';
import { colors, margins } from '../styles';
import Bottle from '../components/Bottle';
import Card from '../components/Card';
import FormLabel from '../components/FormLabel';
import PersonList from '../components/PersonList';
import TagField from '../components/forms/TagField';
import LocationField from '../components/forms/LocationField';
import TextField from '../components/forms/TextField';

const flavorProfileDatabase = [
  { label: 'Bold', value: 'Bold' },
  { label: 'Peaty', value: 'Peaty' },
  { label: 'Wood', value: 'Wood' },
  { label: 'Fire', value: 'Fire' },
  { label: 'Apple Pie', value: 'Apple Pie' },
].sort((a, b) => a.label > b.label);

class CheckInRating extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = { value: 0 };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    let value = this.state.value;
    if (value) {
      value = value.toFixed(2);
    }
    return (
      <Card>
        <View style={styles.labelContainer}>
          <View style={styles.labelLeft}>
            <FormLabel>Rating</FormLabel>
          </View>
          <View style={styles.labelRight}>
            <Text style={value ? styles.ratingTextPresent : styles.ratingTextNone}>
              {value || 'Not Rated'}
            </Text>
          </View>
        </View>
        <Slider
          step={0.25}
          minimumValue={0}
          maximumValue={5}
          value={this.state.value}
          style={styles.ratingSlider}
          minimumTrackTintColor={colors.trim}
          maximumTrackTintColor={colors.trim}
          thumbTintColor={colors.primary}
          onValueChange={this.setValue}
        />
      </Card>
    );
  }
}

class CheckInFriends extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = { value: null };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    let { navigation } = this.props;
    let { value } = this.state;
    return (
      <Card style={styles.formElementContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FriendSelect', {
              currentValue: value,
              onChangeValue: this.setValue,
            })
          }>
          <View style={styles.labelContainer}>
            <View style={styles.labelLeft}>
              <FormLabel>Tag Friends</FormLabel>
            </View>
            <View style={styles.labelRight}>
              {value && <PersonList personList={value} style={styles.friendList} />}
              <Icon name="chevron-right" size={18} color={colors.default} />
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  }
}

class CheckIn extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    addCheckIn: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      notes: '',
      rating: 0,
      friends: [],
      location: null,
      flavorProfile: [],
      submitting: false,
    };
  }

  async componentDidMount() {
    let { auth, navigation } = this.props;
    let { bottle } = navigation.state.params;
    if (!bottle || auth.user.id) {
      navigation.navigate('Main');
    }
  }

  onChangeValue = (name, value) => {
    this.setState({ [name]: value });
  };

  onCheckIn = () => {
    if (!this.isValid()) return;
    if (this.state.submitting) return;
    let state = this.state;
    let { navigation } = this.props;
    let { bottle } = navigation.state.params;
    this.setState({ submitting: true });
    this.props
      .addCheckIn({
        bottle: bottle.id,
        notes: state.notes,
        rating: state.rating,
        friends: state.friends.map(f => f.id),
        location: state.location ? state.location.id : null,
        flavorProfile: state.flavorProfile,
      })
      .then(checkin => {
        navigation.popToTop();
      })
      .catch(error => {
        this.setState({ error, submitting: false });
      });
  };

  isValid = () => {
    return true;
  };

  render() {
    let { navigation } = this.props;
    let { bottle } = navigation.state.params;
    return (
      <ScrollView>
        <Bottle navigation={this.props.navigation} bottle={bottle} />
        {!!this.state.error && <Text>{this.state.error.message}</Text>}
        <TextField
          onChangeValue={v => this.onChangeValue('notes', v)}
          name="Tasting Notes"
          placeholder="How was it?"
        />
        <CheckInRating
          onChangeValue={v => this.onChangeValue('rating', v)}
          navigation={navigation}
        />
        <CheckInFriends
          onChangeValue={v => this.onChangeValue('friends', v)}
          navigation={navigation}
        />
        <LocationField onChangeValue={v => this.onChangeValue('location', v)} name="Location" />
        <TagField
          onChangeValue={v => this.onChangeValue('flavorProfile', v)}
          name="Flavor Profile"
          maxValues={5}
          tagList={flavorProfileDatabase}
        />
        <Button
          title="Confirm Check-in"
          onPress={this.onCheckIn}
          containerViewStyle={styles.buttonContainer}
          disabled={!this.isValid() || this.state.submitting}
          buttonStyle={styles.button}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: margins.full,
    marginBottom: margins.full,
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
  },
  formElementContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
  },
  labelLeft: {
    flex: 1,
    alignSelf: 'stretch',
  },
  labelRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: margins.half,
    marginBottom: margins.half,
  },
  friendList: {
    marginRight: margins.half,
  },
  ratingTextPresent: {
    color: colors.default,
  },
  ratingTextNone: {
    color: colors.light,
  },
  ratingSlider: {
    marginTop: margins.half,
    marginBottom: margins.half,
  },
  textInput: {
    marginTop: margins.half,
    marginBottom: margins.half,
  },
  tagSelect: {
    marginTop: margins.half,
    marginBottom: margins.half,
  },
});

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { addCheckIn }
)(CheckIn);
