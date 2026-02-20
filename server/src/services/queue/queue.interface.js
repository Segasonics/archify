class QueueInterface {
  // eslint-disable-next-line class-methods-use-this
  enqueueGeneration(_jobPayload) {
    throw new Error('enqueueGeneration must be implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  onProcess(_handler) {
    throw new Error('onProcess must be implemented');
  }
}

module.exports = QueueInterface;

