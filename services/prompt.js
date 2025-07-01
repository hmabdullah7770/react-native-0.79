logout saga==>   function* LogoutSaga() {
  yield put(actions.setloading(true));
  
  try {
    const response = yield call(api.logout);

    if (response.status === 200) {
     // Should be - CORRECT
  yield call([Keychain, 'resetGenericPassword'], { service: 'accessToken' });
  yield call([Keychain, 'resetGenericPassword'], { service: 'refreshToken' });
      yield put(
        actions.logoutsuccessful([
          response.data.message,
          'You are logged out',
          // EncryptedStorage.clear('azure_token')
        ]),
      );

            // Clear store after successful logout
      yield put(actions.clearstore());
    } 
    
    // else if (response.status === 401 && response.data.error === 'jwt expired') {
     
    //       authResponseInterceptor();

    // }


// else if (response.status === 401 && response.data.error === 'jwt expired') {
//       // Don't handle 401 jwt expired here - create an error to trigger the interceptor
//       const error = new Error('JWT expired');
//       error.response = response;
//       error.config = response.config;
//       throw error;
//     }

  //  else if(response.data.error === 'jwt expired' && response.status === 401){

  //   //  run interceptor 2

  //  }

    else {
      yield put(
        actions.logoutfails({
          error: `Unexpected response status: ${response.status}  ${response.data.error}`,
        }),
      );
    }
    yield put(actions.setloading(false));
  } catch (error) {
    yield put(actions.setloading(false));


    yield put(
      actions.logoutfails({
        error: ['An error occurred', error.message ,"statuscode:", error.status || 'Unknown error'],
      }),
    );
  }
} see there is a issue in logout prcudure i logout with the expired token then  token refresh with refesh api call and logout success full  response in dev tool==>//success response


auth.js:166 Inside logout request

App.tsx:122 Is authenticated: true

App.tsx:125 User in App.tsx : {data: {…}, messege: Array(2)}

AppScreens.js:15 user token:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI4ZGExZDRkYzJkYmRlMmZmOTk0NWEiLCJlbWFpbCI6ImhtYWJkdWxsYWg3NzcwQGdtYWlsLmNvbSIsImZ1bGxuYW1lIjoiaG1hYmR1bGxhaCIsInVzZXJuYW1lIjoiaG0gYWJkdWxsYWgiLCJpYXQiOjE3NTEzNjEzNTUsImV4cCI6MTc1MTM2MTQxNX0.R4mDR_j7A5zDmcZVEgU1Gr59g_ArxWQo5aqdX9qaVbE

CategouryList.jsx:14 CategoryList render count: 5

CategouryList.jsx:74 handleCategorySelect recreated: true

CategouryList.jsx:78 renderItem recreated: true

apiservice.js:254 base url is http://192.168.251.101:4000/api/v1

apiservice.js:285 in 1 interceptor

apiservice.js:302 in 2 interceptor

apiservice.js:263 refresh token is {storage: 'KeystoreAESGCM_NoAuth', password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI4ZGExZDRkYzJkYmRlMmZmOTk0NWEiLCJpYXQiOjE3NTEzNjEzNTUsImV4cCI6MTc1MTM2MjU1NX0.LgBBrCXEJdXCWGGak0Em5N7HZF2QMIBRdTt6g8TOmnI', username: 'refreshToken', service: 'refreshToken'}

apiservice.js:355 new accesstoken is::::: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI4ZGExZDRkYzJkYmRlMmZmOTk0NWEiLCJlbWFpbCI6ImhtYWJkdWxsYWg3NzcwQGdtYWlsLmNvbSIsImZ1bGxuYW1lIjoiaG1hYmR1bGxhaCIsInVzZXJuYW1lIjoiaG0gYWJkdWxsYWgiLCJpYXQiOjE3NTEzNjE2NTQsImV4cCI6MTc1MTM2MTcxNH0.eH4lU3oq4Tg_PrQhzamY6U_iIwLZKjABIsrqyDvcDf4

apiservice.js:356 new refreshtoken is:::::: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI4ZGExZDRkYzJkYmRlMmZmOTk0NWEiLCJpYXQiOjE3NTEzNjE2NTQsImV4cCI6MTc1MTM2Mjg1NH0.vaZ6eEeCY_jWzrafLwBdLYNJz6TuI8eeYpRtH2tIhmA

apiservice.js:364 refresh responve  data 200

apiservice.js:254 base url is http://192.168.251.101:4000/api/v1

apiservice.js:285 in 1 interceptor

auth.js:176 messege in action (2) [undefined, 'You are logged out']

Auth.js:215 Logout Successful  (2) [undefined, 'You are logged out']

App.tsx:122 Is authenticated: false

App.tsx:125 User in App.tsx : null


see logout succesful but secound time i logut i dont logout while i goes in side the logout saga and in catch block and then  i get this response==>
//fail logout api


Inside logout request
App.tsx:122 Is authenticated: true
App.tsx:125 User in App.tsx : {data: {…}, messege: Array(2)}
AppScreens.js:15 user token:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI4ZGExZDRkYzJkYmRlMmZmOTk0NWEiLCJlbWFpbCI6ImhtYWJkdWxsYWg3NzcwQGdtYWlsLmNvbSIsImZ1bGxuYW1lIjoiaG1hYmR1bGxhaCIsInVzZXJuYW1lIjoiaG0gYWJkdWxsYWgiLCJpYXQiOjE3NTEzNjQyMTYsImV4cCI6MTc1MTM2NDI3Nn0.uA-dUG49CAHNn9E8Hlgx8yKd5eYq87qnpBidu8_qboA
CategouryList.jsx:14 CategoryList render count: 3
CategouryList.jsx:74 handleCategorySelect recreated: true
CategouryList.jsx:78 renderItem recreated: true
apiservice.js:254 base url is http://192.168.251.101:4000/api/v1
apiservice.js:285 in 1 interceptor
apiservice.js:302 in 2 interceptor
apiservice.js:263 refresh token is {storage: 'KeystoreAESGCM_NoAuth', password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI4ZGExZDRkYzJkYmRlMmZmOTk0NWEiLCJpYXQiOjE3NTEzNjQyMTYsImV4cCI6MTc1MTM2NTQxNn0.Pq1DJz9BtvBsvMCJrbzzHRrmTHzPrrvgUQ3Fn2RGDnc', username: 'refreshToken', service: 'refreshToken'}password: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODI4ZGExZDRkYzJkYmRlMmZmOTk0NWEiLCJpYXQiOjE3NTEzNjQyMTYsImV4cCI6MTc1MTM2NTQxNn0.Pq1DJz9BtvBsvMCJrbzzHRrmTHzPrrvgUQ3Fn2RGDnc"service: "refreshToken"storage: "KeystoreAESGCM_NoAuth"username: "refreshToken"[[Prototype]]: Object
auth.js:188 Inside logout fails
auth.js:189 {error: Array(4)}error: (4) ['An error occurred', 'Request failed with status code 401', 'statuscode:', 401][[Prototype]]: Object
Auth.js:226 Logout Fails  {error: Array(4)}error: (4) ['An error occurred', 'Request failed with status code 401', 'statuscode:', 401][[Prototype]]: Object
App.tsx:122 Is authenticated: false
App.tsx:125 User in App.tsx : null (why this behavour occere first time the same code work but second time not gors in logout saga catch block why give me main reason of this dont write addition code i want the main reason of it so see code line by line even i clear the token forsce fully by my self but the login angain but and logout still get same error  i need to delete or rebult the appp to run so ges deep in side and find the root cause and give me seguustions)