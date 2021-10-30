import AsyncStorage from '@react-native-community/async-storage';
import {encryptData, decryptData} from './EncryptionUtility';

// User Preferences Keys
export const KEYS = {
  NOTIFICATION_COUNT: 'notificationCount',
  DEVICE_UNIQUE_ID: 'deviceUniqueId',
  CURRENT_LOCATION: 'formattedAddress',
  LOCATION_COORDS: 'locationCoords',
};

// Methods
export const storeData = async (key, data) => {
  try {
    const info = JSON.stringify(data);
    const encryptedInfo = await encryptData(info);
    await AsyncStorage.setItem(key, encryptedInfo);
  } catch (error) {
    console.log(error.message);
  }
};

export const getData = async key => {
  try {
    const rawData = await AsyncStorage.getItem(key);
    if (!rawData) {
      return null;
    }

    const decryptedInfo = await decryptData(rawData);
    const info = JSON.parse(decryptedInfo);
    return info;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error.message);
  }
};
