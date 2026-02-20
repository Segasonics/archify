const ApiError = require('../../utils/ApiError');
const cloudinaryService = require('./cloudinary.service');

async function uploadBlueprint(file) {
  if (!file) {
    throw new ApiError(400, 'No file uploaded', 'FILE_REQUIRED');
  }

  return cloudinaryService.uploadBuffer({
    buffer: file.buffer,
    filename: file.originalname,
    mimetype: file.mimetype,
  });
}

async function uploadGeneratedOutput({ buffer, mimetype = 'image/png', projectId, generationId, index }) {
  return cloudinaryService.uploadGeneratedImageBuffer({
    buffer,
    mimetype,
    projectId,
    generationId,
    index,
  });
}

module.exports = {
  uploadBlueprint,
  uploadGeneratedOutput,
};

