import {loadStripe} from '@stripe/stripe-js'

console.log("Stripe key:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)


