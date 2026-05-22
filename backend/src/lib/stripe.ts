import Stripe from "stripe";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn("Warning: STRIPE_SECRET_KEY is not defined. Stripe features will not work.");
}

export default stripe;
