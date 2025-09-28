// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService, SignUpData, SignInData} from '../services/auth';

import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/apiClient';
import { useUserContext } from '@/context/AuthContext';
import { AuthUserProfile, FollowUser } from '@/types/interfaces';





export const useSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SignUpData) => {
      await AuthService.signUp(data);
      return data;
    },
    onSuccess: (data) => {
      navigate(`/confirm-signup?username=${data.username}`);
    },
    onError: () => {
      toast({
        title: "Sign up failed. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useConfirmSignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ username, code }: { username: string; code: string }) => {
      await AuthService.confirmSignUp(username, code);
      return { username };
    },
    onSuccess: () => {
      toast({
        title: "Account confirmed successfully!",
      });
      navigate("/sign-in");
    },
    onError: () => {
      toast({
        title: "Confirmation failed. Please check the code and try again.",
        variant: "destructive",
      });
    },
  });
};

export const useSignIn = () => {
  const { checkAuthUser } = useUserContext(); // Add this
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SignInData) => AuthService.signIn(data),
    onSuccess: async () => {
      await checkAuthUser(); // Add this to update user context
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigate('/');
    },
    onError: () => {
      toast({
        title: "Sign in failed. Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });
};

export const useResendConfirmationCode = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (username: string) => AuthService.resendConfirmationCode(username),
    onSuccess: () => {
      toast({
        title: "Verification code resent successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery<AuthUserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: async (): Promise<AuthUserProfile[]> => {
      try {
        const users = await apiService.getAllUsers();
        return users || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update useCurrentUser hook
export const useCurrentUser = () => {
  return useQuery<AuthUserProfile | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!AuthService.isAuthenticated()) return null;
      try {
        return await apiService.getCurrentUser();

      } catch (error) {
        AuthService.clearTokens();
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};





export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const tokens = AuthService.getTokens();
      if (tokens?.accessToken) {
        await AuthService.signOut(tokens.accessToken);
      }
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/sign-in');
    },
    onError: () => {
      toast({
        title: "Sign out failed. Please try again.",
        variant: "destructive",
      });
    },
  });
};
export const useUserByUsername = (username: string) => {
  return useQuery<AuthUserProfile>({
    queryKey: ['user', username],
    queryFn: () => apiService.getUserByUsername(username),
    enabled: !!username,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<AuthUserProfile>) => apiService.updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast({
        title: "Profile updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Follow related hooks
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => apiService.followUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast({
        title: "Followed successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to follow user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => apiService.unfollowUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast({
        title: "Unfollowed successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to unfollow user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUserFollowers = (userId: string) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => apiService.getFollowers(userId),
    enabled: !!userId,
  });
};

export const useCurrentUserFollowers = () => {
  return useQuery({
    queryKey: ['currentUserFollowers'],
    queryFn: () => apiService.getCurrentUserFollowers(),
  });
};

export const useUserFollowing = (userId: string) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => apiService.getFollowing(userId),
    enabled: !!userId,
  });
};

export const useCurrentUserFollowing = () => {
  return useQuery({
    queryKey: ['currentUserFollowing'],
    queryFn: () => apiService.getCurrentUserFollowing(),
  });
};

// Add this to your hooks file
export const useGetCurrentUserFollowing = () => {
  return useQuery<FollowUser[]>({
    queryKey: ['currentUserFollowing'],
    queryFn: () => apiService.getCurrentUserFollowing(),
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['searchUsers', query],
    queryFn: () => apiService.searchUsers(query),
    enabled: query.length > 0,
  });
};
