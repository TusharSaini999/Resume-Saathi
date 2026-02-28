import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import ApiError from './apiError';

class Cloudinary {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async fileUpload(file, folderName = 'resume_saathi') {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
        resource_type: 'auto', // auto detect image/video
      });

      // Remove file from local storage after upload
      fs.unlinkSync(file.path);

      return result; // contains secure_url, public_id etc.
    } catch (error) {
      // Delete file if upload fails
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new ApiError(500, 'File upload failed', [], error.stack);
    }
  }

  async deleteFile(public_id) {
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      return result;
    } catch (error) {
      throw new ApiError(500, 'File deletion failed', [], error.stack);
    }
  }
  async replaceFile(oldPublicId, newFile, folderName = 'uploads') {
    try {
      if (!newFile) {
        throw new ApiError(400, 'No new file provided for replacement');
      }

      // Delete old file if exists
      if (oldPublicId) {
        await this.deleteFile(oldPublicId);
      }

      // Upload new file
      const uploadedFile = await this.fileUpload(newFile, folderName);

      return uploadedFile;
    } catch (error) {
      throw new ApiError(500, 'File replacement failed', [], error.stack);
    }
  }
}

export default new Cloudinary();
