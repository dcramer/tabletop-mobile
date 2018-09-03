import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { Sentry } from 'react-native-sentry';
import { ApolloProvider } from 'react-apollo';

import api from './src/api';
import App from './src/App';
import rootReducer from './src/reducers';

Sentry.config('https://0dea694b33ed4112ba33163458d72df2@sentry.io/1252089', {
  environment: __DEV__ ? 'dev' : 'prod',
}).install();

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = compose(applyMiddleware(thunkMiddleware, loggerMiddleware))(
  createStore
);

const initialState = {};
const store = createStoreWithMiddleware(rootReducer, initialState);

class RootApp extends Component {
  render() {
    return (
      <ApolloProvider client={api}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
    );
  }
}
AppRegistry.registerComponent('cask', () => RootApp);
