import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Add in .env.local
  api_key: process.env.CLOUDINARY_API_KEY,      // Add in .env.local
  api_secret: process.env.CLOUDINARY_API_SECRET // Add in .env.local
});

export default cloudinary;
