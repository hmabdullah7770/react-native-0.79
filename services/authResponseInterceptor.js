import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { getStore } from '../utils/store';
import { logoutrequest } from '../Redux/action/auth';
import { Baseurl } from '../utils/apiconfig';

// Helper functions
const getRefreshToken = async () => {
  const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });
  console.log("refresh token is", credentials);
  return credentials ? credentials.password : null;
};

const setTokens = async (accessToken, refreshToken) => {
  await Keychain.resetGenericPassword({ service: 'accessToken' });
  await Keychain.resetGenericPassword({ service: 'refreshToken' });
  await Keychain.setGenericPassword('accessToken', accessToken, { service: 'accessToken' });
  await Keychain.setGenericPassword('refreshToken', refreshToken, { service: 'refreshToken' });
};

const removeTokens = async () => {
  await Keychain.resetGenericPassword({ service: 'accessToken' });
  await Keychain.resetGenericPassword({ service: 'refreshToken' });
};

/**
 * Handles API errors, specifically for refreshing expired JWT tokens.
 * @param {object} error - The Axios error object.
 * @param {object} originalRequest - The original request config that failed.
 * @returns {Promise<any>} - A promise that resolves with the retried request or rejects.
 */
export const handleAuthResponseError = async (error, originalRequest) => {
  console.log("Interceptor: Handling auth response error");

  originalRequest._retry = true; // Mark the request as retried to prevent infinite loops

  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      console.log('No refresh token available, logging out.');
      // If no refresh token, dispatch logout and reject
      await getStore().dispatch(logoutrequest());
      await removeTokens();
      throw new Error('No refresh token');
    }

    // Call refresh endpoint
    const refreshResponse = await axios.post(
      `${Baseurl()}/users/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    // If the refresh token endpoint itself returns an error, logout.
    if (refreshResponse.data.error) {
      console.error("Refresh token API returned an error:", refreshResponse.data.error);
      await getStore().dispatch(logoutrequest());
      await removeTokens();
      return Promise.reject(new Error(refreshResponse.data.error));
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

    // Store the new tokens
    await setTokens(newAccessToken, newRefreshToken);

    // // Update the header of the original request and retry it
    // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    
    // We need the original api instance to retry the request
    // This function will be called from the interceptor which has access to `api`
    // We pass `api` instance to this function when we call it.
    // For now, let's assume `axios` can be used. For a cleaner approach, you might pass the `api` instance.
    return axios(originalRequest);

  } catch (refreshError) {
    console.error("Failed to refresh token:", refreshError);
    // On any failure during the refresh process, logout the user.
    await getStore().dispatch(logoutrequest());
    await removeTokens();
    return Promise.reject(refreshError);
  }
};
