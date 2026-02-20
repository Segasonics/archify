const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const passwordService = require('../services/auth/password.service');
const tokenService = require('../services/auth/token.service');
const env = require('../config/env');
const { PLAN_CREDITS } = require('../config/plans');

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function buildAuthPayload(user) {
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      creditsRemaining: user.creditsRemaining,
    },
    accessToken: tokenService.signAccessToken(user),
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, 'Email is already registered', 'EMAIL_IN_USE');
  }

  const passwordHash = await passwordService.hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
    creditsRemaining: PLAN_CREDITS.free,
    plan: 'free',
    role: 'user',
  });

  const refreshToken = tokenService.signRefreshToken(user);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  res.status(201).json(buildAuthPayload(user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const isValidPassword = await passwordService.comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const refreshToken = tokenService.signRefreshToken(user);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);

  res.json(buildAuthPayload(user));
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, 'Refresh token missing', 'UNAUTHORIZED');
  }

  let payload;
  try {
    payload = tokenService.verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'Invalid refresh token', 'UNAUTHORIZED');
  }
  const user = await User.findById(payload.sub);

  if (!user) {
    throw new ApiError(401, 'User not found for refresh token', 'UNAUTHORIZED');
  }

  const newRefreshToken = tokenService.signRefreshToken(user);
  res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

  res.json({
    accessToken: tokenService.signAccessToken(user),
  });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('refreshToken', {
    ...refreshCookieOptions,
    maxAge: undefined,
  });

  res.status(204).send();
});

module.exports = {
  register,
  login,
  refresh,
  logout,
};

