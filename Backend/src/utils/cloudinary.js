import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import ApiError from './ApiError.js';

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
        resource_type: 'raw', // auto detect image/video
        format: "pdf",
      });
      // Remove file from local storage after upload
      fs.unlinkSync(file.path);

      return result; // contains secure_url, public_id etc.
    } catch (error) {
      // Delete file if upload fails
      console.error('Cloudinary upload failed:', error);
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new ApiError(500, 'File upload failed', [], error.stack);
    }
  }
}

export default new Cloudinary();
