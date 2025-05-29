// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'uploads',
//         allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
//     },
// });

// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB
// });

// module.exports = upload;