const { z } = require('zod');

const createCheckoutSchema = z.object({
  body: z.object({
    plan: z.enum(['pro', 'team']),
  }),
  params: z.object({}),
  query: z.object({}),
  file: z.any().optional(),
});

module.exports = {
  createCheckoutSchema,
};

