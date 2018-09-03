import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { withNavigation } from 'react-navigation';

import CustomPropTypes from '../../propTypes';
import { colors, margins } from '../../styles';
import Card from '../Card';
import FormLabel from '../FormLabel';

class LocationField extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.shape(CustomPropTypes.Location),
  };

  constructor(...args) {
    super(...args);
    this.state = { value: this.props.value };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    let { navigation } = this.props;
    let { value } = this.state;
    return (
      <Card style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('LocationSelect', {
              currentValue: value,
              onChangeValue: this.setValue,
              title: this.props.name,
            })
          }>
          <View style={styles.labelContainer}>
            <View style={styles.labelLeft}>
              <FormLabel>{this.props.name}</FormLabel>
            </View>
            <View style={styles.labelRight}>
              <Icon name="chevron-right" size={18} color={colors.default} />
            </View>
          </View>
        </TouchableOpacity>
        {value && <Text>{value.name}</Text>}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
});

export default withNavigation(LocationField);
