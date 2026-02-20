const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub).select('-passwordHash');
  if (!user) {
    throw new ApiError(404, 'User not found', 'NOT_FOUND');
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    creditsRemaining: user.creditsRemaining,
    stripeCustomerId: user.stripeCustomerId,
  });
});

module.exports = {
  me,
};

