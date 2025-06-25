// TanStack Query Hooks (hooks/useCategories.js)
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getCategoryNamesList, getCategoryData, getfollowingCategoryData } from '../../API/categoury';
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
    refetchOnWindowFocus: true,

       refetchOnReconnect: true, // ✅ Refetch when network reconnects
    refetchOnMount: true, // ✅ Refetch on mount if data is stale
    onSuccess: (data) => {
    
      dispatch(clearError());
    },
    onError: (error) => {
   
      dispatch(setError(error.message));
    }
  });
};



// Updated React Query hook with 2-second stale time
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
    // Added stale time configuration
    staleTime: 2 * 1000, // 2 seconds - data stays fresh for 2 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes - cache retention time
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    // Optional: Add these for better UX
    refetchOnMount: 'always', // Always refetch on component mount
    networkMode: 'online', // Only run queries when online
  });
};


export const useFollowingCategoryDataInfinite = (category, limit) => {
  return useInfiniteQuery({   
    queryKey: ['followingCategoryData', category, limit],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('🔥 Calling getfollowingCategoryData API with params:', { category, limit, page: pageParam });
      const response = await getfollowingCategoryData(category, limit, pageParam);
      console.log('✅ getfollowingCategoryData response:', response);
      return response.data; // This should return the data object that contains messege.cards
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.messege?.pagination;
      return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    // Added stale time configuration
    staleTime: 2 * 1000, // 2 seconds - data stays fresh for 2 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes - cache retention time
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    // Optional: Add these for better UX
    refetchOnMount: 'always', // Always refetch on component mount
    networkMode: 'online', // Only run queries when online
    }
  );
};



// // In your React Query hook
// export const useCategoryDataInfinite = (category, limit) => {
//   return useInfiniteQuery({
//     queryKey: ['categoryData', category, limit],
//     queryFn: async ({ pageParam = 1 }) => {
//       console.log('🔥 Calling getCategoryData API with params:', { category, limit, page: pageParam });
//       const response = await getCategoryData(category, limit, pageParam);
//       console.log('✅ getCategoryData response:', response);
//       return response.data; // This should return the data object that contains messege.cards
//     },
//     getNextPageParam: (lastPage) => {
//       const pagination = lastPage?.messege?.pagination;
//       return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
//     },
//   });
// };