const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const billingController = require('../controllers/billing.controller');
const { createCheckoutSchema } = require('../validators/billing.validator');

const router = express.Router();

router.get('/me', auth, billingController.me);
router.post(
  '/create-checkout-session',
  auth,
  validate(createCheckoutSchema),
  billingController.createCheckoutSession,
);

module.exports = router;

