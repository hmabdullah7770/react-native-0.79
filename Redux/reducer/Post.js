const initialState = {
  loading: false,
  posts: [],
  error: null,
  messege: null,
};

const post = (state = initialState, action) => {
  switch (action.type) {
    // case 'GET_ALL_POST_REQUEST':
    // case 'ADD_POST_REQUEST':
    // case 'DELETE_POST_REQUEST':
    //   return {
    //     ...state,
    //     loading: true,
    //     error: null,
    //     messege: null,
    //   };

    case 'GET_ALL_POST_SUCCESSFUL':
      return {
        ...state,
        loading: false,
        posts: Array.isArray(action.payload.data) ? action.payload.data : [],
        messege: action.payload.messege || null,
        error: null,
      };

    case 'ADD_POST_SUCCESSFUL':
      return {
        ...state,
        loading: false,
        // Prepend newly created post if returned, otherwise keep state
        posts: action.payload?.data
          ? [action.payload.data, ...state.posts]
          : state.posts,
        messege: action.payload.messege || null,
        error: null,
      };

    case 'DELETE_POST_SUCCESSFUL':
      return {
        ...state,
        loading: false,
        posts: state.posts.filter(p => p.id !== action.payload?.data?.id && p._id !== action.payload?.data?._id && p.id !== action.payload?.id && p._id !== action.payload?._id),
        messege: action.payload.messege || null,
        error: null,
      };

    case 'GET_ALL_POST_FAIL':
    case 'ADD_POST_FAIL':
    case 'DELETE_POST_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default post;

