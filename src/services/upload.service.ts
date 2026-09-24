import { api } from './api';
import { ApiResponse } from '../types';

export interface UploadResult {
  url: string;
  publicId?: string;
}

export const uploadService = {
  async uploadImage(file: File, folder = 'gayabtp/profiles'): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await api.post<ApiResponse<UploadResult>>('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Échec du téléversement vers Cloudinary.');
    } catch (error) {
      // Secours local Data URL si le serveur ou Cloudinary est inaccessible
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ url: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    }
  },
};
