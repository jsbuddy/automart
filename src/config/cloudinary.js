import { v2 } from 'cloudinary';
import env from './env';

const { uploader, config } = v2;

const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
  next();
};

export { cloudinaryConfig, uploader };
