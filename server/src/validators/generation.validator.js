const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i);

const generateSchema = z.object({
  body: z.object({
    style: z.string().min(2).max(120),
    outputType: z.enum(['2D']).optional().default('2D'),
    count: z.coerce.number().int().min(1).max(12),
  }),
  params: z.object({
    id: objectId,
  }),
  query: z.object({}),
  file: z.any().optional(),
});

const listGenerationsSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: objectId,
  }),
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
  }),
  file: z.any().optional(),
});

module.exports = {
  generateSchema,
  listGenerationsSchema,
};

