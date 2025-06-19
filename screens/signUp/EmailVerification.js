import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import * as Yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import { verifyemailrequest, signuprequest } from '../../Redux/action/auth';
import NextButton from './components/NextButton';
// Get screen dimensions for responsive design
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate responsive sizes based on screen dimensions
const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 375; // 375 is baseline width (iPhone X)
const responsiveSize = (size) => Math.round(size * scale);

// Validation schema using Yup
const otpSchema = Yup.string()
  .required('OTP is required')
  .matches(/^[0-9]{6}$/, 'OTP must be exactly 6 digits');

const EmailVerification = ({ route }) => {
  const [otp, setOtp] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [screenDimensions, setScreenDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT
  });
  
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Extract email from route params if available
  const { email } = route?.params || { email: '' };

  // Handle screen rotation and dimension changes
  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setScreenDimensions({
        width,
        height,
        isLandscape: width > height
      });
    };
    
    // Listen for dimension changes (rotation)
    const dimensionsSubscription = Dimensions.addEventListener('change', updateDimensions);
    
    return () => {
      // Clean up subscription
      dimensionsSubscription.remove();
    };
  }, []);

  // Validate OTP whenever it changes
  // useEffect(() => {
  //   validateOtp(otp);
  // }, [otp]);

  // Function to validate OTP using Yup schema
  // const validateOtp = async (code) => {
  //   try {
  //     await otpSchema.validate(code);
  //     setIsValid(true);
  //     setError('');
  //   } catch (err) {
  //     setIsValid(false);
  //     setError(err.message);
  //   }
  // };

  // Handle OTP verification and navigation
  const handleVerify = async () => {
   
   navigation.navigate('SignupScreens',{screen:'ProfileImage2'});
    // if (!isValid) return;
    
    // setLoading(true);
    
    // try {
    //   // Replace this with your actual API verification logic
    //   // const response = await dispatch(matchotprequest({ 
    //   //   email: email, 
    //   //   otp: otp 
    //   // }));
      
    //   // Check if verification was successful
    //   if (response && response.success) {
    //     navigation.navigate('ProfileImage'); // Navigate to profile image screen
    //   } else {
    //     // Handle verification failure
    //     setError('Invalid OTP. Please try again.');
    //   }
    // } catch (err) {
    //   setError('Verification failed. Please try again.');
    //   Alert.alert('Verification Failed', 'Please check your OTP and try again.');
    // } finally {
    //   setLoading(false);
    // }
  };

  // Calculate dynamic styles based on screen orientation
  const dynamicStyles = {
    container: {
      padding: screenDimensions.isLandscape ? responsiveSize(20) : responsiveSize(30),
    },
    otpInput: {
      width: screenDimensions.isLandscape ? '85%' : '90%',
      height: screenDimensions.isLandscape ? responsiveSize(50) : responsiveSize(60),
    },
    buttonContainer: {
      width: screenDimensions.isLandscape ? '70%' : '80%',
      marginTop: screenDimensions.isLandscape ? responsiveSize(20) : responsiveSize(40),
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={styles.title}>Email Verification</Text>
      
      {/* <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {email || 'your email'}
      </Text> */}

      <OTPInputView
        style={[styles.otpInput, dynamicStyles.otpInput]}
        pinCount={6}
        autoFocusOnLoad
        codeInputFieldStyle={styles.codeInputField}
        codeInputHighlightStyle={styles.codeInputHighlight}
        // onCodeFilled={(code) => {
        //   setOtp(code);
        //   validateOtp(code);
          
        //   // Auto-navigate on valid input if needed
        //   // if (code.length === 6 && !error) {
        //   //   handleVerify();
        //   // }
        // }}
        // onCodeChanged={(code) => {
        //   setOtp(code);
        // }}
      />
      
      {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}

      <View style={[styles.buttonContainer, dynamicStyles.buttonContainer]}>
        <TouchableOpacity 
          disabled={!isValid || loading} 
          onPress={handleVerify}
          style={[
            styles.buttonWrapper,
            (!isValid || loading) && styles.buttonDisabled
          ]}
        >
          <LinearGradient 
            colors={!isValid || loading ? ['#cccccc', '#999999'] : ['#ff0206', '#ff0206']} 
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="#ff0206" size="small" />
            ) : (
              <Text style={styles.buttonText}>Verify & Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive code? </Text>
        <TouchableOpacity><Text  style={styles.resendLink}>Resend</Text></TouchableOpacity>
      </View>
       {/* <NextButton
       onPress={() => navigation.navigate('ProfileImage2')}
      />   */}
    </View>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: responsiveSize(24),
    fontWeight: 'bold',
    marginBottom: responsiveSize(50),
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: responsiveSize(14),
    color: '#666666',
    marginBottom: responsiveSize(30),
    textAlign: 'center',
    paddingHorizontal: responsiveSize(20),
  },
  otpInput: {
    alignSelf: 'center',
  },
  codeInputField: {
    width: responsiveSize(40),
    height: responsiveSize(50),
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    color: '#000000',
    fontSize: responsiveSize(20),
  },
  codeInputHighlight: {
    borderColor: '#ff0206',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: responsiveSize(12),
    marginTop: responsiveSize(8),
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
  },
  buttonWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: responsiveSize(20),
  },
  button: {
    paddingVertical: responsiveSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: responsiveSize(16),
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: responsiveSize(20),
  },
  resendText: {
    color: '#666666',
    fontSize: responsiveSize(14),
  },
  resendLink: {
    color: '#ff0206',
    fontSize: responsiveSize(14),
    fontWeight: '600',
  }
});