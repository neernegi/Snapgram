import { useMutation } from '@tanstack/react-query';
import { S3Service } from '../services/s3';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
      S3Service.validateImageFile(file);
      const compressedFile = await S3Service.compressImage(file);
      return S3Service.uploadFile(compressedFile, folder);
    },
  });
};

export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
      S3Service.validateImageFile(file);
      const compressedFile = await S3Service.compressImage(file);
      return S3Service.uploadProfileImage(compressedFile, userId);
    },
  });
};

export const useUploadPostImage = () => {
  return useMutation({
    mutationFn: async ({ file, postId }: { file: File; postId: string }) => {
      S3Service.validateImageFile(file);
      const compressedFile = await S3Service.compressImage(file);
      return S3Service.uploadPostImage(compressedFile, postId);
    },
  });
};