import Stripe from "stripe";

// Only throw error if stripe is actually needed (when creating payment intents)
// This allows the server to start without stripe key for development
let stripe = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn("Warning: STRIPE_SECRET_KEY is not defined. Stripe features will not work.");
}

export default stripe;