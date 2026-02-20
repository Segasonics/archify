const getStripe = require('../config/stripe');
const env = require('../config/env');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');
const { resolvePlanCredits } = require('../services/billing/plan.service');

function inferPlanFromPriceId(priceId) {
  if (priceId === env.STRIPE_PRICE_PRO) {
    return 'pro';
  }

  if (priceId === env.STRIPE_PRICE_TEAM) {
    return 'team';
  }

  return 'free';
}

async function applyPlanByCustomer({ customerId, plan }) {
  if (!customerId) {
    return;
  }

  await User.findOneAndUpdate(
    { stripeCustomerId: customerId },
    {
      $set: {
        plan,
        creditsRemaining: resolvePlanCredits(plan),
      },
    },
  );
}

const handleStripeWebhook = asyncHandler(async (req, res) => {
  const stripe = getStripe();
  const signature = req.headers['stripe-signature'];
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    res.status(200).json({ received: true, skipped: 'no_webhook_secret' });
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    logger.error({ err: error }, 'Invalid Stripe webhook signature');
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const plan = session.metadata?.plan || 'free';
      await applyPlanByCustomer({ customerId: session.customer, plan });
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object;
      const line = invoice.lines?.data?.[0];
      const priceId = line?.price?.id;
      const plan = inferPlanFromPriceId(priceId);
      await applyPlanByCustomer({ customerId: invoice.customer, plan });
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const item = subscription.items?.data?.[0];
      const plan = inferPlanFromPriceId(item?.price?.id);
      await applyPlanByCustomer({ customerId: subscription.customer, plan });
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await applyPlanByCustomer({ customerId: subscription.customer, plan: 'free' });
      break;
    }
    default:
      break;
  }

  res.json({ received: true });
});

module.exports = {
  handleStripeWebhook,
};

