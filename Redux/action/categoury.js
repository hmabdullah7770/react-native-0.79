//categoury
export const categouryrequest = (categoury,limit,page) => {
  console.log("Inside categoury request")
  console.log("categoury action called with:", categoury);
  return{
  type: 'CATEGOURY_REQUEST',
  categoury,
  limit,
  page,
  //  phone ,
  
}};




export const categourysuccessful = data => ({
  type: 'CATEGOURY_SUCCESSFUL',
  payload: data,
});

export const categouryfails = error => ({
  type: 'CATEGOURY_FAILS',
  payload: error,
});

//categoury with count  (5th Api call)

// export const categourycountrequest = (categoury,limit,page) => {
//   console.log("Inside categourycount request")
//   console.log("categourycount action called with:", categoury);
//   return{
//   type: 'CATEGOURY_COUNT_REQUEST',
//   categoury,
//   limit,
//   page,
//   //  phone ,
  
// }};




// export const categourycountsuccessful = data => ({
//   type: 'CATEGOURY_COUNT_SUCCESSFUL',
//   payload: data,
// });

// export const categourycountfails = error => ({
//   type: 'CATEGOURY_COUNT_FAILS',
//   payload: error,
// });







export const categourynamerequest = () => {
  console.log("Inside categoury name request")
  return{
  type: 'CATEGOURY_NAME_REQUEST'
}};


export const categourynamerequestsuccessful = data => ({
  type: 'CATEGOURY_NAME_SUCCESSFUL',
  payload: data,
});

export const categourynamerequestfails = error => ({
  type: 'CATEGOURY_NAME_FAILS',
  payload: error,
});


//LOADER
export const setloading = loading => ({
  type: 'LOADING',
  payload: loading,
});





//tanstack  code

// // Action types for category management
// export const categoryActionTypes = {
//   SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
//   SET_LOADING: 'SET_LOADING',
//   SET_ERROR: 'SET_ERROR',
//   CLEAR_ERROR: 'CLEAR_ERROR',
//   SET_CATEGORY_FILTER: 'SET_CATEGORY_FILTER',
//   RESET_CATEGORY_STATE: 'RESET_CATEGORY_STATE'
// };

// export const setSelectedCategory = (categoryIndex) => ({
//   type: categoryActionTypes.SET_SELECTED_CATEGORY,
//   payload: categoryIndex
// });

// export const setLoading = (loading) => ({
//   type: categoryActionTypes.SET_LOADING,
//   payload: loading
// });

// export const setError = (error) => ({
//   type: categoryActionTypes.SET_ERROR,
//   payload: error
// });

// export const clearError = () => ({
//   type: categoryActionTypes.CLEAR_ERROR
// });

// export const setCategoryFilter = (filter) => ({
//   type: categoryActionTypes.SET_CATEGORY_FILTER,
//   payload: filter
// });

// export const resetCategoryState = () => ({
//   type: categoryActionTypes.RESET_CATEGORY_STATE
// });
