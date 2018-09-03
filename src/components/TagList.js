import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';

import { colors, margins } from '../styles';

class TagItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    selected: PropTypes.bool,
    itemStyle: ViewPropTypes.style,
    itemStyleSelected: ViewPropTypes.style,
    itemLabelStyle: ViewPropTypes.style,
    itemLabelStyleSelected: ViewPropTypes.style,
  };

  render() {
    let props = this.props;
    return (
      <View style={styles.tagContainer}>
        <TouchableOpacity onPress={props.onPress} activeOpacity={1}>
          <View
            style={[
              styles.inner,
              props.itemStyle,
              props.selected && styles.innerSelected,
              props.selected && props.itemStyleSelected,
            ]}>
            <Text
              numberOfLines={1}
              style={[
                styles.labelText,
                props.itemLabelStyle,
                props.selected && styles.labelTextSelected,
                props.selected && props.itemLabelStyleSelected,
              ]}>
              {props.label}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class TagList extends Component {
  static propTypes = {
    tagList: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    style: ViewPropTypes.style,
    value: PropTypes.arrayOf(PropTypes.string), // set or array
    maxValues: PropTypes.number,
    onChangeValue: PropTypes.func.isRequired,
  };

  onSelectTag = value => {
    let selected = this.props.value;
    if (selected.indexOf(value) !== -1) {
      selected = selected.filter(v => v !== value);
    } else {
      if (this.props.maxValues && selected.length === this.props.maxValues) {
        if (this.props.maxValues !== 1) {
          return; // cannot select more values
        }
        selected = [value];
      } else {
        selected = [...selected, value];
      }
    }
    this.props.onChangeValue(selected);
  };

  render() {
    let selectedSet = new Set(this.props.value);
    return (
      <View style={[styles.listContainer, this.props.style]}>
        {this.props.tagList.map(({ label, value }) => (
          <TagItem
            key={value}
            label={label}
            value={value}
            onPress={() => this.onSelectTag(value)}
            selected={selectedSet.has(value)}
          />
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
    marginTop: margins.half,
    marginBottom: margins.quarter,
  },
  tagContainer: {
    marginBottom: margins.quarter,
    marginRight: margins.half,
  },
  inner: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  innerSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  labelText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  labelTextSelected: {
    color: '#ffffff',
  },
});
