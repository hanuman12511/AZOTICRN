import {combineReducers, applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

import {encryptTransform} from 'redux-persist-transform-encrypt';

const encryptor = encryptTransform({
  secretKey: 'com.agzotic',
  onError: function (error) {
    console.log(error);
  },
});

// root reducer
import * as reducers from './ducks';

export default function configureStore(initialState = {}) {
  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // transforms: encryptor,
    whitelist: ['userInfo', 'cartItemCount'],
  };
  const rootReducer = combineReducers(reducers);
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const middleware = [thunk];
  const enhancer = composeWithDevTools(applyMiddleware(...middleware));

  const store = createStore(persistedReducer, initialState, enhancer);
  const persister = persistStore(store);

  return {store, persister};
}
