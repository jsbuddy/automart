import { v2 } from 'cloudinary';
import dotenv from 'dotenv';

const { uploader, config } = v2;

dotenv.config();

const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  next();
};

export { cloudinaryConfig, uploader };
