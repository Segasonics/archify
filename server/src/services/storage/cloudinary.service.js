const streamifier = require('streamifier');
const cloudinary = require('../../config/cloudinary');
const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');

function assertCloudinaryConfigured() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new ApiError(500, 'Cloudinary is not fully configured', 'CLOUDINARY_CONFIG_ERROR');
  }
}

function uploadBuffer({ buffer, filename, mimetype }) {
  assertCloudinaryConfigured();
  const isPdf = mimetype === 'application/pdf';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: isPdf ? 'raw' : 'image',
        public_id: `${Date.now()}-${filename.replace(/\s+/g, '-')}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

function uploadGeneratedImageBuffer({ buffer, projectId, generationId, index, mimetype = 'image/png' }) {
  assertCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${env.CLOUDINARY_FOLDER}/generations/${projectId}/${generationId}`,
        resource_type: 'image',
        public_id: `render-${index}-${Date.now()}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          mimetype,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = {
  uploadBuffer,
  uploadGeneratedImageBuffer,
};
