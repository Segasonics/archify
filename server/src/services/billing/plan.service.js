const { PLAN_CREDITS } = require('../../config/plans');

function resolvePlanCredits(plan) {
  return PLAN_CREDITS[plan] ?? PLAN_CREDITS.free;
}

async function setPlan(user, plan) {
  user.plan = plan;
  user.creditsRemaining = resolvePlanCredits(plan);
  await user.save();
}

module.exports = {
  resolvePlanCredits,
  setPlan,
};

