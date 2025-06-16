// 6. TanStack Query Hooks (hooks/useCategoryQueries.js)
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getCategoryNames, getCategoryData } from '../services/categoryApi';
import { setLoading, setError, clearError } from '../actions/categoryActions';

export const useCategoryNames = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['categoryNames'],
    queryFn: getCategoryNames,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    onSuccess: () => {
      dispatch(clearError());
    },
    onError: (error) => {
      dispatch(setError(error.message));
    }
  });
};

export const useCategoryDataInfinite = (category, limit) => {
  const dispatch = useDispatch();

  return useInfiniteQuery({
    queryKey: ['categoryData', category, limit],
    queryFn: async ({ pageParam = 1 }) => {
      dispatch(setLoading(true));
      try {
        const data = await getCategoryData(category, limit, pageParam);
        dispatch(setLoading(false));
        return data;
      } catch (error) {
        dispatch(setLoading(false));
        throw error;
      }
    },
    enabled: !!category,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.messege?.pagination;
      return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    onError: (error) => {
      dispatch(setError(error.message));
    }
  });
};