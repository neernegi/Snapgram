// src/constants/auth.ts
export const INITIAL_USER = {
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

export const INITIAL_STATE = {
  user: INITIAL_USER,
  userProfile: undefined,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setUserProfile: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};