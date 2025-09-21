import api from '../../services/apiservice';






//create product by store owner


export const addproduct = (storeId, productData) =>
  api.post(`/stores/${encodeURIComponent(storeId)}/products`, productData);


//get product of the stores
export const getstoreproduct = (storeId) =>{

  console.log("Inside Api call with storeId:", storeId);
 
return api.get(`/stores/${encodeURIComponent(storeId)}/products`);
}

//get product by id
export const getproductbyId = (productId) =>
  api.get(`/stores/products/${encodeURIComponent(productId)}`);



//delete product by store owner
export const deleteProduct = (storeId, productId) =>
  api.delete(`/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`);


//update product by owner
export const updateProduct = (storeId, productId, productData) =>
  api.put(`/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`, productData);