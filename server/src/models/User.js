const mongoose = require('mongoose');
const { PLAN_CREDITS } = require('../config/plans');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'team'],
      default: 'free',
    },
    creditsRemaining: {
      type: Number,
      default: PLAN_CREDITS.free,
      min: 0,
    },
    stripeCustomerId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);

