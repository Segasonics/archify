const env = require('../../config/env');
const MockProvider = require('./providers/mock.provider');
const ReplicateProvider = require('./providers/replicate.provider');
const OpenAIProvider = require('./providers/openai.provider');

function buildProviderMap() {
  const providers = {
    mock: new MockProvider(),
  };

  if (env.AI_PROVIDER === 'replicate') {
    providers.replicate = new ReplicateProvider();
  }

  if (env.AI_PROVIDER === 'openai') {
    providers.openai = new OpenAIProvider();
  }

  return providers;
}

const providerMap = buildProviderMap();

function getAiProvider() {
  const provider = providerMap[env.AI_PROVIDER];
  if (!provider) {
    throw new Error(`Unsupported AI provider: ${env.AI_PROVIDER}`);
  }
  return provider;
}

async function generateRenders(payload) {
  const provider = getAiProvider();
  return provider.generate(payload);
}

module.exports = {
  generateRenders,
};

