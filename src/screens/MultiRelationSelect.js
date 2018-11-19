import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Sentry } from 'react-native-sentry';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { colors, margins } from '../styles';
import AlertCard from '../components/AlertCard';
import Card from '../components/Card';
import Header from '../components/Header';
import LoadingIndicator from '../components/LoadingIndicator';
import SearchBar from '../components/SearchBar';

class SearchResults extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    onQuery: PropTypes.func.isRequired,
    addScreen: PropTypes.string,
    onSelect: PropTypes.func,
    query: PropTypes.string,
    selected: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { loading: false, error: null, items: [] };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchData();
    }
  }

  fetchData = () => {
    let { query } = this.props;
    this.setState({ loading: true });
    this.props
      .onQuery({ query })
      .then(items => {
        this.setState({
          loading: false,
          items,
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        Sentry.captureException(error);
      });
  };

  _renderItem = ({ item }) => {
    let selected = this.props.selected.indexOf(item.id) !== -1;
    return (
      <TouchableOpacity onPress={() => this.props.onSelect(item)}>
        <Card style={styles.cardContainer}>
          <Text style={styles.name}>{item.name}</Text>
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
  };

  _keyExtractor = item => item.id;

  render() {
    return <View style={styles.searchContainer}>{this.renderChild()}</View>;
  }

  renderChild() {
    if (this.state.error) {
      return <Text>{this.state.error.message}</Text>;
    }

    if (this.state.loading && !this.state.items.length) {
      return <LoadingIndicator />;
    }

    return (
      <View>
        <FlatList
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          selected={this.props.selected}
          renderItem={this._renderItem}
        />
        {!!this.props.query &&
          this.props.addScreen && (
            <AlertCard
              onPress={() => {
                this.props.navigation.navigate(this.props.addScreen, {
                  name: this.props.query,
                  onComplete: this.props.onSelect,
                });
              }}
              heading={`Can't find a ${this.props.nounSingular || 'result'}?`}
              subheading={`Tap here to add ${this.props.query}.`}
            />
          )}
      </View>
    );
  }
}

class MultiRelationSelect extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    let { currentValue } = navigation.state.params;
    this.state = {
      query: '',
      items: currentValue || [],
      selected: currentValue ? currentValue.map(i => i.id) : [],
    };
  }

  async componentWillMount() {
    let { navigation } = this.props;
    let { title, onChangeValue } = navigation.state.params;
    if (!title || !onChangeValue) navigation.goBack(null);
  }

  onSelect = value => {
    let { items, selected } = this.state;
    let { id } = value;
    if (selected.indexOf(id) !== -1) {
      selected = selected.filter(v => v !== id);
      items = items.filter(v => v.id !== id);
    } else {
      selected = [...selected, id];
      items = [...items, value];
    }
    this.setState({ items, selected });
  };

  onDone = () => {
    let { navigation } = this.props;
    navigation.state.params.onChangeValue(this.state.items);
    navigation.goBack();
  };

  render() {
    let { navigation } = this.props;
    let { addScreen, nounSingular, onQuery, title } = navigation.state.params;
    return (
      <View style={styles.container}>
        <Header rightActionOnPress={this.onDone} title={title} />
        <View style={styles.search}>
          <SearchBar onChangeValue={query => this.setState({ query })} />
        </View>
        <SearchResults
          onSelect={this.onSelect}
          query={this.state.query}
          selected={this.state.selected}
          addScreen={addScreen}
          nounSingular={nounSingular}
          navigation={this.props.navigation}
          onQuery={onQuery}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.default,
  },
  cardContainer: {
    flex: 3,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: margins.full,
    paddingBottom: margins.full,
  },
  search: {
    backgroundColor: '#7b6be6',
  },
});

export default withNavigation(MultiRelationSelect);
