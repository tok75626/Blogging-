import { put } from '@vercel/blob';

class StorageService {
  /**
   * Uploads a file to Vercel Blob storage
   * @param {File | Buffer} file - The file to upload
   * @param {string} filename - The name to save as
   */
  static async upload(file, filename) {
    try {
      const blob = await put(filename, file, {
        access: 'public',
      });
      return blob.url;
    } catch (error) {
      console.error('Upload failed:', error.message);
      throw new Error('Storage upload failed.');
    }
  }
}

export default StorageService;
