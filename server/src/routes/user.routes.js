const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', auth, userController.me);

module.exports = router;

