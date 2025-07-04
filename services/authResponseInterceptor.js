// // utils/interceptorSagaLogic.js
// import axios from 'axios';
// import * as Keychain from 'react-native-keychain';
// import { Baseurl } from '../utils/apiconfig';
// import { logoutrequest } from '../Redux/action/auth';
// import { getStore } from '../utils/store';

// // Helper functions for token management
// const getRefreshToken = async () => {
//   try {
//     const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });
//     console.log("refresh token is", credentials);
//     return credentials ? credentials.password : null;
//   } catch (error) {
//     console.log('Keychain error getting refresh token:', error);
//     return null;
//   }
// };

// const setTokens = async (accessToken, refreshToken) => {
//   await Keychain.setGenericPassword('accessToken', accessToken, { service: 'accessToken' });
//   await Keychain.setGenericPassword('refreshToken', refreshToken, { service: 'refreshToken' });
// };

// const removeTokens = async () => {
//   await Keychain.resetGenericPassword({ service: 'accessToken' });
//   await Keychain.resetGenericPassword({ service: 'refreshToken' });
// };

// // Second interceptor logic that can be called directly in saga
// export function* runSecondInterceptor(originalRequest) {
//   try {
//     console.log("Running second interceptor logic in saga");
    
//     // Get refresh token
//     const refreshToken = yield call(getRefreshToken);
    
//     if (!refreshToken) {
//       console.log('No refresh token available');
//       throw new Error('No refresh token');
//     }
    
//     // Call refresh endpoint with refresh token in Authorization header
//     const refreshResponse = yield call(axios.post, 
//       `${Baseurl()}/users/refresh-token`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${refreshToken}`,
//         },
//       }
//     );

//     // If refresh API returns an error, logout the user
//     if (refreshResponse.data.error) {
//       yield put(logoutrequest());
//       yield call(removeTokens);
//       console.log("Refresh token error:", refreshResponse.data?.error);
//       throw new Error(refreshResponse.data.error);
//     }

//     const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data?.data;
    
//     yield call(removeTokens);

//     // Remove old tokens and set new ones
//     yield call(setTokens, newAccessToken, newRefreshToken);

//     // If you need to retry the original request, you can do it here
//     // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//     // const retryResponse = yield call(api, originalRequest);
//     // return retryResponse;

//     return { success: true, newAccessToken, newRefreshToken };

//   } catch (refreshError) {
//     // On refresh failure, remove tokens and logout
//     yield put(logoutrequest());
//     yield call(removeTokens);
//     throw refreshError;
//   }
// }




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

 

  // validateStatus: function (status) {
  // //   // Resolve only if the status code is less than 500
  // //   // This means 2xx, 3xx, and 4xx responses will not throw an error
  // //   // in the Axios call, and will be available in the .then() or try block.
  //   return status < 500; 
  // //   // Alternatively, if you only want to specifically handle 2xx, 401, and 404:
  // //   // return (status >= 200 && status < 300) || status === 401 || status === 404;
  // },

  validateStatus: function (status) {
  //   // Resolve only if the status code is less than 500
  //   // This means 2xx, 3xx, and 4xx responses will not throw an error
  //   // in the Axios call, and will be available in the .then() or try block.
    // return status < 500;

      return (status >= 200 && status < 500) && status !== 401  
  //   // Alternatively, if you only want to specifically handle 2xx, 401, and 404:
  //   // return (status >= 200 && status < 300) || status === 401 || status === 404;
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

// Attach access token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    console.log("in 1 interceptor")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 + "jwt expired"
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const response = error.response;

      console.log("in 2 interceptor")
    
      if (
      
      response?.status === 401 && 
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
             validateStatus: function (status) {
              return status < 500; // Accept all responses under 500
            }
          }
        );


        // If refresh API returns an error, logout the user
if (refreshResponse.data.error ==='jwt expired' && refreshResponse.status === 401) {
  // await getStore().dispatch(logoutrequest());
  await removeTokens();
  console.log("Refresh token error:", refreshResponse.data?.error);
  return Promise.reject(new Error(refreshResponse.data.error));
}

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data?.data;

        // Remove old tokens and set new ones
        await setTokens(newAccessToken, newRefreshToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } 
      
      
      catch (refreshError) {
        // On refresh failure, remove tokens
      
        // dispatch(logoutrequest());
        //  await getStore().dispatch(logoutrequest());
        await removeTokens();
        // console.error("Refresh token error:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;










// import axios from 'axios';
// import { Producturl, Baseurl } from '../utils/apiconfig';
// import * as Keychain from 'react-native-keychain';
// // import { applyAuthResponseInterceptor } from './authResponseInterceptor';

// const api = axios.create({
//   baseURL: Baseurl(),
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Helper function to get access token
// const getAccessToken = async () => {
//   console.log("base url is", Baseurl());
//   const credentials = await Keychain.getGenericPassword({ service: 'accessToken' });
//   return credentials ? credentials.password : null;
// };

// // Attach access token to every request
// api.interceptors.request.use(
//   async (config) => {
//     const token = await getAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // // Apply the auth response interceptor
// // applyAuthResponseInterceptor(api);

// export default api;

