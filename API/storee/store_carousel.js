import api from '../services/apiservice';





export const createstorecarousel = (  images,carouselname,title,description,buttonText,buttonTextColor,buttonHoverTextColor,buttonBackground,buttonHoverBackground,buttonShadow,buttonShadowColor,
        buttonBorder,buttonBorderColor,titleColor,tileBackground,descriptionColor,discriptionBackgroundColor,fontFamily,
        category,storeId) =>
  api.post(`/stores/carousels/:storeId/create${encodeURIComponent(storeId)}`, {
      images,    
      carouselname,
        title,
        description,
        buttonText,
        buttonTextColor,
        buttonHoverTextColor,
        buttonBackground,
        buttonHoverBackground,
        buttonShadow,
        buttonShadowColor,
        buttonBorder,
        buttonBorderColor,
        titleColor,
        tileBackground,
        descriptionColor,
        discriptionBackgroundColor,
        fontFamily,
        category
    });


//get all the stores for authenticated user

export const getstorecarousel = (storeId) =>
  api.get(`/stores/carousels/store/:storeId${encodeURIComponent(storeId)}`, {
   

  });


 //get store by id specific user
// export const updatestorebanner = (storeId,bannerId,title, description, product,bannerImage ) =>{
//   api.put(`/stores/:storeId/banners/:bannerId${encodeURIComponent(storeId)}/${encodeURIComponent(storeId)}`,{
//  bannerId,title, description, product,bannerImage 

//   }); 



// }





    





export const deletestorecarousel = (storeId,carouselId) =>
  api.delete(`/stores/carousels/:carouselId/store/:storeId"${encodeURIComponent(storeId)}/${encodeURIComponent(carouselId)}`);



