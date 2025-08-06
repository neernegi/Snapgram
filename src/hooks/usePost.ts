import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/apiClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';


type CommentInput = {
  postId: string;
  text: string;
  createdAt?: Date | string;
};



// Create Post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: apiService.createPost.bind(apiService),
    onSuccess: () => {
      toast({ title: 'Post created!' });
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      navigate('/');
    },
    onError: (error: any) => {
      toast({ title: 'Post creation failed', description: error.message, variant: 'destructive' });
    },
  });
};

// get all post
export const useGetAllPost = () => {
  return useQuery({
    queryKey: ['getAllPost'],
    queryFn: apiService.getAllPost.bind(apiService)
  })
}

// Feed Posts
export const useFeedPosts = () => {
  return useQuery({
    queryKey: ['feedPosts'],
    queryFn: apiService.getFeedPosts.bind(apiService),
  });
};

// Posts by User
export const useUserPosts = (userId: string) => {
  return useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => apiService.getPostsByUserId(userId),
    enabled: !!userId,
  });
};

// Single Post
export const usePostById = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => apiService.getPostById(postId),
    enabled: !!postId,
  });
};

// Update Post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: { caption?: string } }) =>
      apiService.updatePost(postId, data),
    onSuccess: () => {
      toast({ title: 'Post updated' });
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    },
  });
};

// Toggle Like
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => apiService.toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => apiService.unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

// get liked post
export const useLikedPosts = () => {
  return useQuery({
    queryKey: ['likedPosts'],
    queryFn: () => apiService.getLikedPosts(),
  });
};

// Comment on Post
export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ postId, text, createdAt }: CommentInput) =>
      apiService.commentOnPost(postId, text, createdAt ? new Date(createdAt) : new Date()),
    onSuccess: (data, variables) => {
      // More specific query invalidation to avoid race conditions
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.postId]
      });
      queryClient.invalidateQueries({
        queryKey: ['posts']
      });

      // Optionally update the specific post in cache immediately
      queryClient.setQueryData(['posts', variables.postId], (oldData: any) => {
        if (oldData && data.post) {
          return data.post;
        }
        return oldData;
      });

      toast({
        title: 'Comment added successfully',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      console.error('Comment error:', error);
      toast({
        title: 'Failed to add comment',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};


export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      apiService.deleteComment(postId, commentId),
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (error: any) => {
      toast({ title: 'Comment deletion failed', description: error.message, variant: 'destructive' });
    },
  });
};

// Delete Post
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (postId: string) => apiService.deletePost(postId),
    onSuccess: () => {
      // Invalidate user profile cache to refresh posts
      queryClient.invalidateQueries({ queryKey: ["getUserProfile"] });

      toast({
        title: "Post deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Save hooks
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => apiService.savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
  });
};

export const useUnsavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => apiService.unsavePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
  });
};

export const useSavedPosts = () => {
  return useQuery({
    queryKey: ['savedPosts'],
    queryFn: () => apiService.getSavedPosts(),
  });
};






