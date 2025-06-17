import api from '../services/apiservice';

// Get category names list
export const getCategoryNamesList = () =>
  api.get('/categouries/allcategoury', {
    params: {
      adminpassword: "(Bunny)tota#34#"
    }
  });

// Get category data with pagination
export const getCategoryData = (categoury, limit, page) =>
  api.get('/categouries/getcategoury', {
    params: {  
      categoury,
      adminpassword: "(Bunny)tota#34#",
      limit,
      page,
    }
  });

// Legacy function names for backward compatibility
export const getcategourynameslist = getCategoryNamesList;
export const getcategourydata = getCategoryData;