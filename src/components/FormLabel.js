import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, margins } from '../styles';

export default ({ children, style }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.text}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {},
  text: {
    marginTop: margins.half,
    marginBottom: margins.half,
    color: colors.default,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
