import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useContext } from 'react';
import { SnackbarContext } from '../context/Snackbar';
import TestingScreen from '../screens/TestingScreen'; // Assuming this is the initial screen
import Tabnavigation from '../screens/tabNavigation/Tabnavigation'
import { clearerror, clearmessege } from '../Redux/action/auth';
import { useDispatch } from 'react-redux';
// import api from '../services/apiservice'; //
const AppScreens = () => {
  const App = createStackNavigator();

  // Access the loading state and the user object from Redux
  const { loading, user,error, messege,usernameerror,emailerror} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const { handleSnackbar } = useContext(SnackbarContext);


   useEffect(() => {
    if (error) {
      handleSnackbar({error});
     dispatch( clearerror());
    } else if (messege) {
      handleSnackbar({ messege });
     dispatch(clearmessege());
    }
   
  }, [error, messege]);


  console.log('error in AppScreens', error)
console.log("user tokenin: ",user?.data?.data?.accessToken);

//verfiy the user have store or not
const stores = user?.data?.data?.user?.stores || [];
const storeId = stores.length > 0 ? stores[0].storeId : null;



  // State to track if tokens have been stored to prevent repeated storage attempts
  const [tokensStored, setTokensStored] = useState(false);

  // useEffect to handle token storage when user data is available
  useEffect(() => {
    const storeTokens = async () => {
      // Check if user data and tokens exist, and if tokens haven't been stored yet
      if (user?.data?.data?.accessToken && user?.data?.data?.refreshToken && !tokensStored) {
        try {

           // Clear all previous common headers
    // api.defaults.headers.common = {};

    // console.log("header are:" ,api.defaults.headers.common)
          // Store the access token using a generic password
          // await Keychain.resetGenericPassword({service:'accessToken'});
          // await Keychain.resetGenericPassword({service:'refreshToken'});

          console.log("in app stack in use effect")
          await Keychain.setGenericPassword('accessToken', user?.data?.data?.accessToken,{service:'accessToken'});
          // Store the refresh token using a generic password
          await Keychain.setGenericPassword('refreshToken', user?.data?.data?.refreshToken,{service:'refreshToken'});
          
          console.log('Tokens stored successfully!');
        
        //verfiy the user have store or not
        
        if (storeId) {
          await Keychain.setGenericPassword('storeId', storeId, { service: 'storeId' });
          console.log('StoreId stored successfully!');
        } else {
          console.log('No storeId to store.');
        }
        
          // Mark tokens as stored to prevent re-storing on subsequent state changes
            // api.defaults.headers.common['Authorization'] = `Bearer ${user?.data?.data?.accessToken}`;
          setTokensStored(true);
        } catch (error) {
          console.error('Error storing tokens:', error);
          // Implement appropriate error handling here, e.g., show a user message
        }
      }
    };

    // Call the storeTokens function
    storeTokens();

    // Optional: Add a cleanup function to clear tokens on component unmount or logout
    // return () => {
    //   // Logic to clear tokens, e.g., call a clearTokens function
    // };

  }, [user, tokensStored]); // Dependencies: Re-run effect if user or tokensStored state changes

  return (
    <>
      {/* Show loader if loading state is true */}
      {loading && <Loader />}
      {/* Set up the navigation stack */}
      <App.Navigator>
        {/* Define your screens */}
        <App.Screen name="Tabnavigation" component={Tabnavigation} headerShown={false} />
        <App.Screen name="TestingScreen" component={TestingScreen} />
        
        
        {/* Add other screens here, e.g.: */}
        {/* <App.Screen name="Home" component={HomeScreen} /> */}
        {/* <App.Screen name="Dispatch" component={DispatchScreen} /> */}
        {/* ... other screens */}
      </App.Navigator>
    </>
  );
};

export default AppScreens;



// import React, { useEffect, useState } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import Loader from '../components/Loader';
// import { useSelector } from 'react-redux';
// import * as Keychain from 'react-native-keychain';
// import TestingScreen from '../screens/TestingScreen'; // Assuming this is the initial screen

// const AppScreens = () => {
//   const App = createStackNavigator();

//   const { loading, user } = useSelector(state => state.auth); // Access the whole user object

//   // Use state to track if tokens have been stored to prevent repeated calls
//   const [tokensStored, setTokensStored] = useState(false);

//   useEffect(() => {
//     const storeTokens = async () => {
//       if (user?.data?.accessToken && user?.data?.refreshToken && !tokensStored) {
//         try {
//           await Keychain.setGenericPassword('accessToken', user.data.accessToken);
//           await Keychain.setGenericPassword('refreshToken', user.data.refreshToken);
//           console.log('Tokens stored successfully!');
//           setTokensStored(true); // Mark tokens as stored
//         } catch (error) {
//           console.error('Error storing tokens:', error);
//           // Handle the error appropriately
//         }
//       }
//     };

//     storeTokens();

//     // You might also want a cleanup effect to clear tokens on logout
//     // return () => {
//     //   // Logic to clear tokens on component unmount or logout
//     // };

//   }, [user, tokensStored]); // Depend on user and tokensStored state

//   return (
//     <>
//       {loading && <Loader />}
//       <App.Navigator>
//         <App.Screen name="TestingScreen" component={TestingScreen} />
//         {/* Add other screens here */}
//       </App.Navigator>
//     </>
//   );
// };

// export default AppScreens;