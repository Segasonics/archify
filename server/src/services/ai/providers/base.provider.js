class BaseAiProvider {
  // eslint-disable-next-line class-methods-use-this
  async generate() {
    throw new Error('generate() must be implemented by provider');
  }
}

module.exports = BaseAiProvider;

