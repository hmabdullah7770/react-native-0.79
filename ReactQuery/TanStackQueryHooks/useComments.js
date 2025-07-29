import { useQuery } from "@tanstack/react-query";
import { getComments,addComment, } from "../../API/comment";

// export const useComments = (postId) => {
//   return useQuery({
//     queryKey: ["comments", postId],
//     queryFn: () => getComments(postId),
//   });
// };




export const usegetComments = (limit,contentId,contentType) => {
    return useInfiniteQuery({
      queryKey: ['getcomments', contentId,contentType, limit],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getCommentsData(contentId,contentType,limit,pageParam);
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