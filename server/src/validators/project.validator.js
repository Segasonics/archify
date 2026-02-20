const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i);

const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(180).optional(),
    description: z.string().max(2000).optional().default(''),
  }),
  params: z.object({}),
  query: z.object({}),
  file: z.any().optional(),
});

const updateProjectSchema = z.object({
  body: z
    .object({
      title: z.string().min(2).max(180).optional(),
      description: z.string().max(2000).optional(),
    })
    .refine((v) => v.title || v.description !== undefined, {
      message: 'At least one field is required',
    }),
  params: z.object({
    id: objectId,
  }),
  query: z.object({}),
  file: z.any().optional(),
});

const projectIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: objectId,
  }),
  query: z.object({}),
  file: z.any().optional(),
});

const listProjectsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
  }),
  file: z.any().optional(),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
  listProjectsSchema,
};

