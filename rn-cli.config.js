const path = require('path');
const blacklist = require('metro').createBlacklist;

module.exports = {
  // getTransformModulePath() {
  //   return require.resolve('react-native-typescript-transformer');
  // },
  // getSourceExts() {
  //   return ['ts', 'tsx'];
  // },
  getBlacklistRE: () => blacklist([/functions\/.*/]),
};
