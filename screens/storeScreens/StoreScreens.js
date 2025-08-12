import React, { useEffect } from 'react';
// import LoginScreen from '../screens/LoginScreen';
// import ChangePinScreen from '../screens/ChangePinScreen';
// import AzureloginScreen from '../screens/AzureloginScreen'
// // import { useSelector, useDispatch } from 'react-redux';
// import { useContext } from 'react';
// import { SnackbarContext } from '../context/Snackbar';
// import Loader from '../components/Loader';
// import { clearerror, clearmessege } from '../Redux/action/auth';
import Store_HomeScreen from './Store_HomeScreen'
import { createStackNavigator } from '@react-navigation/stack';
import Store_ProductScreen from './Store_ProductScreen';
import Store_CartScreen from './Store_CartScreen';
import Store_CheckoutScreen  from  './Store_CheckoutScreen';
// import ProfileImage2 from './ProfileImage2';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types'

const StoreScreens  = () => {
  const Store = createStackNavigator();

  // const { handleSnackbar } = useContext(SnackbarContext);

  // // const { error, messege, loading } = useSelector(state => state.Auth);

  // // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (error) {
  //     handleSnackbar({ error });
  //     clearerror();
  //   } else if (messege) {
  //     handleSnackbar({ messege });
  //     clearmessege();
  //   }
  // }, [error, messege]);

  return (
    <>
      {/* {loading && <Loader />} */}

      <Store.Navigator>

        {/* <Auth.Screen
          name="AzureloginScreen"
          component={AzureloginScreen}
          options={{ headerShown: false }}
        /> */}

        <Store.Screen
          name="Store_HomeScreen"
          component={EmailPassword}
          options={{ headerShown: false }}  // Add this to hide the header
          // options={{ headerShown: false }}
        />


<Store.Screen
          name=" Store_ProductScreen"
          component={EnterEmail}
          options={{ headerShown: false }}  // Add this to hide the header
          // options={{ headerShown: false }}
        />


<Store.Screen
          name="Store_CartScreen"
          component={ForgetEmailVerify}
          options={{ headerShown: false }}  // Add this to hide the header
          // options={{ headerShown: false }}
        />



<Store.Screen
          name="Store_CheckoutScreen"
          component={ResetPassword}
          options={{ headerShown: false }}  // Add this to hide the header
          // options={{ headerShown: false }}
        />

        {/* <Auth.Screen
          name="Change"
          component={ChangePinScreen}
          options={{ headerShown: false }}
        /> */}
      </Store.Navigator>
    </>
  );
};

// AuthScreen.propTypes = {
//   Auth: PropTypes.object.isRequired,
//   clearerror: PropTypes.func.isRequired,
//   clearmessege: PropTypes.func.isRequired,
// }

// const mapStateToProps = (state) => ({
//   Auth: state.Auth
// })

// export default connect(mapStateToProps, { clearmessege, clearerror })(AuthScreen)

export default StoreScreens;
