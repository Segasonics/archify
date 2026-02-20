const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),
  params: z.object({}),
  query: z.object({}),
  file: z.any().optional(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),
  params: z.object({}),
  query: z.object({}),
  file: z.any().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

