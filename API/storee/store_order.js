import api from '../services/apiservice';






//create order by customer


export const createstoreorder = (
      storeId,items,customerName,customerEmail,customerPhone,customerAddress,paymentMethod,notes,
    //prductId,quantity
        //totalAmount,
        //shippingCost,
        //finalAmount,
    ) =>
  api.post(`/stores/orders/create`, {
       
storeId,items,customerName,customerEmail,customerPhone,customerAddress,paymentMethod,notes
    
    });


//get all the stores for authenticated user

//costumer see his order from every store

export const getstorecustomerorder = () =>
  api.get(`/stores/orders/my-orders`, {
   

    
  });

//costumer see his order from one store

 export const getstorecustomerorderbyid = (storeId) =>
  api.get(`/orders/my-orders/:storeId/${encodeURIComponent(storeId)}`)



//delete order by customers
export const deleteOrderbycustomer = (orderId) =>
  api.delete(`/stores/orders/order/${encodeURIComponent(orderId)}`);


 //get order by id
export const getstoreorderbyid = (storeId,bannerId,title, description, product,bannerImage ) =>{
  api.put(`/stores/:orderId/:storeId/${encodeURIComponent(storeId)}/${encodeURIComponent(orderId)}`,{
 bannerId,title, description, product,bannerImage 

  }); 
}

    

//get order by owner 

export const getstoreorders = (storeId) =>
  api.get(`/stores/orders/store/:storeId${encodeURIComponent(storeId)}`, {
   


  });


//update order by owner
export const updateOrderStatus = (orderId, status) =>
  api.patch(`/stores/orders/:orderId/${encodeURIComponent(orderId)}/status`, {
    status,
  });


//delete order by owner
export const deleteOrderByOwner = (orderId, storeId) =>
  api.delete(`/stores/orders/:orderId/:storeId/${encodeURIComponent(orderId)}/${encodeURIComponent(storeId)}`);











