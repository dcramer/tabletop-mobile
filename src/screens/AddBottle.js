import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { addBottle } from '../actions/bottles';
import { getBrands } from '../actions/brands';
import { getDistilleries } from '../actions/distilleries';
import { getSpiritTypes } from '../actions/spiritTypes';
import { colors, margins } from '../styles';
import RelationField from '../components/forms/RelationField';
import TextField from '../components/forms/TextField';

class AddBottle extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Add Bottle',
  };

  constructor(...args) {
    super(...args);
    this.state = {
      name: '',
      distillery: null,
      brand: null,
      spiritType: '',
      abv: null,
      statedAge: null,
      vintageYear: null,
      bottleYear: null,
      caskType: '',
      series: '',
      error: null,
      submitting: false,
    };
  }

  onChangeValue = (name, value) => {
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    if (!this.isValid()) return;
    if (this.state.submitting) return;
    let state = this.state;
    let { navigation } = this.props;
    this.setState({ error: null, submitting: true });
    this.props
      .addBottle({
        name: state.name,
        distillery: state.distillery ? state.distillery.id : null,
        brand: state.brand ? state.brand.id : null,
        spiritType: state.spiritType ? state.spiritType.id : null,
        series: state.series,
        age: state.age ? parseInt(state.age, 10) : null,
        vintageYear: state.vintageYear ? parseInt(state.vintageYear, 10) : null,
        bottleYear: state.bottleYear ? parseInt(state.bottleYear, 10) : null,
        abv: state.abv ? parseInt(state.abv * 100, 10) / 100 : null,
      })
      .then(bottle => {
        navigation.navigate('BottleDetails', {
          id: bottle.id,
          bottle,
        });
      })
      .catch(error => {
        this.setState({ error, submitting: false });
      });
  };

  isValid = () => {
    let state = this.state;

    if (!state.name) return false;

    if (!state.distillery) return false;

    //if (!state.category) return false;

    if (state.age && !(parseInt(state.age, 10) > 0)) return false;

    return true;
  };

  render() {
    return (
      <ScrollView>
        {!!this.state.error && <Text>Error: {this.state.error.message}</Text>}
        <TextField
          onChangeValue={v => this.onChangeValue('name', v)}
          name="Name"
          placeholder="e.g. Bowmore 1965"
        />
        <RelationField
          onChangeValue={v => this.onChangeValue('brand', v)}
          onQuery={this.props.getBrands}
          name="Brand"
        />
        <RelationField
          onChangeValue={v => this.onChangeValue('distillery', v)}
          onQuery={this.props.getDistilleries}
          name="Distillery"
        />
        <TextField
          onChangeValue={v => this.onChangeValue('age', v)}
          name="Stated Age (in years)"
          placeholder="e.g. 21"
          keyboardType="number-pad"
        />
        <RelationField
          onChangeValue={v => this.onChangeValue('spiritType', v)}
          onQuery={this.props.getSpiritTypes}
          name="Spirit Type"
        />
        <TextField
          onChangeValue={v => this.onChangeValue('series', v)}
          name="Series"
          placeholder="e.g. 2018 Limited"
        />
        <Button
          title="Add Bottle"
          onPress={this.onSubmit}
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
    alignItems: 'center',
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
});

export default connect(
  null,
  { addBottle, getBrands, getDistilleries, getSpiritTypes }
)(AddBottle);
