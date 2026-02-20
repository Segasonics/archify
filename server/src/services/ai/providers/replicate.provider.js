const BaseAiProvider = require('./base.provider');
const env = require('../../../config/env');

const REPLICATE_API_BASE = 'https://api.replicate.com/v1';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPrompt({ style, outputType }) {
  if (outputType === '2D') {
    return `Transform this architectural blueprint into a polished 2D architectural render with clear room zoning and ${style} style cues.`;
  }

  return `Transform this architectural blueprint into a photorealistic 3D interior/exterior render, modern fully furnished, ${style} style.`;
}

function collectImageUrls(value, results = []) {
  if (!value) {
    return results;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, results));
    return results;
  }

  if (typeof value === 'string') {
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')) {
      results.push(value);
    }
    return results;
  }

  if (typeof value === 'object') {
    Object.values(value).forEach((item) => collectImageUrls(item, results));
  }

  return results;
}

class ReplicateProvider extends BaseAiProvider {
  constructor() {
    super();
    if (!env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is required when AI_PROVIDER=replicate');
    }
    if (!env.REPLICATE_MODEL_VERSION) {
      throw new Error('REPLICATE_MODEL_VERSION is required when AI_PROVIDER=replicate');
    }
  }

  async #request(path, { method = 'GET', body } = {}) {
    const response = await fetch(`${REPLICATE_API_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Token ${env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        errorBody = '';
      }
      throw new Error(`Replicate request failed (${response.status}): ${errorBody || response.statusText}`);
    }

    return response.json();
  }

  async #waitForCompletion(predictionId) {
    for (let poll = 0; poll < env.REPLICATE_MAX_POLLS; poll += 1) {
      const prediction = await this.#request(`/predictions/${predictionId}`);

      if (prediction.status === 'succeeded') {
        return prediction;
      }

      if (prediction.status === 'failed' || prediction.status === 'canceled') {
        throw new Error(prediction.error || `Replicate prediction ${prediction.status}`);
      }

      // queued or processing
      // eslint-disable-next-line no-await-in-loop
      await sleep(env.REPLICATE_POLL_INTERVAL_MS);
    }

    throw new Error('Replicate prediction timed out');
  }

  async generate({ inputUrl, style, outputType, count }) {
    const prompt = buildPrompt({ style, outputType });
    const input = {
      [env.REPLICATE_INPUT_IMAGE_KEY]: inputUrl,
      [env.REPLICATE_PROMPT_KEY]: prompt,
      [env.REPLICATE_OUTPUT_COUNT_KEY]: count,
    };

    const prediction = await this.#request('/predictions', {
      method: 'POST',
      body: {
        version: env.REPLICATE_MODEL_VERSION,
        input,
      },
    });

    const completed = await this.#waitForCompletion(prediction.id);
    const images = collectImageUrls(completed.output).slice(0, count);

    if (!images.length) {
      throw new Error('Replicate did not return image URLs');
    }

    return {
      provider: 'replicate',
      inputUrl,
      images,
    };
  }
}

module.exports = ReplicateProvider;
