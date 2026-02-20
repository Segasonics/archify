const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: false,
      default: 'Blueprint Project',
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    blueprintOriginalUrl: {
      type: String,
      default: null,
    },
    blueprintPublicId: {
      type: String,
      default: null,
    },
    blueprintMimeType: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Project', projectSchema);

