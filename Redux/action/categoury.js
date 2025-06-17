// Action types for category management
export const categoryActionTypes = {
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_CATEGORY_FILTER: 'SET_CATEGORY_FILTER',
  RESET_CATEGORY_STATE: 'RESET_CATEGORY_STATE'
};

export const setSelectedCategory = (categoryIndex) => {
  console.log('🎯 setSelectedCategory called with:', categoryIndex);
  return {
    type: categoryActionTypes.SET_SELECTED_CATEGORY,
    payload: categoryIndex
  };
};

export const setLoading = (loading) => {
  console.log('⏳ setLoading called with:', loading);
  return {
    type: categoryActionTypes.SET_LOADING,
    payload: loading
  };
};

export const setError = (error) => {
  console.log('❌ setError called with:', error);
  return {
    type: categoryActionTypes.SET_ERROR,
    payload: error
  };
};

export const clearError = () => {
  console.log('✅ clearError called');
  return {
    type: categoryActionTypes.CLEAR_ERROR
  };
};

export const setCategoryFilter = (filter) => {
  console.log('🔍 setCategoryFilter called with:', filter);
  return {
    type: categoryActionTypes.SET_CATEGORY_FILTER,
    payload: filter
  };
};

export const resetCategoryState = () => {
  console.log('🔄 resetCategoryState called');
  return {
    type: categoryActionTypes.RESET_CATEGORY_STATE
  };
};

// Legacy Redux actions (for backward compatibility)
export const categoryRequest = (category, limit, page) => {
  console.log('📋 categoryRequest called');
  console.log('Inside category request');
  console.log('category action called with:', category);
  console.log('limit:', limit, 'page:', page);
  return {
    type: 'CATEGORY_REQUEST',
    category,
    limit,
    page,
  };
};

export const categorySuccessful = data => {
  console.log('✅ categorySuccessful called with data:', data);
  return {
    type: 'CATEGORY_SUCCESSFUL',
    payload: data,
  };
};

export const categoryFails = error => {
  console.log('❌ categoryFails called with error:', error);
  return {
    type: 'CATEGORY_FAILS',
    payload: error,
  };
};