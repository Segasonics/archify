const Generation = require('../models/Generation');
const Project = require('../models/Project');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const getPagination = require('../utils/pagination');
const queue = require('../services/queue/inMemory.queue');
const env = require('../config/env');

const generate = asyncHandler(async (req, res) => {
  const { style, count } = req.body;
  const outputType = req.body.outputType || '2D';

  const project = await Project.findOne({ _id: req.params.id, ownerId: req.user.sub });
  if (!project) {
    throw new ApiError(404, 'Project not found', 'NOT_FOUND');
  }

  if (outputType !== '2D') {
    throw new ApiError(400, 'Only 2D generation is supported', 'VALIDATION_ERROR');
  }

  if (!project.blueprintOriginalUrl) {
    throw new ApiError(400, 'Upload a blueprint before generating renders', 'BLUEPRINT_REQUIRED');
  }

  if (
    (env.AI_PROVIDER === 'replicate' || env.AI_PROVIDER === 'openai') &&
    project.blueprintMimeType === 'application/pdf'
  ) {
    throw new ApiError(
      400,
      'PDF blueprint is not supported by current AI provider. Upload PNG/JPG or add PDF-to-image conversion.',
      'UNSUPPORTED_BLUEPRINT_FORMAT',
    );
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.sub, creditsRemaining: { $gte: count } },
    { $inc: { creditsRemaining: -count } },
    { new: true },
  );

  if (!user) {
    throw new ApiError(402, 'Insufficient generation credits', 'INSUFFICIENT_CREDITS');
  }

  const generation = await Generation.create({
    projectId: project._id,
    ownerId: req.user.sub,
    style,
    outputType,
    status: 'queued',
    inputBlueprintUrl: project.blueprintOriginalUrl,
    outputImages: [],
    requestedCount: count,
  });

  queue.enqueueGeneration({
    generationId: generation._id.toString(),
  });

  res.status(202).json({
    id: generation._id,
    status: generation.status,
    projectId: generation.projectId,
    requestedCount: generation.requestedCount,
    creditsRemaining: user.creditsRemaining,
  });
});

const listGenerations = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, ownerId: req.user.sub });
  if (!project) {
    throw new ApiError(404, 'Project not found', 'NOT_FOUND');
  }

  const { page, pageSize, skip } = getPagination(req.query);

  const [items, total] = await Promise.all([
    Generation.find({ projectId: project._id, ownerId: req.user.sub })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Generation.countDocuments({ projectId: project._id, ownerId: req.user.sub }),
  ]);

  res.json({
    items,
    total,
    page,
    pageSize,
  });
});

module.exports = {
  generate,
  listGenerations,
};

