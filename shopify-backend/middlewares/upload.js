import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
   cloudinary,
    params: {
        folder: 'shopify-backend',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    },
})


const upload = multer({ storage });

export default upload;