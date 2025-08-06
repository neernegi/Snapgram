import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth";
import { apiService } from "@/services/apiClient";

// Helper function for date formatting
function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Type Definitions
interface Like {
  userId: string;
  createdAt?: string;
}

interface Comment {
  userId: string;
  text: string;
  createdAt?: string;
  commentId?: string;
  user?: {
    username: string;
    profileImage?: string;
  };
}

interface Post {
  postId: string;
  caption: string;
  images: string[];
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt?: string;
  likes?: Like[];
  comments?: Comment[];
}

interface SavedPost extends Post {
  savedAt: string;
  savedAtFormatted: string;
  owner: {
    userId: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}

interface LikedPost extends Post {
  likedAt: string;
  likedAtFormatted: string;
  owner: {
    userId: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}

interface FollowingFollower {
  userId: string;
  username: string;
  fullName: string;
  profileImage: string;
  createdAt?: string;
}

export interface UserProfile {
  following: FollowingFollower[];
  likedPosts: LikedPost[];
  followers: FollowingFollower[];
  bio: string;
  createdAt: string;
  email: string;
  fullName: string;
  profileImage: string;
  followingCount: number;
  postCount: number;
  updatedAt: string;
  userId: string;
  followerCount: number;
  username: string;
  savedPosts: SavedPost[];
  createdAtFormatted: string;
  posts: Post[];
}

export interface IUser {
  userId: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
}

export const INITIAL_USER: IUser = {
  userId: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
  followerCount: 0,
  followingCount: 0,
  postCount: 0,
};

type IContextType = {
  user: IUser;
  userProfile?: UserProfile;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  userProfile: undefined,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setUserProfile: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const tokens = AuthService.getTokens();
      
      if (!tokens?.accessToken) {
        return false;
      }

      if (AuthService.isTokenExpired(tokens.accessToken)) {
        try {
          const newTokens = await AuthService.refreshToken(tokens.refreshToken);
          AuthService.saveTokens(newTokens);
        } catch (refreshError) {
          AuthService.clearTokens();
          return false;
        }
      }

      const currentTokens = AuthService.getTokens();
      if (!currentTokens?.accessToken) {
        return false;
      }

      const cognitoUser = await AuthService.getCurrentUser(currentTokens.accessToken);
      if (!cognitoUser) {
        AuthService.clearTokens();
        return false;
      }

      const apiUser = await apiService.getCurrentUser();
      if (!apiUser) {
        AuthService.clearTokens();
        return false;
      }
      console.log("api user",apiUser)

      const userData: IUser = {
        userId: apiUser.userId,
        name: apiUser.fullName || apiUser.name || '',
        username: apiUser.username || '',
        email: apiUser.email || '',
        imageUrl: apiUser.profileImage || apiUser.imageUrl || "",
        bio: apiUser.bio || "",
        followerCount: apiUser.followerCount || 0,
        followingCount: apiUser.followingCount || 0,
        postCount: apiUser.postCount || 0,
      };

      const userProfileData: UserProfile = {
        userId: apiUser.userId,
        username: apiUser.username || '',
        email: apiUser.email || '',
        fullName: apiUser.fullName || '',
        profileImage: apiUser.profileImage || '',
        bio: apiUser.bio || '',
        createdAt: apiUser.createdAt || new Date().toISOString(),
        updatedAt: apiUser.updatedAt || new Date().toISOString(),
        createdAtFormatted: apiUser.createdAtFormatted || formatDate(new Date()),
        followerCount: apiUser.followerCount || 0,
        followingCount: apiUser.followingCount || 0,
        postCount: apiUser.postCount || 0,
        followers: (apiUser.followers || []) as FollowingFollower[],
        following: (apiUser.following || []) as FollowingFollower[],
        likedPosts: (apiUser.likedPosts?.map((post: any): LikedPost => ({
          postId: post.postId,
          caption: post.caption || '',
          images: post.images || [],
          tags: post.tags || [],
          likesCount: post.likes?.length || 0,
          commentsCount: post.comments?.length || 0,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          likes: (post.likes || []) as Like[],
          comments: (post.comments || []) as Comment[],
          likedAt: post.likedAt || new Date().toISOString(),
          likedAtFormatted: post.likedAtFormatted || formatDate(new Date(post.likedAt || new Date())),
          owner: {
        userId: post.owner?.userId || apiUser.userId,
        username: post.owner?.username || apiUser.username || '',
        fullName: post.owner?.fullName || apiUser.fullName || '',
        profileImage: post.owner?.profileImage || apiUser.profileImage || ''
          }
        })) || []) as LikedPost[],
        savedPosts: (apiUser.savedPosts?.map((post: any): SavedPost => ({
          postId: post.postId,
          caption: post.caption || '',
          images: post.images || [],
          tags: post.tags || [],
          likesCount: post.likes?.length || 0,
          commentsCount: post.comments?.length || 0,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          likes: (post.likes || []) as Like[],
          comments: (post.comments || []) as Comment[],
          savedAt: post.savedAt || new Date().toISOString(),
          savedAtFormatted: post.savedAtFormatted || formatDate(new Date(post.savedAt || new Date())),
          owner: {
        userId: post.owner?.userId || apiUser.userId,
        username: post.owner?.username || apiUser.username || '',
        fullName: post.owner?.fullName || apiUser.fullName || '',
        profileImage: post.owner?.profileImage || apiUser.profileImage || ''
          }
        })) || []) as SavedPost[],
        posts: (apiUser.posts?.map((post: any): Post => ({
          postId: post.postId,
          caption: post.caption || '',
          images: post.images || [],
          tags: post.tags || [],
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          likes: (post.likes || []) as Like[],
          comments: (post.comments || []) as Comment[]
        })) || []) as Post[]
      };

      // console.log("-- user profile data---",userProfileData)
      setUser(userData);
      setUserProfile(userProfileData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Request failed')) {
        setIsAuthenticated(false);
        return false;
      }
      
      AuthService.clearTokens();
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const authCheck = async () => {
      const isAuth = await checkAuthUser();
      
      if (!isAuth && !['/sign-in', '/sign-up', '/confirm-signup', '/forgot-password'].includes(window.location.pathname)) {
        navigate('/sign-in');
      }
      
      if (isAuth && ['/sign-in', '/sign-up', '/confirm-signup'].includes(window.location.pathname)) {
        navigate('/');
      }
    };

    authCheck();
  }, [navigate, isAuthenticated]);

  const value = {
    user,
    userProfile,
    setUser,
    setUserProfile,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);