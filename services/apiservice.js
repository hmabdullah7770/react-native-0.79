// real logic

import axios from 'axios';
import {Producturl, Baseurl} from '../utils/apiconfig';
import * as Keychain from 'react-native-keychain';
import {logoutrequest} from '../Redux/action/auth';
// import { useDispatch } from 'react-redux';
import {getStore} from '../utils/store';

const api = axios.create({
  baseURL: Baseurl(),
  headers: {
    'Content-Type': 'application/json',
  },

  validateStatus: function (status) {
    // return status < 500;

    return status >= 200 && status < 500 && status !== 401;
  },
});

// const dispatch = useDispatch();
// Helper functions
const getAccessToken = async () => {
  console.log('base url is', Baseurl());
  const credentials = await Keychain.getGenericPassword({
    service: 'accessToken',
  });

  return credentials ? credentials.password : null;
};

const getRefreshToken = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: 'refreshToken',
  });
  // console.log("refresh token is", credentials )
  console.log('credential password', credentials.password);
  return credentials.password;
};

const setTokens = async (accessToken, refreshToken) => {
  await Keychain.resetGenericPassword({service: 'accessToken'});
  await Keychain.resetGenericPassword({service: 'refreshToken'});
  await Keychain.setGenericPassword('accessToken', accessToken, {
    service: 'accessToken',
  });
  await Keychain.setGenericPassword('refreshToken', refreshToken, {
    service: 'refreshToken',
  });
};

const removeTokens = async () => {
  await Keychain.resetGenericPassword({service: 'accessToken'});
  await Keychain.resetGenericPassword({service: 'refreshToken'});
};

// Attach access token to every request
api.interceptors.request.use(
  async config => {
    const token = await getAccessToken();

    console.log('in 1 interceptor');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // delete config._retry;
    return config;
  },
  error => Promise.reject(error),
);

// Handle 401 + "jwt expired"
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const response = error.response;

    console.log('in 2 interceptor');

    if (
      response?.status === 401 &&
      response.data.error === 'jwt expired' &&
      // Check for specific error message

      !originalRequest._retry // Prevent infinite loop
    ) {
      originalRequest._retry = true; // Mark the request as retried
      try {
        // Get refresh token
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          console.log('No refresh token available');
          throw new Error('No refresh token');
        }

        //debigger1
        //  debugger

        // Call refresh endpoint with refresh token in Authorization header

        const refreshResponse = await axios.create().post(
          `${Baseurl()}/users/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },

            //validateStatus: () => true

            validateStatus: function (status) {
              return status < 500; // Accept all responses under 500
              // return (status >= 200 && status < 500) && status !== 401
            },
          },
        );

        await refreshResponse;
        //debugger2
        debugger;

        // If refresh API returns an error, logout the user
        if (
          refreshResponse.data.error === 'jwt expired' &&
          refreshResponse.status === 401
        ) {
          // await getStore().dispatch(logoutrequest());
          await removeTokens();
          console.log(
            'Refresh token error   ------>:',
            refreshResponse.data?.error,
          );
          // return Promise.reject(new Error(refreshResponse.data.error));
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        //debugger2
        debugger;

        //  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse?.data?.data //add .data more

        // Safely grab the tokens (they'll be undefined if any part is missing)
        const newAccessToken = refreshResponse?.data?.data?.accessToken;
        const newRefreshToken = refreshResponse?.data?.data?.refreshToken;

        await newAccessToken;
        await newRefreshToken;

        console.log('new accesstoken is:::::', newAccessToken);
        console.log('new refreshtoken is::::::', newRefreshToken);

        if (refreshResponse?.statusCode) {
          console.log(
            'refresh responve with out data',
            refreshResponse?.statusCode,
          );
        }

        if (refreshResponse?.data?.statusCode) {
          console.log(
            'refresh responve  data',
            refreshResponse?.data?.statusCode,
          );
        }

        if (newAccessToken && newRefreshToken) {
          await setTokens(newAccessToken, newRefreshToken);

          // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // On refresh failure, remove tokens

        // dispatch(logoutrequest());
        //  await getStore().dispatch(logoutrequest());
        await removeTokens();
        // console.error("Refresh token error:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
