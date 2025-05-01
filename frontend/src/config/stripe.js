import { loadStripe } from '@stripe/stripe-js';

// Make sure we're using the correct publishable key
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey || publishableKey === 'undefined') {
  console.error('Stripe publishable key is missing or undefined!');
}

console.log('Initializing Stripe with key (first few chars):', 
  publishableKey ? publishableKey.substring(0, 8) + '...' : 'missing');

const stripePromise = loadStripe(publishableKey);

export default stripePromise; 