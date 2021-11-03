import {getUniqueId} from 'react-native-device-info';
// API
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

// User Preference
import {KEYS, storeData} from 'state/utils/UserPreference';

const uploadToken = async fcmToken => {
  try {
    // fetching device's unique id
    let uniqueId = getUniqueId();

    if (uniqueId !== 'unknown') {
      // preparing params
      const params = {
        uniqueDeviceId: uniqueId,
        token: fcmToken,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/uploadToken',
        params,
      );

      if (response) {
        const {success} = response;
        if (success) {
          const {userInfo} = response;
          const {deviceId} = userInfo;
          // persisting deviceInfo
          await storeData(KEYS.DEVICE_UNIQUE_ID, {deviceId});
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export default uploadToken;
