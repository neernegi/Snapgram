import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert single file to URL
export const convertFileToUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

// Convert multiple files to URLs
export const convertFilesToUrls = (files: File[]): string[] => {
  return files.map(file => URL.createObjectURL(file));
};

// Convert file to base64
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:image/jpeg;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};
/*
export const convertFilesToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (data:image/jpeg;base64,)
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};
*/
// Convert multiple files to base64
export const convertFilesToBase64 = async (files: File[]): Promise<Array<{base64: string, mimeType: string}>> => {
  const promises = files.map(async (file) => {
    const base64 = await convertFileToBase64(file);
    return {
      base64,
      mimeType: file.type
    };
  });
  
  return Promise.all(promises);
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file type
export const isValidImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  return validTypes.includes(file.type);
};

// Validate file size (e.g., max 5MB)
export const isValidFileSize = (file: File, maxSizeInMB: number = 5): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Validate multiple files
export const validateFiles = (files: File[]): { valid: File[], errors: string[] } => {
  const valid: File[] = [];
  const errors: string[] = [];
  
  files.forEach((file, index) => {
    if (!isValidImageType(file)) {
      errors.push(`File ${index + 1}: Invalid file type. Only images are allowed.`);
      return;
    }
    
    if (!isValidFileSize(file)) {
      errors.push(`File ${index + 1}: File too large. Maximum size is 5MB.`);
      return;
    }
    
    valid.push(file);
  });
  
  return { valid, errors };
};

// Time formatting
export const formatTimeToNow = (date: Date | string): string => {
  const now = new Date();
  const time = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

// URL validation
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Extract hashtags from text
export const extractHashtags = (text: string): string[] => {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1].toLowerCase());
  }
  
  return [...new Set(hashtags)]; // Remove duplicates
};



export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// 
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};













/*

// lambda/post-confirmation.js
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const tableName = process.env.USERS_TABLE;
  const { email, preferred_username } = event.request.userAttributes;
  
  // Generate a unique user ID
  const userId = event.userName;
  const now = new Date().toISOString();

  const userItem = {
    userId,
    username: preferred_username,
    email,
    fullName: event.request.userAttributes.name || '',
    createdAt: now,
    updatedAt: now,
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    bio: '',
    profileImage: '',
  };

  const params = {
    TableName: tableName,
    Item: userItem,
  };

  try {
    await dynamodb.put(params).promise();
    return event;
  } catch (error) {
    console.error('Error creating user in DynamoDB:', error);
    throw error;
  }
};

*/