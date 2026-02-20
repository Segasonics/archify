const { generateSchema } = require('../validators/generation.validator');

describe('generation.validator', () => {
  it('defaults outputType to 2D when omitted', () => {
    const result = generateSchema.safeParse({
      body: {
        style: 'Modern Minimal',
        count: 4,
      },
      params: {
        id: '507f1f77bcf86cd799439011',
      },
      query: {},
      file: undefined,
    });

    expect(result.success).toBe(true);
    expect(result.data.body.outputType).toBe('2D');
  });

  it('rejects outputType=3D', () => {
    const result = generateSchema.safeParse({
      body: {
        style: 'Modern Minimal',
        outputType: '3D',
        count: 4,
      },
      params: {
        id: '507f1f77bcf86cd799439011',
      },
      query: {},
      file: undefined,
    });

    expect(result.success).toBe(false);
  });
});
