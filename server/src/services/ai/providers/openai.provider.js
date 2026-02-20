const OpenAI = require('openai');
const BaseAiProvider = require('./base.provider');
const env = require('../../../config/env');
const storageService = require('../../storage/storage.service');

let toFile;
try {
  ({ toFile } = require('openai/uploads'));
} catch {
  ({ toFile } = require('openai'));
}

function buildPrompt(style) {
  return [
    'Transform this uploaded 2D floor plan into a photorealistic architectural render image.',
    'Preserve room adjacency, wall positions, and door/window placement from the source floor plan.',
    'Keep a top-down or isometric interior-visualization framing with realistic lighting and materials.',
    `Apply this design style: ${style}.`,
    'Do not alter structural layout, do not invent extra rooms, and do not produce blueprint line art.',
  ].join(' ');
}

async function downloadImageBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download blueprint image (${response.status})`);
  }

  const mimetype = (response.headers.get('content-type') || 'image/png').split(';')[0];
  if (!mimetype.startsWith('image/')) {
    throw new Error('Blueprint source is not an image URL');
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    mimetype,
  };
}

async function resolveImageBufferFromItem(item) {
  if (!item) {
    return null;
  }

  if (item.b64_json) {
    return {
      buffer: Buffer.from(item.b64_json, 'base64'),
      mimetype: 'image/png',
    };
  }

  const imageUrl = item.url || item.image_url?.url || item.image_url;
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAI image URL (${response.status})`);
    }
    const mimetype = (response.headers.get('content-type') || 'image/png').split(';')[0];
    const arrayBuffer = await response.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      mimetype,
    };
  }

  return null;
}

class OpenAIProvider extends BaseAiProvider {
  constructor() {
    super();
    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required when AI_PROVIDER=openai');
    }

    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      timeout: env.OPENAI_TIMEOUT_MS,
    });
  }

  async #generateSingleRender({ sourceImage, prompt }) {
    const file = await toFile(sourceImage.buffer, 'blueprint-input.png', {
      type: sourceImage.mimetype || 'image/png',
    });

    const response = await this.client.images.edit({
      model: env.OPENAI_IMAGE_MODEL,
      image: file,
      prompt,
      quality: env.OPENAI_IMAGE_QUALITY,
      size: env.OPENAI_IMAGE_SIZE,
    });

    const first = response?.data?.[0] || null;
    if (!first) {
      throw new Error('OpenAI image response did not include any image output');
    }

    const image = await resolveImageBufferFromItem(first);
    if (!image?.buffer) {
      throw new Error('Unable to parse OpenAI image response');
    }

    return image;
  }

  async generate({ inputUrl, style, outputType, count, projectId, generationId }) {
    if (outputType !== '2D') {
      throw new Error('OpenAI provider only supports 2D output mode');
    }

    const sourceImage = await downloadImageBuffer(inputUrl);
    const prompt = buildPrompt(style);
    const images = [];
    const publicIds = [];

    for (let index = 0; index < count; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      const rendered = await this.#generateSingleRender({ sourceImage, prompt });
      // eslint-disable-next-line no-await-in-loop
      const uploaded = await storageService.uploadGeneratedOutput({
        buffer: rendered.buffer,
        mimetype: rendered.mimetype,
        projectId,
        generationId,
        index: index + 1,
      });

      images.push(uploaded.url);
      publicIds.push(uploaded.publicId);
    }

    return {
      provider: 'openai',
      inputUrl,
      images,
      publicIds,
    };
  }
}

module.exports = OpenAIProvider;
