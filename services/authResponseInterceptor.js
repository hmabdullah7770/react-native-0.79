

import axios from 'axios';
import { Producturl,Baseurl } from '../utils/apiconfig';
import * as Keychain from 'react-native-keychain';
import { logoutrequest } from '../Redux/action/auth';
// import { useDispatch } from 'react-redux';
import { getStore } from '../utils/store';

const api = axios.create({
  baseURL: Baseurl(),
  headers: {
    'Content-Type': 'application/json',
  },

 
 
});

// const dispatch = useDispatch();
// Helper functions
const getAccessToken = async () => {
   console.log("base url is", Baseurl())
  const credentials = await Keychain.getGenericPassword({ service: 'accessToken'});
  
    return credentials ? credentials.password : null;

};

const getRefreshToken = async () => {
  const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });
  console.log("refresh token is", credentials)
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


// Handle 401 + "jwt expired"
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const response = error.response;

      console.log("in 2 interceptor")
    if (
      
      response.status === 401 && 
      response.data.error === 'jwt expired' 
    
      // Check for specific error message
  
      && !originalRequest._retry // Prevent infinite loop
   
     
      
    ) {
      
      originalRequest._retry = true; // Mark the request as retried
      try {
        // Get refresh token
        const refreshToken = await getRefreshToken();
        
          if (!refreshToken) {
          console.log('No refresh token available');
          throw new Error('No refresh token');
        }
        
        
        // Call refresh endpoint with refresh token in Authorization header
        const refreshResponse = await axios.post(
          `${Baseurl()}/users/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );


            // config.headers.Authorization = `Bearer ${getAccessToken()}`;

        // If refresh API returns an error, logout the user
if (refreshResponse.data.error) {
  await getStore().dispatch(logoutrequest());
  await removeTokens();
  console.error("Refresh token error:", refreshResponse.data.error);
  return Promise.reject(new Error(refreshResponse.data.error));
}

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

        // Remove old tokens and set new ones
        await setTokens(newAccessToken, newRefreshToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } 
      
      
      catch (refreshError) {
        // On refresh failure, remove tokens
      
        // dispatch(logoutrequest());
         await getStore().dispatch(logoutrequest());
        await removeTokens();
        // console.error("Refresh token error:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;










