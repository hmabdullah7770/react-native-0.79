import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { resetpasswordrequest } from '../../Redux/action/auth'
import Textfield from '../../components/TextField'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch,useSelector } from 'react-redux' 
// import { Button } from 'react-native-paper'
import { useContext } from 'react';
import { SnackbarContext } from '../../context/Snackbar';


const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});



const ResetPassword = ({navigation,route}) => {

  const dispatch = useDispatch();
  
  // const {error } = useSelector(state => state.auth);

  const { handleSnackbar } = useContext(SnackbarContext);
  const { email, otp } = route?.params || {};
  const [showPassword, setShowPassword] = React.useState(false);


  const formik = useFormik({
         initialValues: { password: '', confirmPassword: '' },
         validationSchema: schema,
         onSubmit: async (values, { setSubmitting }) => {
        
          try {
    const { password } = values;
    
    if(!email || !otp) {
      handleSnackbar({ error: ['Missing Data', 'Email or OTP is missing'] });
      navigation.navigate('SigninScreens', { screen: 'EmailPassword' });
      return;
    }

    await dispatch(resetpasswordrequest(email, otp, password));
    
  } catch (error) {
    handleSnackbar({ error: ['Error', error.message] });
  } finally {
    setSubmitting(false);
  }
     
        
         },
       }); 

  return (
    <View>
      <Text>ResetPassword</Text>

        <Textfield
        placeholder={'Enter your New password'}
        iconName={'lock'}
        onChangeText={formik.handleChange('password')}
        // onBlur={formik.handleBlur('password')}
        value={formik.values.password}
        isPassword={true}
        secureTextEntry={showPassword}
        onEyePress={() => setShowPassword(!showPassword)}
    />


{formik.errors.password && formik.touched.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}

{/* confirm password */}


   <Textfield
        placeholder={'Confirm password'}
        iconName={'lock'}
        onChangeText={formik.handleChange('confirmPassword')}
        // onBlur={formik.handleBlur('password')}
        value={formik.values.confirmPassword}
        isPassword={true}
        secureTextEntry={showPassword}
        onEyePress={() => setShowPassword(!showPassword)}
    />


{formik.errors.confirmPassword && formik.touched.confirmPassword && (
          <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
        )}



<View style={styles.loginView}>
 <TouchableOpacity
          onPress={formik.handleSubmit}
          isSubmitting={formik.isSubmitting}
          style={styles.button}>
          <Text style={styles.loginButton}>Submit</Text>
      </TouchableOpacity>
      </View>



    </View>
  )
}

export default ResetPassword

const styles = StyleSheet.create({

 loginView:{
   display:'flex',
   marginTop:10,
   alignItems:'center',
   justifyContent:'center',
   alignContent:'center',
   width:'100%',
   marginBottom: '20',
  },

    button: {
    backgroundColor: '#1FFFA5', // iOS blue colorrgba(4, 248, 150, 0.77)  #f9213f
    padding: 11,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
   
  },
  

   loginButton: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
    // fontWeight: '600'
    // backgroundColor: 
  },
  

})