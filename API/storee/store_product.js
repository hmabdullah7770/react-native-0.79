import api from '../services/apiservice';






//create order by customer


export const addproduct = (storeId,productName,description,productPrice,warnings,productDiscount,productSizes,productColors,category,stock,variants = [],specifications ,tags ,// productImages
    ) =>
  api.post(`/stores/:storeId/products${encodeURIComponent(storeId)}`, {
       
    productName,
        description,
        productPrice,
        warnings,    
        productDiscount,
        productSizes,
        productColors,
     
        category,
        stock,
        variants,
        specifications,
        tags,
      productImages,     //array
    
    });


//get product of the stores

export const getstoreproduct= () =>

    
  api.get(`/stores/:storeId/products${encodeURIComponent(storeId)}`, {
   

    
  });

//get product  by id  (plus store id which we also needed)
 export const getproductbyId= (productId) =>
  api.get(`/stores/products/:productId${encodeURIComponent(productId)}`)



//delete order by customers
export const deleteProduct = (storeId,productId) =>
  api.delete(`/stores/:storeId/products/:productId${encodeURIComponent(storeId)}/${encodeURIComponent(productId)}`);


//update product by owner
export const updateProduct = (storeId,productId,productName,description,productPrice,warnings,productDiscount,productSizes,productColors,category,stock,variants = [],specifications ,tags ,// productImages
    ) =>
  api.put(`/stores/:storeId/products/:productId${encodeURIComponent(storeId)}/${encodeURIComponent(productId)}`, {
    productName,
    description,
    productPrice,
    warnings,
    productDiscount,
    productSizes,
    productColors,
    category,
    stock,
    // variants = [],
    specifications ,
    tags ,
    productImages
  })