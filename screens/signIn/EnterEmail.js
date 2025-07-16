import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Textfield from '../../components/TextField'
import { forgetpasswordrequest} from '../../Redux/action/auth';

import { useFormik } from 'formik';
import * as yup from 'yup';



const schema = yup.object().shape({

    email: yup.string().required('Email is required')
     .email('Invalid email format')
     .matches(
       /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
       'Invalid email format' ),
 


});

const EnterEmail = () => {



const formik = useFormik({
       initialValues: { email: '' },
       validationSchema: schema,
       onSubmit: async (values, { setSubmitting }) => {
        
   
         try {
        
            const { email } = values;

       
        
          // If it's an email, pass it as email parameter, otherwise as username
          await dispatch(forgetpasswordrequest(
           
           
            email
          ));
           
          navigation.navigate('SigninScreens', { screen: 'ForgetEmailVerify', params: { email } });


          // console.log("Submitting form with:", { username, password });
          // await dispatch(loginrequest(username, password));
        } catch (error) {
          console.error("Form submission error:", error);
        } finally {
          setSubmitting(false);
        }
    
       },
     }); 

  return (
    <View>
      <Text>EnterEmail</Text>


       <Textfield
       placeholder={'Enter your email '}
          iconName={'person'}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          value={formik.values.email}
    />

{formik.errors.email && formik.touched.email &&(<Text style={styles.errorText}>
    {formik.errors.email}
  </Text>)}


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

export default EnterEmail

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