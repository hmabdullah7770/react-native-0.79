import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComments, addComment,getReplies, addReply } from "../../API/comment";

export const usegetComments = (page,limit,postId) => {
  return useInfiniteQuery({
    queryKey: ['comments', contentId, contentType],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getComments(pageParam, limit, postId);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.messege?.pagination;
      return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    staleTime: 2 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId,content,audioComment,videoComment,sticker }) => 
      addComment(postId,content,audioComment,videoComment,sticker ),
    
    onMutate: async ({ postId,content,audioComment,videoComment,sticker  }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['comments', postId,content,audioComment,videoComment,sticker ] 
      });

      // Get current comments
      const previousComments = queryClient.getQueryData([
        'comments', 
        postId,content,audioComment,videoComment,sticker 
      ]);

      // Create optimistic comment
      const optimisticComment = {
        _id: Date.now().toString(),
        postId,
        content,
        audioComment,
        videoComment,
        sticker ,
        createdAt: new Date().toISOString(),
        user: {
          // Get current user details from auth state or local storage
          _id: 'temp-id',
          username: 'You',
          avatar: 'default-avatar-url'
        },
        isOptimistic: true
      };

      // Optimistically update comments list
      queryClient.setQueryData(
        ['comments', postId,content,audioComment,videoComment,sticker ],
        (old) => ({
          pages: [
            {
              ...old.pages[0],
              data: [optimisticComment, ...old.pages[0].data]
            },
            ...old.pages.slice(1)
          ],
          pageParams: old.pageParams
        })
      );

      return { previousComments };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['comments', variables.postId,variables.content,variables.audioComment,variables.videoComment,variables.sticker ],
        context.previousComments
      );
    },

    onSettled: (data, error, { postId,content,audioComment,videoComment,sticker  }) => {
      // Refetch comments to sync with server
      queryClient.invalidateQueries({
        queryKey: ['comments', postId,content,audioComment,videoComment,sticker]
      });
    },
  });
};





// ...existing imports and usegetComments code...

export const useGetReplies = (commentId, limit) => {
  return useInfiniteQuery({
    queryKey: ['replies', commentId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getReplies(commentId, pageParam, limit);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.messege?.pagination;
      return pagination?.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    staleTime: 2 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId,content,audioComment,videoComment,sticker }) => 
      addReply(commentId,content,audioComment,videoComment,sticker),
    
    onMutate: async ({commentId,content,audioComment,videoComment,sticker }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['replies', commentId] 
      });

      // Get current replies
      const previousReplies = queryClient.getQueryData([
        'replies', 
        commentId
      ]);

      // Create optimistic reply
      const optimisticReply = {
        _id: Date.now().toString(),
        commentId,
        content,audioComment,videoComment,
        sticker,
        createdAt: new Date().toISOString(),
        user: {
          _id: 'temp-id',
          username: 'You',
          avatar: 'default-avatar-url'
        },
        isOptimistic: true
      };

      // Optimistically update replies list
      queryClient.setQueryData(
        ['replies', commentId],
        (old) => ({
          pages: [
            {
              ...old.pages[0],
              data: [optimisticReply, ...old.pages[0].data]
            },
            ...old.pages.slice(1)
          ],
          pageParams: old.pageParams
        })
      );

      return { previousReplies };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['replies', variables.commentId],
        context.previousReplies
      );
    },

    onSettled: (data, error, { commentId }) => {
      // Refetch replies to sync with server
      queryClient.invalidateQueries({
        queryKey: ['replies', commentId]
      });
    },
  });
};

// ...existing useAddComment code...