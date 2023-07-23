//axios for api calling
import axios from 'axios';

// Utility
import {encryptData} from './EncryptionUtility';

// User Preference
import {KEYS, getData} from './UserPreference';

// Base URL
// export const BASE_URL = 'https://templatelaboratory.com/api/'; /* Local URL */
// export const BASE_URL = 'https://www.agzotic.com/api/'; //     /* Live URL */
export const BASE_URL = 'https://idsfood.shoponcell.com/api/'; //     /* Live URL */

const AXIOS = axios.create({
  baseURL: BASE_URL,
  headers: {
    // add common headers here
    'content-type': 'multipart/form-data',
  },
});

// Methods
export const makeNetworkRequest = async (
  url,
  params = null,
  sendAuthorizationToken = false,
  isContentTypeJSON = false,
) => {
  try {
    // request info
    let info = {};
    info.url = url;

    console.log('api params=', params);

    if (params) {
      // request method
      info.method = 'POST';

      if (sendAuthorizationToken) {
        // fetching userInfo
        const userInfo = await getData(KEYS.USER_INFO);

        if (!userInfo) {
          return null;
        }

        const {authToken} = userInfo;

        info.headers = {
          Authorization: 'Bearer ' + authToken,
        };
      }

      // request body

      if (isContentTypeJSON) {
        // request headers
        info.headers = {
          ...info.headers,
          'Content-Type': 'application/json',
        };

        const data = JSON.stringify(params);
        const payload = await encryptData(data);
        const requestBody = {payload};
        info.data = JSON.stringify(requestBody);
      } else {
        // preparing multipart/form-data
        const formData = new FormData();
        for (const key in params) {
          if (key === 'images' && Array.isArray(params[key])) {
            for (const Mem of Object.keys(params[key])) {
              formData.append(key + '[]', params[key][Mem]);
            }
          } else {
            formData.append(key, params[key]);
          }
        }
        info.data = formData;
      }
    } else {
      if (sendAuthorizationToken) {
        // fetching userInfo
        const userInfo = await getData(KEYS.USER_INFO);
        if (!userInfo) {
          // console.log('Unable to fetch user info');
          return null;
        }

        const {authToken} = userInfo;

        info.headers = {
          Authorization: 'Bearer ' + authToken,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        };
      } else {
        // headers to prevent cache in GET request
        info.headers = {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        };
      }
    }

    console.log('api info=', info);
    console.log('Request URLll:', BASE_URL + url);

    const response = await AXIOS.request(info);
    console.log('Request Result:', response);
    // console.log('Request Info:', info);

    const result = response.data;

    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
