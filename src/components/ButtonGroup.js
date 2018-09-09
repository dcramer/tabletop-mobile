import React from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup as RNEButtonGroup } from 'react-native-elements';
import { colors, margins } from '../styles';

export default props => (
  <RNEButtonGroup
    containerStyle={styles.buttonGroup}
    textStyle={styles.buttonText}
    innerBorderStyle={styles.buttonGroupInnerBorderStyle}
    selectedButtonStyle={styles.buttonActive}
    selectedTextStyle={styles.buttonActiveText}
    {...props}
  />
);

const styles = StyleSheet.create({
  buttonGroup: {
    backgroundColor: '#fff',
    borderColor: colors.primary,
    marginLeft: margins.half,
    marginRight: margins.half,
    marginTop: margins.half,
    marginBottom: margins.half,
    borderWidth: 2,
  },
  buttonGroupInnerBorderStyle: {
    color: colors.primary,
    width: 2,
  },
  buttonText: {
    color: colors.default,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonActiveText: {
    color: '#fff',
  },
});
