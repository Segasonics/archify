function setRequiredEnv() {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '5002';
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/archify_test';
  process.env.JWT_ACCESS_SECRET = 'test_access_secret_123456';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_123456';
  process.env.CLIENT_URL = 'http://localhost:5173';
  process.env.CORS_ORIGIN = 'http://localhost:5173';
  process.env.OPENAI_API_KEY = 'sk-test-key';
  process.env.OPENAI_IMAGE_MODEL = 'gpt-image-1';
  process.env.OPENAI_IMAGE_QUALITY = 'medium';
  process.env.OPENAI_IMAGE_SIZE = '1024x1024';
  process.env.OPENAI_TIMEOUT_MS = '120000';
}

describe('OpenAIProvider', () => {
  afterEach(() => {
    delete global.fetch;
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('uploads generated outputs to Cloudinary-backed storage and returns durable URLs', async () => {
    setRequiredEnv();

    const mockEdit = jest.fn();
    const mockUploadGeneratedOutput = jest.fn();
    const mockToFile = jest.fn(async () => ({ mockedFile: true }));

    jest.doMock(
      'openai',
      () =>
        jest.fn().mockImplementation(() => ({
          images: {
            edit: mockEdit,
          },
        })),
      { virtual: true },
    );
    jest.doMock(
      'openai/uploads',
      () => ({
        toFile: (...args) => mockToFile(...args),
      }),
      { virtual: true },
    );
    jest.doMock('../services/storage/storage.service', () => ({
      uploadGeneratedOutput: (...args) => mockUploadGeneratedOutput(...args),
    }));

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'image/png',
      },
      arrayBuffer: async () => Buffer.from('blueprint-source'),
    });

    mockEdit.mockResolvedValue({
      data: [
        {
          b64_json: Buffer.from('rendered-image').toString('base64'),
        },
      ],
    });
    mockUploadGeneratedOutput.mockImplementation(async ({ index }) => ({
      url: `https://cdn.example.com/render-${index}.png`,
      publicId: `render-${index}`,
    }));

    const OpenAIProvider = require('../services/ai/providers/openai.provider');
    const provider = new OpenAIProvider();
    const result = await provider.generate({
      inputUrl: 'https://example.com/blueprint.png',
      style: 'Modern Minimal',
      outputType: '2D',
      count: 2,
      projectId: 'project123',
      generationId: 'gen456',
    });

    expect(mockEdit).toHaveBeenCalledTimes(2);
    expect(mockUploadGeneratedOutput).toHaveBeenCalledTimes(2);
    expect(result.provider).toBe('openai');
    expect(result.images).toEqual([
      'https://cdn.example.com/render-1.png',
      'https://cdn.example.com/render-2.png',
    ]);
    expect(result.publicIds).toEqual(['render-1', 'render-2']);
  });

  it('rejects non-2D output type', async () => {
    setRequiredEnv();

    jest.doMock(
      'openai',
      () =>
        jest.fn().mockImplementation(() => ({
          images: { edit: jest.fn() },
        })),
      { virtual: true },
    );
    jest.doMock(
      'openai/uploads',
      () => ({
        toFile: jest.fn(),
      }),
      { virtual: true },
    );
    jest.doMock('../services/storage/storage.service', () => ({
      uploadGeneratedOutput: jest.fn(),
    }));

    const OpenAIProvider = require('../services/ai/providers/openai.provider');
    const provider = new OpenAIProvider();

    await expect(
      provider.generate({
        inputUrl: 'https://example.com/blueprint.png',
        style: 'Modern Minimal',
        outputType: '3D',
        count: 1,
        projectId: 'project123',
        generationId: 'gen456',
      }),
    ).rejects.toThrow('only supports 2D');
  });
});
