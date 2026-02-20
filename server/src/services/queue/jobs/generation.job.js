const Generation = require('../../../models/Generation');
const User = require('../../../models/User');
const aiRenderService = require('../../ai/aiRender.service');

async function processGenerationJob(job) {
  const generation = await Generation.findById(job.generationId);
  if (!generation) {
    return;
  }

  try {
    generation.status = 'running';
    generation.error = null;
    await generation.save();

    const result = await aiRenderService.generateRenders({
      inputUrl: generation.inputBlueprintUrl,
      style: generation.style,
      outputType: generation.outputType,
      count: generation.requestedCount,
      projectId: generation.projectId.toString(),
      generationId: generation._id.toString(),
    });

    generation.status = 'succeeded';
    generation.outputImages = result.images;
    generation.outputImagePublicIds = result.publicIds || [];
    generation.provider = result.provider || null;
    await generation.save();
  } catch (error) {
    generation.status = 'failed';
    generation.error = error.message;
    await generation.save();

    await User.updateOne(
      { _id: generation.ownerId },
      { $inc: { creditsRemaining: generation.requestedCount } },
    );
  }
}

module.exports = {
  processGenerationJob,
};

