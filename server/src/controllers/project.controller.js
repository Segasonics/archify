const Project = require('../models/Project');
const Generation = require('../models/Generation');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const getPagination = require('../utils/pagination');
const storageService = require('../services/storage/storage.service');

const createProject = asyncHandler(async (req, res) => {
  const generatedTitle = `Blueprint Project ${new Date().toISOString().slice(0, 10)}`;

  const project = await Project.create({
    ownerId: req.user.sub,
    title: req.body.title || generatedTitle,
    description: req.body.description || '',
  });

  res.status(201).json(project);
});

const listProjects = asyncHandler(async (req, res) => {
  const { page, pageSize, skip } = getPagination(req.query);

  const [items, total] = await Promise.all([
    Project.find({ ownerId: req.user.sub }).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    Project.countDocuments({ ownerId: req.user.sub }),
  ]);

  res.json({
    items,
    total,
    page,
    pageSize,
  });
});

const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, ownerId: req.user.sub });
  if (!project) {
    throw new ApiError(404, 'Project not found', 'NOT_FOUND');
  }

  res.json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.sub },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new ApiError(404, 'Project not found', 'NOT_FOUND');
  }

  res.json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, ownerId: req.user.sub });
  if (!project) {
    throw new ApiError(404, 'Project not found', 'NOT_FOUND');
  }

  await Generation.deleteMany({ projectId: req.params.id, ownerId: req.user.sub });

  res.status(204).send();
});

const uploadBlueprint = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, ownerId: req.user.sub });
  if (!project) {
    throw new ApiError(404, 'Project not found', 'NOT_FOUND');
  }

  const allowedMime = ['image/png', 'image/jpeg', 'application/pdf'];
  if (!req.file || !allowedMime.includes(req.file.mimetype)) {
    throw new ApiError(400, 'Invalid file type. Allowed: PNG/JPG/PDF', 'INVALID_FILE_TYPE');
  }

  const upload = await storageService.uploadBlueprint(req.file);

  project.blueprintOriginalUrl = upload.url;
  project.blueprintPublicId = upload.publicId;
  project.blueprintMimeType = req.file.mimetype;
  await project.save();

  res.json({
    blueprintOriginalUrl: project.blueprintOriginalUrl,
    blueprintPublicId: project.blueprintPublicId,
    blueprintMimeType: project.blueprintMimeType,
    project,
  });
});

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  uploadBlueprint,
};

