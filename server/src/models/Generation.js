const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    style: {
      type: String,
      required: true,
      trim: true,
    },
    outputType: {
      type: String,
      enum: ['2D', '3D'],
      required: true,
    },
    status: {
      type: String,
      enum: ['queued', 'running', 'succeeded', 'failed'],
      default: 'queued',
      index: true,
    },
    inputBlueprintUrl: {
      type: String,
      required: true,
    },
    outputImages: {
      type: [String],
      default: [],
    },
    outputImagePublicIds: {
      type: [String],
      default: [],
    },
    provider: {
      type: String,
      default: null,
    },
    requestedCount: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

generationSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('Generation', generationSchema);

