import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Sentry } from 'react-native-sentry';

import { colors } from '../styles';
import { getLocations } from '../actions/locations';
import Card from '../components/Card';
import ModalHeader from '../components/ModalHeader';
import LoadingIndicator from '../components/LoadingIndicator';
import SearchBar from '../components/SearchBar';

class SearchResults extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    getLocations: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    query: PropTypes.string,
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
      .getLocations({ query })
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

  _renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.props.onSelect(item)}>
      <Card>
        <Text style={styles.name}>{item.name}</Text>
      </Card>
    </TouchableOpacity>
  );

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
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

class LocationSelect extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    this.state = { query: '' };
  }

  async componentWillMount() {
    let { navigation } = this.props;
    let { title, onChangeValue } = navigation.state.params;
    if (!title || !onChangeValue) navigation.goBack(null);
  }

  onSelect = value => {
    let { navigation } = this.props;
    navigation.state.params.onChangeValue(value);
    navigation.goBack();
  };

  render() {
    let { navigation } = this.props;
    let { title } = navigation.state.params;
    return (
      <View style={styles.container}>
        <ModalHeader title={title} />
        <View style={styles.search}>
          <SearchBar onChangeValue={query => this.setState({ query })} />
        </View>
        <SearchResults
          onSelect={this.onSelect}
          query={this.state.query}
          navigation={this.props.navigation}
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
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.default,
  },
  search: {
    backgroundColor: '#7b6be6',
  },
});

export default connect(
  null,
  { getLocations }
)(withNavigation(LocationSelect));
