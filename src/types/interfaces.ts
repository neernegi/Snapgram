
export interface Like {
  userId: string;
  createdAt?: string;
}

export interface Comment {
  userId: string;
  text: string;
  createdAt?: string;
  commentId?: string;
  user?: {
    username: string;
    profileImage?: string;
  };
}



export interface Post {
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
  owner?: {
    userId: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}

export interface SavedPost extends Post {
  savedAt: string;
  savedAtFormatted: string;
  owner: {
    userId: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}

export interface LikedPost extends Post {
  likedAt: string;
  likedAtFormatted: string;
  owner: {
    userId: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}


export interface ProfileUser {
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
}


export interface GridPostListProps {
  posts: {
    postId: string;
    images: string[];
    caption?: string;
    userId: string;
    likes: { userId: string; createdAt: string }[];
    comments: { userId: string; text: string; createdAt: string }[];
    tags: string[];
    createdAt: string;
    user?: {
      userId: string;
      username: string;
      profileImage?: string;
      displayName?: string;
    };
  }[];
  showUser?: boolean;
  showStats?: boolean;
  currentUser?: {
    userId: string;
    savedPosts?: string[];
  };
}


export interface CommentItem {
  commentId: string;
  text: string;
  createdAt: string | Date;
  owner: {
    userId: string;
    username: string;
    profileImage?: string;
  };
}

export interface PostCardProps {
  post: {
    postId: string;
    userId: string;
    caption: string;
    images: string[];
    tags: string[];
    likes: { userId: string; createdAt: string }[];
    comments: CommentItem[];
    createdAt: string;
    user?: {
      userId: string;
      username: string;
      profileImage?: string;
      displayName?: string;
    };
  }
  currentUser?: {
    savedPosts?: string[];
    profileImage?: string;
    userId: string;
    username: string;
    displayName?: string;
  };
}



export interface FollowingFollower {
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


export interface FollowUser {
  userId: string;
  username: string;
  fullName?: string;
  profileImage?: string;
  createdAt?: string;
}




export interface AuthUserProfile {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  bio?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  following?: FollowUser[];
  followers?: FollowUser[];
  followingCount?: number;
  followerCount?: number;
  postCount?: number
}

