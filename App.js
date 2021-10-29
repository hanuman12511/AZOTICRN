import React, {Component} from 'react';
import {LogBox} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';
import {ModalPortal} from 'react-native-modals';

// Splash Screen
import SplashScreen from './src/screens/SplashScreen';

// User Preference
// import {KEYS, getData} from './src/api/UserPreference';

// Routes
import {createRootNavigator} from './src/routes/Routes';

// Routes
import {nsSetTopLevelNavigator} from './src/routes/NavigationService';

// UserPreference
import {KEYS, storeData, getData} from './src/api/UserPreference';

import {checkPermission} from './src/firebase_api/FirebaseAPI';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// Firebase API
import {
  createOnTokenRefreshListener,
  removeOnTokenRefreshListener,
  createNotificationListeners,
  removeNotificationListeners,
} from './src/firebase_api/FirebaseAPI';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userInfo: null,
      locationCoords: '',
    };
  }

  componentDidMount() {
    try {
      setTimeout(this.initialSetup, 2000);
    } catch (error) {
      console.log(error.message);
    }
  }

  initialSetup = async () => {
    try {
      await checkPermission();
      createOnTokenRefreshListener(this);
      createNotificationListeners(this);
      // Fetching userInfo
      const locationCoords = await getData(KEYS.LOCATION_COORDS);

      const userInfo = await getData(KEYS.USER_INFO);
      // const isLoggedIn = userInfo ? true : false;

      this.setState({userInfo, locationCoords, isLoading: false});
    } catch (error) {
      console.log(error.message);
    }
  };

  componentWillUnmount() {
    // Removing firebase listeners
    removeOnTokenRefreshListener(this);
    removeNotificationListeners(this);
  }

  setNavigatorRef = ref => {
    nsSetTopLevelNavigator(ref);
  };

  render() {
    const {isLoading, userInfo, locationCoords} = this.state;

    if (isLoading) {
      return <SplashScreen />;
    }

    const RootNavigator = createRootNavigator(userInfo, locationCoords);
    const AppContainer = createAppContainer(RootNavigator);
    return (
      <RootSiblingParent>
        <SafeAreaProvider>
          <AppContainer ref={this.setNavigatorRef} />
          <ModalPortal />
        </SafeAreaProvider>
      </RootSiblingParent>
    );
  }
}
