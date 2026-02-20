const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const projectController = require('../controllers/project.controller');
const generationController = require('../controllers/generation.controller');
const {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
  listProjectsSchema,
} = require('../validators/project.validator');
const {
  generateSchema,
  listGenerationsSchema,
} = require('../validators/generation.validator');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

const router = express.Router();

router.get('/', auth, validate(listProjectsSchema), projectController.listProjects);
router.post('/', auth, validate(createProjectSchema), projectController.createProject);
router.get('/:id', auth, validate(projectIdSchema), projectController.getProject);
router.patch('/:id', auth, validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', auth, validate(projectIdSchema), projectController.deleteProject);

router.post(
  '/:id/upload-blueprint',
  auth,
  upload.single('file'),
  validate(projectIdSchema),
  projectController.uploadBlueprint,
);

router.post('/:id/generate', auth, validate(generateSchema), generationController.generate);
router.get('/:id/generations', auth, validate(listGenerationsSchema), generationController.listGenerations);

module.exports = router;

