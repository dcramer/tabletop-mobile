import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { loginFacebook, loginSuccess } from '../actions/auth';
import { colors, layout, margins } from '../styles';

class Welcome extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    header: null,
  };

  render() {
    let { auth } = this.props;
    return (
      <View style={styles.container}>
        <Icon style={styles.icon} name="dice" size={160} color="white" />
        <Text style={styles.label}>TABLETOP</Text>
        <View style={styles.loginContainer}>
          <Button onPress={this.props.loginFacebook} title="Continue with Facebook" color="#fff" />
        </View>
        {auth.loginError &&
          auth.loginErrorMessage && (
            <View>
              <Text>Error: {auth.loginErrorMessage}</Text>
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: layout.statusBarHeight + margins.half,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  loginContainer: {
    padding: margins.quarter,
    margin: margins.full * 2,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#4267B2',
  },
  label: {
    marginTop: 20,
    color: '#fff',
    fontFamily: 'Rubik',
    fontSize: 34,
    fontWeight: 'bold',
  },
});

export default connect(
  ({ auth }) => ({ auth }),
  { loginFacebook, loginSuccess }
)(Welcome);
