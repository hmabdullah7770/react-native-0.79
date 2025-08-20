// TanStack Query Hooks (hooks/useCategories.js)
import { useEffect } from 'react';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getCategoryNamesList, getCategoryData ,getfollowingCategoryData,getunifiedfeed,getunifiedfollowingfeed ,getPostsByCategory ,getFollowingUsersPosts  } from '../../API/categoury';

export const useCategoryNames = () => {
  return useQuery({
    queryKey: ['categoryNames'],
    queryFn: async () => {
      const response = await getCategoryNamesList();
      return response.data; // return the data object directly
    },
    select: (data) => ({
      list: (data?.messege || []).map(item => ({
        id: item._id,
        name: item.categouryname || item.categoryname,
      })),
      total: data?.messege?.length || 0
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Replaced cacheTime with gcTime (new TanStack Query)
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true, // ✅ Refetch when network reconnects
    refetchOnMount: true, // ✅ Refetch on mount if data is stale
  });
};



export const usegetPostsByCategory  = (category, limit) => {
  return useInfiniteQuery({
    queryKey: ['categoryPostData', category, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getPostsByCategory(category, limit, pageParam);
      return response.data; // This should return the data object that contains messege.cards
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.messege?.pagination;
      return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    select: (data) => {
      // Flatten all cards from all pages into a single array
      return data.pages.flatMap(page => {
        if (page?.messege?.cards) return page.messege.cards;
        if (page?.data?.messege?.cards) return page.data.messege.cards;
        if (page?.cards) return page.cards;
        return [];
      });
    },
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


  



  
export const usegetFollowingUsersPosts =(category,limit)=>{

  
}








//optimized

// export const useCategoryNames = () => queryOptions({
 
//   // const dispatch = useDispatch();

  
//     queryKey: ['categoryNames'],
//     queryFn: async () => {
     
//       const response = await getCategoryNamesList();
   
//       return response;
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     gcTime: 10 * 60 * 1000, // Replaced cacheTime with gcTime (new TanStack Query)
//     retry: 2,
//     refetchOnWindowFocus: true,
//     refetchOnReconnect: true, // ✅ Refetch when network reconnects
//     refetchOnMount: true, // ✅ Refetch on mount if data is stale
    
    
//     // onSuccess: (data) => {
    
//     //   dispatch(clearError());
//     // },
//     // onError: (error) => {
   
//     //   dispatch(setError(error.message));
//     // }
//   });





// Updated React Query hook with 2-second stale time
export const useCategoryDataInfinite = (category, limit) => {
  return useInfiniteQuery({
    queryKey: ['categoryData', category, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getCategoryData(category, limit, pageParam);
      return response.data; // This should return the data object that contains messege.cards
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.messege?.pagination;
      return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    select: (data) => {
      // Flatten all cards from all pages into a single array
      return data.pages.flatMap(page => {
        if (page?.messege?.cards) return page.messege.cards;
        if (page?.data?.messege?.cards) return page.data.messege.cards;
        if (page?.cards) return page.cards;
        return [];
      });
    },
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












// export const useFollowingCategoryDataInfinite = (category, limit) => {
//   return useInfiniteQuery({   
//     queryKey: ['followingCategoryData', category, limit],
//     queryFn: async ({ pageParam = 1 }) => {
//       console.log('🔥 Calling getfollowingCategoryData API with params:', { category, limit, page: pageParam });
//       const response = await getfollowingCategoryData(category, limit, pageParam);
//       console.log('✅ getfollowingCategoryData response:', response);
//       return response.data; // This should return the data object that contains messege.cards
//     },
//     getNextPageParam: (lastPage) => {
//       const pagination = lastPage?.messege?.pagination;
//       return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
//     },
//     // Added stale time configuration
//     staleTime: 2 * 1000, // 2 seconds - data stays fresh for 2 seconds
//     gcTime: 5 * 60 * 1000, // 5 minutes - cache retention time
//     retry: 2, // Retry failed requests twice
//     refetchOnWindowFocus: false, // Don't refetch when window gains focus
//     refetchOnReconnect: true, // Refetch when network reconnects
//     // Optional: Add these for better UX
//     refetchOnMount: 'always', // Always refetch on component mount
//     networkMode: 'online', // Only run queries when online
//     }
//   );
// };





//new for unified feed 


// getunifiedfeed 
//getunifiedfollowingfeed

// // Prefetch all category data for each category name, with a 1s delay between each
// export const usePrefetchAllCategoryData = (limit = 5) => {
//   const queryClient = useQueryClient();
//   const { data } = useCategoryNames();
//   const categories = data?.list || [];

//   useEffect(() => {
//     if (!categories.length) return;
//     let cancelled = false;
//     async function prefetchAll() {
//       for (let i = 0; i < categories.length; i++) {
//         if (cancelled) break;
//         const categoryName = categories[i].name;
//         await queryClient.prefetchInfiniteQuery({
//           queryKey: ['categoryData', categoryName, limit],
//           queryFn: ({ pageParam = 1 }) =>
//             getCategoryData(categoryName, limit, pageParam).then(res => res.data),
//         });
//         await new Promise(res => setTimeout(res, 1000));
//       }
//     }
//     prefetchAll();
//     return () => {
//       cancelled = true;
//     };
//   }, [categories, queryClient, limit]);
// };