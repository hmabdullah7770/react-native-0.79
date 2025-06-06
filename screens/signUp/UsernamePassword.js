import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Textfield from '../../components/TextField'
import Button from '../../components/Button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { verifyemailrequest,matchusenamerequest,matchotpreques,signuprequest} from '../../Redux/action/auth'

import OTPInputView from '@twotalltotems/react-native-otp-input'

import { useFormik } from 'formik';
import * as yup from 'yup';
import NextButton from './components/NextButton';



const schema = yup.object().shape({
email: yup.string().required('Email is required')
    .email('Invalid email format')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Invalid email format' ),

username: yup.string().required('Name is required'),
  password: yup
    .string()
    .required('Password is required')
  .min(8, 'Password must be at least 8 characters long')
    .matches(
   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});
const UsernamePassword = ({ navigation }) => {

  const dispatch = useDispatch();

   const [showPassword, setShowPassword] = useState(true);

    const formik = useFormik({
       initialValues: { email: '' ,username: '', password: '' },
       validationSchema: schema,
       onSubmit: async (values, { setSubmitting }) => {
         const { username, password } = values;
   
        dispatch(loginrequest(username, password));
   
        //  dispatch(userstaterequest(username));
        //  dispatch(locationlistrequest());
        //  dispatch(partnerlistrequest());
         setSubmitting(false);
       },
     }); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SigninScreen</Text>
    
    <Textfield
       placeholder={'Enter your email '}
          iconName={'person'}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          value={formik.values.email}
    />

{formik.errors.email && formik.touched.email && (
          <Text style={styles.errorText}>{formik.errors.email}</Text>
        )}


    <Textfield
       placeholder={'Enter your username'}
          iconName={'person'}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
          value={formik.values.username}
    />

{formik.errors.username && formik.touched.username && (
          <Text style={styles.errorText}>{formik.errors.username}</Text>
        )}
  <Textfield
        placeholder={'Enter your password'}
        iconName={'lock'}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        value={formik.values.password}
        isPassword={true}
        secureTextEntry={showPassword}
        onEyePress={() => setShowPassword(!showPassword)}
    />

{formik.errors.password && formik.touched.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}
    {/* <Button
          onPress={formik.handleSubmit}
          isSubmitting={formik.isSubmitting}
          iconName="sign-in-alt"
          value="Login"
        /> */}


<NextButton
onPress={() => navigation.navigate('SignupScreens',{screen:'EmailVerification'})}

/>
 
    </View>
  )
}

export default UsernamePassword

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
 
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    width: 90,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },

  eye: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    marginRight: 4,
  },

  errorText: {
    color: 'red',
    textAlign: 'left',
    marginTop: -8,
    marginBottom: 8,
    marginLeft: '5%',
  },

})