/**
 * @format
 */

import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import configureStore from './src/state/store';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// config
const {store, persister} = configureStore();

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persister}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
