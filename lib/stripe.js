import Stripe from "stripe";
export const stripegff = new Stripe(process.env.STRIPE_SECRET_KEY);
