const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  CLIENT_URL: z.string().url(),
  CORS_ORIGIN: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().default('archify'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_TEAM: z.string().optional(),
  AI_PROVIDER: z.enum(['mock', 'replicate', 'openai']).default('mock'),
  REPLICATE_API_TOKEN: z.string().optional(),
  REPLICATE_MODEL_VERSION: z.string().optional(),
  REPLICATE_POLL_INTERVAL_MS: z.coerce.number().int().min(500).default(2500),
  REPLICATE_MAX_POLLS: z.coerce.number().int().min(1).default(120),
  REPLICATE_INPUT_IMAGE_KEY: z.string().default('image'),
  REPLICATE_PROMPT_KEY: z.string().default('prompt'),
  REPLICATE_OUTPUT_COUNT_KEY: z.string().default('num_outputs'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_IMAGE_MODEL: z.string().default('gpt-image-1'),
  OPENAI_IMAGE_QUALITY: z.enum(['low', 'medium', 'high']).default('medium'),
  OPENAI_IMAGE_SIZE: z.string().default('1536x1024'),
  OPENAI_TIMEOUT_MS: z.coerce.number().int().min(1000).default(120000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = parsed.data;

