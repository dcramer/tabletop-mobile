import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import { colors, margins } from '../styles';
import Card from '../components/Card';
import FormLabel from '../components/FormLabel';
import TagList from '../components/TagList';
import ModalHeader from '../components/ModalHeader';

class TagSelect extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    let { currentValue } = navigation.state.params;
    this.state = {
      query: '',
      selected: currentValue || [],
    };
  }

  async componentWillMount() {
    let { navigation } = this.props;
    let { tagList, title, onChangeValue } = navigation.state.params;
    if (!tagList || !title || !onChangeValue) navigation.goBack(null);
  }

  setValue = selected => {
    this.setState({ selected });
  };

  onDone = () => {
    let { navigation } = this.props;
    let { selected } = this.state;
    navigation.state.params.onChangeValue(selected);
    navigation.goBack();
  };

  render() {
    let { navigation } = this.props;
    let { maxValues, tagList, title } = navigation.state.params;
    let results = this.state.query
      ? tagList.filter(i => i.label.indexOf(this.state.query) !== -1)
      : tagList;

    return (
      <ScrollView style={styles.container}>
        <ModalHeader rightActionOnPress={this.onDone} title={title} />
        <View style={styles.search}>
          <SearchBar
            lightTheme
            onChangeText={text => this.setState({ query: text })}
            onClearText={text => this.setState({ query: text })}
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
            placeholder="Search"
          />
        </View>
        {!!this.state.selected.length && (
          <Card>
            <FormLabel>Selected {!!maxValues && `(${maxValues} max)`}</FormLabel>
            <TagList
              tagList={this.state.selected.sort().map(v => {
                return tagList.find(({ value }) => value === v);
              })}
              style={styles.tagSelect}
              value={this.state.selected}
              maxValues={maxValues}
              onChangeValue={this.setValue}
            />
          </Card>
        )}
        <Card>
          <FormLabel>All Tags</FormLabel>
          <TagList
            tagList={results}
            style={styles.tagSelect}
            value={this.state.selected}
            maxValues={maxValues}
            onChangeValue={this.setValue}
          />
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b6be6',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#7b6be6',
    borderTopWidth: 0,
  },
  searchInput: {
    color: '#000',
    fontSize: 14,
    backgroundColor: '#eee',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: margins.full,
    paddingBottom: margins.full,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
  },
  username: {
    flex: 1,
    fontSize: 14,
    color: colors.default,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  rowText: {
    paddingLeft: 10,
    flex: 4,
    flexDirection: 'column',
  },
});

export default withNavigation(TagSelect);
