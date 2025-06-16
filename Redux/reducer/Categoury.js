import * as Keychain from 'react-native-keychain'

const initialState = {
   
  //  accessToken: null,
   categourydata: null,
  //  categourycountdata: null,
   error: null,
   categourylist: null,
    loading: false,
   
  };


  // const accessToken = await Keychain.getGenericPassword('accessToken', user.data.accessToken);
  
  const categoury = (state = initialState, action) => {
    
    switch (action.type) {


  
         case  'CATEGOURY_SUCCESSFUL':
         console.log("CATEGOURY_SUCCESSFUL:",action.payload)
         return{
            ...state,  
            categourydata:action.payload,
              loading: false,
        error: null
          }



    case 'CATEGOURY_FAILS':
      console.log("CATEGOURY_FAILS:",action.payload)
    return{
     ...state,
       error:action.payload
      }


    //   case 'CATEGOURY_COUNT_SUCCESSFUL':
    // console.log("CATEGOURY_COUNT_SUCCESSFUL:",action.payload)
    //   return{
    //      ...state,
    //     categourycountdata: action.payload,
    //     loading: false,
    //     error: null
    //   }
      


    //     case 'CATEGOURY_COUNT_FAILS':
    // console.log("CATEGOURY_COUNT_FAILS:",action.payload)
    //   return{
    //     ...state,
    //     error:action.payload
    //   }



      case 'CATEGOURY_NAME_SUCCESSFUL':
    console.log("CATEGOURY_NAME_SUCCESSFUL:",action.payload)
      return{
         ...state,
        categourylist: action.payload,
        loading: false,
        error: null
      }
      
        case 'LOADING':
        return {
          ...state,
  
          loading: action.payload,
        };
  
      
      case 'CATEGOURY_NAME_FAILS':
    console.log("CATEGOURY_NAME_FAILS:",action.payload)
      return{
        ...state,
        error:action.payload
      }
      
      
      
      default:
        return state;
    }
  };
  
  export default categoury;


  //tackstack reducer


//   // 2. Redux Reducer (reducers/categoryReducer.js)
// import { categoryActionTypes } from '../actions/categoryActions';

// const initialState = {
//   selectedCategoryIndex: 0,
//   loading: false,
//   error: null,
//   categoryFilter: null,
//   lastSelectedCategory: null
// };

// const categoryReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case categoryActionTypes.SET_SELECTED_CATEGORY:
//       return {
//         ...state,
//         selectedCategoryIndex: action.payload,
//         lastSelectedCategory: state.selectedCategoryIndex
//       };

//     case categoryActionTypes.SET_LOADING:
//       return {
//         ...state,
//         loading: action.payload
//       };

//     case categoryActionTypes.SET_ERROR:
//       return {
//         ...state,
//         error: action.payload,
//         loading: false
//       };

//     case categoryActionTypes.CLEAR_ERROR:
//       return {
//         ...state,
//         error: null
//       };

//     case categoryActionTypes.SET_CATEGORY_FILTER:
//       return {
//         ...state,
//         categoryFilter: action.payload
//       };

//     case categoryActionTypes.RESET_CATEGORY_STATE:
//       return initialState;

//     default:
//       return state;
//   }
// };

// export default categoryReducer;
  