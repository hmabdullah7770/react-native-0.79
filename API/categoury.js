import api from '../services/apiservice';

// Get category names list
export const getCategoryNamesList = () =>
  api.get('/categouries/allcategoury', {
    params: {
      adminpassword: "(Bunny)tota#34#"
    }
  });

// Get category data with pagination
export const getCategoryData = (categoury, limit, page) =>
  api.get('/categouries/getcategoury', {
    params: {  
      categoury,
      adminpassword: "(Bunny)tota#34#",
      limit,
      page,
    }
  });


export const  getPostsByCategory  =(categoury,limit,page)=>

  api.get ('/categouries/getpostsbycategory',{


     params: {  
      categoury,
      adminpassword: "(Bunny)tota#34#",
      limit,
      page,
    }
  })




export const getFollowingUsersPosts =(categoury,limit,page)=>
  
  
  api.get('/categouries/getfollowingusersposts',{

       params: {  
      categoury,
      adminpassword: "(Bunny)tota#34#",
      limit,
      page,
    }
  })






//   // Get category data with pagination
// export const getfollowingCategoryData = (categoury, limit, page) =>
//   api.get('/categouries/getfollowinguserscategoury', {
//     params: {  
//       categoury,
//       limit,
//       page,
//     }
//   });



// //new api for unified feed   



// // Get category data with pagination
// export const getunifiedfeed = (categoury, limit, page) =>
//   api.get('/categouries/unified-feed', {
//     params: {  
//       categoury,
//       adminpassword: "(Bunny)tota#34#",
//       limit,
//       page,
//     }
//   });




//   // Get category data with pagination
// export const getunifiedfollowingfeed = (categoury, limit, page) =>
//   api.get('/categouries/following-unified-feed', {
//     params: {  
//       categoury,
//       limit,
//       page,
//     }
//   });







// Legacy function names for backward compatibility
export const getcategourynameslist = getCategoryNamesList;
export const getcategourydata = getCategoryData;
// export const getfollowingcategourydata = getfollowingCategoryData;