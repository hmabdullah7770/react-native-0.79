// TanStack Query Hooks (hooks/useCategories.js)
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getCategoryNamesList, getCategoryData } from '../../API/categoury';
import { setLoading, setError, clearError } from '../../Redux/action/categoury';

export const useCategoryNames = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['categoryNames'],
    queryFn: async () => {
     
      const response = await getCategoryNamesList();
   
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Replaced cacheTime with gcTime (new TanStack Query)
    retry: 2,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
    
      dispatch(clearError());
    },
    onError: (error) => {
   
      dispatch(setError(error.message));
    }
  });
};

// In your React Query hook
export const useCategoryDataInfinite = (category, limit) => {
  return useInfiniteQuery({
    queryKey: ['categoryData', category, limit],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('🔥 Calling getCategoryData API with params:', { category, limit, page: pageParam });
      const response = await getCategoryData(category, limit, pageParam);
      console.log('✅ getCategoryData response:', response);
      return response.data; // This should return the data object that contains messege.cards
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.messege?.pagination;
      return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
  });
};