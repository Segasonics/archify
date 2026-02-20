const env = require('../../config/env');
const getStripe = require('../../config/stripe');
const { PLAN_PRICE_MAP } = require('../../config/plans');
const ApiError = require('../../utils/ApiError');

function getPriceIdForPlan(plan) {
  const envKey = PLAN_PRICE_MAP[plan];
  if (!envKey || !env[envKey]) {
    throw new ApiError(400, `Stripe price is not configured for plan: ${plan}`, 'STRIPE_CONFIG_ERROR');
  }

  return env[envKey];
}

async function createCustomerIfMissing(user) {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user._id.toString(),
    },
  });

  user.stripeCustomerId = customer.id;
  await user.save();
  return customer.id;
}

async function createCheckoutSession({ user, plan }) {
  const stripe = getStripe();
  const customerId = await createCustomerIfMissing(user);
  const priceId = getPriceIdForPlan(plan);

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${env.CLIENT_URL}/billing?checkout=success`,
    cancel_url: `${env.CLIENT_URL}/billing?checkout=cancel`,
    metadata: {
      plan,
      userId: user._id.toString(),
    },
  });
}

module.exports = {
  createCustomerIfMissing,
  createCheckoutSession,
  getPriceIdForPlan,
};

