import api from '../services/apiservice';





export const createStore = (category, storeType,storeName,productName,storeLogo) =>
  api.post('/stores/create', {
         category,
        storeType,
        storeName,
        productName,
        storeLogo
  
    });


//get all the stores for authenticated user

export const getuserStores = () =>
  api.get('/stores/user-stores', {
   
  });


 //get store by id specific user
export const getStoreById = (storeId) =>{
  api.get(`/stores/${encodeURIComponent(storeId)}`); 

}

export const updateStore =(storeId, category,
        storeType,
        storeName,
        productName,storeLogo)=>

   api.patch(`/stores/${encodeURIComponent(storeId)}`,
   {

    category,
    storeType,
    storeName,
    productName,
    storeLogo,
   }
)
     
    





export const deleteStore = (storeId) =>
  api.delete(`/stores/${encodeURIComponent(storeId)}`);


