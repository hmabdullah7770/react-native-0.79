import React, { useEffect } from 'react';
// import LoginScreen from '../screens/LoginScreen';
// import ChangePinScreen from '../screens/ChangePinScreen';
// import AzureloginScreen from '../screens/AzureloginScreen'
// // import { useSelector, useDispatch } from 'react-redux';
// import { useContext } from 'react';
// import { SnackbarContext } from '../context/Snackbar';
// import Loader from '../components/Loader';
// import { clearerror, clearmessege } from '../Redux/action/auth';
import WelcomeScreen from '../screens/WelcomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreens from '../screens/signUp/SignupScreens';
import SigninScreen from '../screens/signIn/SigninScreen';
import Loader from '../components/Loader';
import { useContext } from 'react';
import { SnackbarContext } from '../context/Snackbar';
import { useSelector } from 'react-redux';
import { clearerror, clearmessege } from '../Redux/action/auth';
import { useDispatch } from 'react-redux';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types'

const AuthScreens = () => {
  const Auth = createStackNavigator();

  // const { handleSnackbar } = useContext(SnackbarContext);

  const  {loading, error, messege, clearerror, clearmessege}  = useSelector(state => state.auth);

  const dispatch = useDispatch();
  

  const { handleSnackbar } = useContext(SnackbarContext);
  
  useEffect(() => {
      if (error) {
        handleSnackbar(error);
       dispatch (clearerror());
      } else if (messege) {
        handleSnackbar({ messege });
        dispatch(clearmessege());
      }
    }, [error, messege]);


  return (
    <>
       {loading && <Loader />} 

      <Auth.Navigator>

        {/* <Auth.Screen
          name="AzureloginScreen"
          component={AzureloginScreen}
          options={{ headerShown: false }}
        /> */}


<Auth.Screen
          name="SigninScreen"
          component={SigninScreen}
          options={{ headerShown: false }}  // Add this to hide the header
          // options={{ headerShown: false }}
        />


        <Auth.Screen
          name="SignupScreens"
          component={SignupScreens}
          options={{ headerShown: false }}  // Add this to hide the header
          // options={{ headerShown: false }}
        />
        {/* <Auth.Screen
          name="Change"
          component={ChangePinScreen}
          options={{ headerShown: false }}
        /> */}
      </Auth.Navigator>
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

export default AuthScreens;
