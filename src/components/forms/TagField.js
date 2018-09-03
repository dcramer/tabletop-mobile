import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { colors, margins } from '../../styles';
import Card from '../Card';
import FormLabel from '../FormLabel';
import TagList from '../TagList';

class TagField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    tagList: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string).isRequired,
      PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ).isRequired,
    ]).isRequired,
    maxValues: PropTypes.number,
    value: PropTypes.arrayOf(PropTypes.string),
  };

  constructor(...args) {
    super(...args);
    this.state = { value: [] };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    let { navigation } = this.props;
    let tagList = this.props.tagList.map(tag => {
      if (tag.label && tag.value) return tag;
      tag = '' + tag;
      return { value: tag, label: tag };
    });

    return (
      <Card style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TagSelect', {
              currentValue: this.state.value,
              onChangeValue: this.setValue,
              maxValues: this.props.maxValues,
              tagList: tagList,
              title: this.props.name,
            });
          }}>
          <View style={styles.labelContainer}>
            <View style={styles.labelLeft}>
              <FormLabel>{this.props.name}</FormLabel>
            </View>
            <View style={styles.labelRight}>
              <Icon name="chevron-right" size={18} color={colors.default} />
            </View>
          </View>
        </TouchableOpacity>
        <TagList
          tagList={tagList}
          style={styles.tagSelect}
          value={this.state.value}
          maxValues={this.props.maxValues}
          onChangeValue={this.setValue}
        />
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
  tagSelect: {
    marginTop: margins.half,
    marginBottom: margins.half,
  },
});

export default withNavigation(TagField);
