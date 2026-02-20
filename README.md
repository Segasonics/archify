# Archify

Production-ready MERN SaaS starter for blueprint-to-render workflows.

## Stack
- Frontend: React + Vite (JavaScript), TailwindCSS, Redux Toolkit + RTK Query, React Router
- Backend: Node.js + Express (JavaScript), MongoDB + Mongoose
- Auth: JWT access token + refresh token cookie (HttpOnly + Secure in production)
- File uploads: Cloudinary (PNG/JPG/PDF)
- Billing: Stripe subscriptions (Free/Pro/Team)
- AI: Provider abstraction (`mock`, `replicate`, `openai`) with production OpenAI image-edit path
- Queue: In-process queue with BullMQ-ready interface

## Monorepo Layout
- `client/` React app
- `server/` Express API

## Quick Start
1. Install dependencies
```bash
npm install
```
2. Configure env files
- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`
3. Start both apps
```bash
npm run dev
```
- API: `http://localhost:5000`
- Client: `http://localhost:5173`

## Scripts
- `npm run dev` start client + server
- `npm run dev:server` start API only
- `npm run dev:client` start UI only
- `npm run lint` lint both workspaces
- `npm run test` run server + client tests
- `npm run seed` seed demo data

## API Endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

### User
- `GET /api/users/me`

### Projects
- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/upload-blueprint`
- `POST /api/projects/:id/generate`
- `GET /api/projects/:id/generations`

### Billing
- `POST /api/billing/create-checkout-session`
- `POST /api/billing/webhook`
- `GET /api/billing/me`

## Stripe Local Webhook Testing
```bash
stripe listen --forward-to localhost:5000/api/billing/webhook
```
Set the generated secret in `STRIPE_WEBHOOK_SECRET`.

## Plan Credits
- Free: `20/month`
- Pro: `300/month`
- Team: `1200/month`

## Connect Real AI Generation (OpenAI, 2D Photoreal)
1. In `server/.env` set:
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-xxx
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_QUALITY=medium
OPENAI_IMAGE_SIZE=1536x1024
OPENAI_TIMEOUT_MS=120000
```
2. Restart server.

Implementation files:
- Provider: `server/src/services/ai/providers/openai.provider.js`
- Provider selector: `server/src/services/ai/aiRender.service.js`
- Cloudinary persistence for outputs: `server/src/services/storage/storage.service.js`

Notes:
- Generation is 2D-only for new jobs.
- The uploaded blueprint image is used as edit/reference input.
- Generated outputs are uploaded to Cloudinary and stored as durable URLs in generation history.
- PDF blueprints are not supported for OpenAI generation without PDF-to-image preprocessing.

## Optional Real AI Generation (Replicate)
1. Pick an image-to-image Replicate model/version that accepts:
- blueprint image URL input
- text prompt input
- output count input
2. In `server/.env` set:
```bash
AI_PROVIDER=replicate
REPLICATE_API_TOKEN=r8_xxx
REPLICATE_MODEL_VERSION=<model_version_id>
REPLICATE_INPUT_IMAGE_KEY=image
REPLICATE_PROMPT_KEY=prompt
REPLICATE_OUTPUT_COUNT_KEY=num_outputs
REPLICATE_POLL_INTERVAL_MS=2500
REPLICATE_MAX_POLLS=120
```
3. Restart server.

Implementation files:
- Provider: `server/src/services/ai/providers/replicate.provider.js`
- Provider selector: `server/src/services/ai/aiRender.service.js`

Notes:
- The blueprint uploaded to Cloudinary is passed as the input image URL.
- Prompt is generated from selected style with 2D photoreal constraints.
- If your chosen model uses different input field names, change the `REPLICATE_*_KEY` env vars.
- For `AI_PROVIDER=replicate`, PNG/JPG blueprints are supported directly. PDF requires conversion to image first.

## Seed Demo Data
```bash
npm run seed
```
Default demo credentials:
- Email: `demo@archify.dev`
- Password: `Password123!`

## Production Notes
- Set strict CORS allowlist via `CORS_ORIGIN`
- Use strong JWT secrets and HTTPS
- Configure Cloudinary + Stripe live keys
- Replace in-memory queue with BullMQ/Redis via `server/src/services/queue`
  - Keep `queue.interface.js` contract (`enqueueGeneration`, `onProcess`) unchanged
  - Add a Redis-backed worker process without changing controller/service APIs
- Add observability (APM/tracing) and CI checks before go-live

# archify
