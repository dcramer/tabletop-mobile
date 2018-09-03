import { getStatusBarHeight } from 'react-native-status-bar-height';

const colors = {
  background: '#ffffff',
  trim: '#e9e9e9',
  primary: '#7b6be6',
  primaryLight: '#e1def1',
  default: '#333333',
  light: '#aaaaaa',
};

const margins = {
  full: 18,
  half: 9,
  quarter: 4.5,
  threeQuarter: 9 + 4.5,
};

const layout = {
  statusBarHeight: getStatusBarHeight() + margins.half,
};

export { colors, layout, margins };
