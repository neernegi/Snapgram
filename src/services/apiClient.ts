import { AuthUserProfile, FollowUser } from '@/types/interfaces';
import { AuthService } from './auth';





// const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'https://w6eg4fo7gf.execute-api.ap-south-1.amazonaws.com';


class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let tokens = AuthService.getTokens();

    // Check and refresh token if needed
    if (tokens?.accessToken && AuthService.isTokenExpired(tokens.accessToken)) {
      try {
        const newTokens = await AuthService.refreshToken(tokens.refreshToken);
        AuthService.saveTokens(newTokens);
        tokens = newTokens;
      } catch (error) {
        AuthService.clearTokens();
        window.location.href = '/login';
        throw error;
      }
    }

    console.log(tokens?.accessToken)

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(AuthService.isAuthenticated() ? {
        'Authorization': `Bearer ${AuthService.getTokens()?.accessToken}`
      } : {}),
    };

    console.log(`Making ${options.method || 'GET'} request to: ${url}`);
    console.log('Headers:', headers);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);

      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: errorText || 'Request failed' };
      }

      throw new Error(error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as unknown as T;
    }

    return response.json();
  }

  async getAllUsers(): Promise<AuthUserProfile[]> {
    return this.request<AuthUserProfile[]>('/getAllUsers');
  }

  // User methods
  async getCurrentUser(): Promise<any> {
    return this.request('/users/me');
  }
  async getUserByUsername(username: string): Promise<any> {
    return this.request(`/users/${username}`);
  }

  async updateUserProfile(data: any): Promise<any> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Follow methods
  async followUser(userId: string): Promise<any> {
    return this.request(`/users/me/following`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async unfollowUser(userId: string): Promise<void> {
    return this.request(`/users/me/following/${userId}`, {
      method: 'DELETE',
    });
  }

  async getFollowers(userId: string): Promise<any[]> {
    return this.request(`/users/${userId}/followers`);
  }

  async getCurrentUserFollowers(): Promise<any[]> {
    return this.request('/users/me/followers');
  }

  async getFollowing(userId: string): Promise<any[]> {
    return this.request(`/users/${userId}/following`);
  }

  async getCurrentUserFollowing(): Promise<FollowUser[]> {
    return this.request('/users/me/following');
  }

  // Search methods
  async searchUsers(query: string): Promise<any[]> {
    return this.request(`/users/search?q=${query}`);
  }




  // post management methods---------------------------------------------------------------------------------------------------


  // 0. get all post
  async getAllPost(): Promise<any[]> {
    return this.request('/getAll/posts')
  }


  // 1. Create a new post
  async createPost(data: {
    caption: string;
    images: { base64: string; mimeType: string }[];
  }): Promise<any> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }


  // 2. Get feed posts
  async getFeedPosts(): Promise<any[]> {
    return this.request('/posts/feed');
  }

  // 3. Get posts by a specific user
  async getPostsByUserId(userId: string): Promise<any[]> {
    return this.request(`/posts/user/${userId}`);
  }

  // 4. Get single post by ID
  async getPostById(postId: string): Promise<any> {
    return this.request(`/posts/${postId}`);
  }

  // 5. Update post caption/tags
  async updatePost(postId: string, data: { caption?: string }): Promise<any> {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // 6. Toggle like on a post
  async toggleLike(postId: string): Promise<any> {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  // unlike post
  async unlikePost(postId: string): Promise<any> {
    return this.request(`/posts/${postId}/like`, {
      method: 'DELETE',
    });
  }

  // get like post
  async getLikedPosts(): Promise<any[]> {
    return this.request('/posts/liked');
  }

  // 7. Add comment on a post
  async commentOnPost(
    postId: string,
    comment: string,
    createdAt?: Date | string
  ): Promise<any> {
    const body = {
      text: comment,
      ...(createdAt && { createdAt: new Date(createdAt).toISOString() })
    };

    return this.request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }


  // delete comment
  async deleteComment(postId: string, commentId: string): Promise<void> {
    await this.request(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }



  // 8. Delete a post
  async deletePost(postId: string): Promise<void> {
    await this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Save methods
  async savePost(postId: string): Promise<any> {
    return this.request(`/posts/${postId}/save`, {
      method: 'POST',
    });
  }

  async unsavePost(postId: string): Promise<any> {
    return this.request(`/posts/${postId}/unsave`, {
      method: 'DELETE',
    });
  }

  async getSavedPosts(): Promise<any[]> {
    return this.request('/posts/saved');
  }

}



export const apiService = new ApiService();
