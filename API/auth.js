// import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/apiservice';





// const accessToken = await Keychain.getGenericPassword({ service: 'accessToken' }); // Assuming 'accessToken' is the service name you used for the access token
// const refreshToken = await Keychain.getGenericPassword({ service: 'refreshToken' }); 









export const verifyemail = (email) =>
  api.post('/users/verify-email', {
   email,
  });

// export const matchusername = (username) =>
//   api.get('/users/match-username', {
   
//      params: {
//       username,
//     },
//   });



  export const  matchusername  = (username) =>  
    api.get(`/users/match-username/${encodeURIComponent(username)}`
);

export const matchotp = (email, otp) =>
  api.post('/users/match-otp', {
    email,
    otp,
  });



export const signup =(username, password, email, otp, avatar, storelink, whatsapp, facebook, instagram) =>{
  return api.post('mobile/SignUp', {
    username,
    password,
    email,
    otp,
    avatar,
    storelink,
    whatsapp,
    facebook,
    instagram
  });
}


export const login = (username, password,email) =>{
  console.log('Making login request to:', '/users/login');
  return api.post('/users/login', {
     email,
    username,
    password,
    // azureUserName: 'ayesha.zahid'
  });
}


export const azurelogin = (username) =>
  api.post('mobile/Login', {
    username,

  });



export const changepassword = (oldpassword, newpassword) =>
  api.post('/users/change-password', {
  
    newpassword,
    oldpassword,
  
  });

export const logout = ()=>
  
    // const credentials = await Keychain.getGenericPassword({service:'accessToken'});
    // console.log("access token in api ") 
    // console.log("access token in api ", credentials)
    // const accessToken = credentials ? credentials.password : null;
  api.post('/users/logout', 

  
  );


  export const forgetpassword =(email)=>
    api.post('/users/forget-password', {
      email,
  
    });


export const resetpassword =(email, otp, newpassword)=>
  api.post('/users/reset-password', {
    email,
    otp,
    newpassword,
  });


  export const resendotp =(email)=>
    api.post('/users/re-send-otp', {
      email,
    });


export const changeavatar = (avatar) =>
  api.patch('/users/avatar', {
    avatar
  });



export const userstate = username =>
  api.get('mobile/GetUserState', {
    params: {
      username,
    },
  });

export const locationlist = () =>
  api.get('mobile/Locationlist', {

  });

export const partnerlist = () =>
  api.get('mobile/Partnerlist', {

  });

export const setuserstate = (username, stationID, partnerKey) =>
  api.post('mobile/SetDispEnv', {
    username,
    stationID,
    partnerKey,
    azureUserName: 'ayesha.zahid'
  });
