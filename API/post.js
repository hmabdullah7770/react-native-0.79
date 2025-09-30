import api from '../services/apiservice';

export const getallPost = () =>
  api.get('/post/getall', {
    
  });

// Create post with multipart/form-data
export const uploadPost = (formData) =>
  api.post('/post/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// Delete a post by id
export const DeletePost = (postId) =>
  api.delete(`/post/${encodeURIComponent(postId)}`, {
    
  });
