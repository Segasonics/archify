const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const stripeService = require('../services/billing/stripe.service');

const createCheckoutSession = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) {
    throw new ApiError(404, 'User not found', 'NOT_FOUND');
  }

  const session = await stripeService.createCheckoutSession({
    user,
    plan: req.body.plan,
  });

  res.json({
    url: session.url,
    id: session.id,
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) {
    throw new ApiError(404, 'User not found', 'NOT_FOUND');
  }

  res.json({
    plan: user.plan,
    creditsRemaining: user.creditsRemaining,
    stripeCustomerId: user.stripeCustomerId,
    subscriptionStatus: user.plan === 'free' ? 'inactive' : 'active',
  });
});

module.exports = {
  createCheckoutSession,
  me,
};

