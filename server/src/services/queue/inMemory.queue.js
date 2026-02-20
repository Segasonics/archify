const QueueInterface = require('./queue.interface');
const logger = require('../../config/logger');

class InMemoryQueue extends QueueInterface {
  constructor() {
    super();
    this.jobs = [];
    this.processing = false;
    this.handler = null;
  }

  onProcess(handler) {
    this.handler = handler;
  }

  enqueueGeneration(jobPayload) {
    this.jobs.push(jobPayload);
    this.#drain();
  }

  async #drain() {
    if (this.processing || !this.handler) {
      return;
    }

    this.processing = true;

    while (this.jobs.length) {
      const job = this.jobs.shift();
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.handler(job);
      } catch (error) {
        logger.error({ err: error, job }, 'In-memory queue job failed');
      }
    }

    this.processing = false;
  }
}

module.exports = new InMemoryQueue();

