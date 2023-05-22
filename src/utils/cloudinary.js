const cloudinary = require('cloudinary').v2;
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = require("../config/config");

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: CLOUD_NAME,
//   api_key: CLOUD_API_KEY,
//   api_secret: CLOUD_API_SECRET
// });

const uploadImage = async (filePath, folder) => {
  return await cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
    folder: `Home/images`
  });
};

const uploadGif = async (filePath, folder) => {
  return await cloudinary.uploader.upload(filePath, {
    resource_type: 'auto',
    folder: `Home/gifs`
  });
};


async function uploadImageFromFormData(formData) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
  
      formData.pipe(stream);
    });
  }


module.exports = {
  uploadImage,
  uploadImageFromFormData,
  uploadGif
};
