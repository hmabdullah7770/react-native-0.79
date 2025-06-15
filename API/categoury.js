// import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/apiservice';





// const accessToken = await Keychain.getGenericPassword({ service: 'accessToken' }); // Assuming 'accessToken' is the service name you used for the access token
// const refreshToken = await Keychain.getGenericPassword({ service: 'refreshToken' }); 




export const getcategourynameslist = () =>
  api.get('/categouries/allcategoury', 
    
    {
params:{
    adminpassword:"(Bunny)tota#34#"
    }
  });


     // cards
    // getcategoury 


    export const  getcategourydata=(categoury,limit,page)=>

     api.get('/categouries/getcategoury',
      
      {

      params:{  categoury,
        adminpassword:"(Bunny)tota#34#",
        limit,
        page,
      
      }
    } )

    


    // addcategoury



    // deletecategoury


   