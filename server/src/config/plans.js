const PLAN_CREDITS = {
  free: 20,
  pro: 300,
  team: 1200,
};

const PLAN_PRICE_MAP = {
  pro: 'STRIPE_PRICE_PRO',
  team: 'STRIPE_PRICE_TEAM',
};

module.exports = {
  PLAN_CREDITS,
  PLAN_PRICE_MAP,
};

