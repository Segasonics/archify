const mongoose = require('mongoose');
const env = require('../config/env');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Generation = require('../models/Generation');
const passwordService = require('../services/auth/password.service');

async function seed() {
  await connectDB();

  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Generation.deleteMany({})]);

  const passwordHash = await passwordService.hashPassword('Password123!');

  const demoUser = await User.create({
    name: 'Demo User',
    email: 'demo@archify.dev',
    passwordHash,
    role: 'user',
    plan: 'pro',
    creditsRemaining: 300,
  });

  const project = await Project.create({
    ownerId: demoUser._id,
    title: 'Downtown Loft Remodel',
    description: 'Initial demo project with blueprint placeholder.',
    blueprintOriginalUrl: 'https://picsum.photos/seed/blueprint-demo/1280/720',
    blueprintPublicId: 'demo-blueprint',
  });

  await Generation.create({
    projectId: project._id,
    ownerId: demoUser._id,
    style: 'Modern Minimal',
    outputType: '3D',
    status: 'succeeded',
    inputBlueprintUrl: project.blueprintOriginalUrl,
    outputImages: Array.from({ length: 6 }, (_, idx) => `https://picsum.photos/seed/render-${idx + 1}/1280/720`),
    requestedCount: 6,
  });

  // eslint-disable-next-line no-console
  console.log('Seed complete. Demo login: demo@archify.dev / Password123!');
}

seed()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

