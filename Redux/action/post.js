

// Posts - Actions

export const getallpostrequest = () => ({
  type: 'GET_ALL_POST_REQUEST',
});


export const getallsuccessful = (data, messege) => ({
  type: 'GET_ALL_POST_SUCCESSFUL',
  payload: { data, messege },
});


export const getallpostfail = error => ({
  type: 'GET_ALL_POST_FAIL',
  payload: error,
});






export const uploadpostrequest = (
  imageFile1,
  imageFile2,
  imageFile3,
  imageFile4,
  imageFile5,

  videoFile1,
  videoFile2,
  videoFile3,
  videoFile4,
  videoFile5,

  thumbnail1,
  thumbnail2,
  thumbnail3,
  thumbnail4,
  thumbnail5,

  title,
  description,
  category,
  pattern,

  // Store data
  storeisActive,
  storeIconSize,
  storeId,
  storeUrl,

  // Product data
  productisActive,
  productIconSize,
  ProductId,
  productUrl,

  // Video autoplay flags
  autoplay1,
  autoplay2,
  autoplay3,
  autoplay4,
  autoplay5,

  // New URL fields
  facebookurl,
  instagramurl,
  whatsappnumberurl,
  storelinkurl,

   facebook,
  instagram,
  whatsapp,
  storeLink,  



) => {
  console.log('Inside uploadpostrequest with title:', title);

  return {
    type: 'ADD_POST_REQUEST',
    
      imageFile1,
      imageFile2,
      imageFile3,
      imageFile4,
      imageFile5,

      videoFile1,
      videoFile2,
      videoFile3,
      videoFile4,
      videoFile5,

      thumbnail1,
      thumbnail2,
      thumbnail3,
      thumbnail4,
      thumbnail5,

      title,
      description,
      category,
      pattern,

      // Store data
      storeisActive,
      storeIconSize,
      storeId,
      storeUrl,

      // Product data
      productisActive,
      productIconSize,
      ProductId,
      productUrl,

      // Video autoplay flags
      autoplay1,
      autoplay2,
      autoplay3,
      autoplay4,
      autoplay5,

      // New URL fields
      facebookurl,
      instagramurl,
      whatsappnumberurl,
      storelinkurl,

      facebook,
      instagram,
      whatsapp,
      storeLink
    
  };
};


export const  uploadpostsuccessful = (data, messege) => ({
  type: 'ADD_POST_SUCCESSFUL',
  payload: { data, messege },
});


export const uploadpostfail = error => ({
  type: 'ADD_POST_FAIL',
  payload: error,
});







export const deletepostrequest = (postId) => ({
  type: 'DELETE_POST_REQUEST',
  postId,
});


export const deletepostsuccessful = (data, messege) => ({
  type: 'DELETE_POST_SUCCESSFUL',
  payload: { data, messege },
});


export const deletepostfail = error => ({
  type: 'DELETE_POST_FAIL',
  payload: error,
});