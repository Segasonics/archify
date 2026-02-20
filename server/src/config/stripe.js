const Stripe = require('stripe');
const env = require('./env');

let stripeClient = null;

function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

module.exports = getStripe;

