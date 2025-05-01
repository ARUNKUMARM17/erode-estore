import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SUBSCRIPTION_PLANS = {
  monthly: {
    duration: 30,
    price: 199,
    name: "Monthly Plan"
  },
  quarterly: {
    duration: 90,
    price: 499,
    name: "Quarterly Plan"
  },
  annual: {
    duration: 365,
    price: 1499,
    name: "Annual Plan"
  }
};

// @desc    Get subscription plans
// @route   GET /api/users/prime/plans
// @access  Public
const getSubscriptionPlans = asyncHandler(async (req, res) => {
  res.json(SUBSCRIPTION_PLANS);
});

// @desc    Create payment intent for Prime subscription
// @route   POST /api/users/prime/create-payment-intent
// @access  Private
const createSubscriptionPayment = asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!SUBSCRIPTION_PLANS[plan]) {
    res.status(400);
    throw new Error("Invalid subscription plan");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: SUBSCRIPTION_PLANS[plan].price * 100, // Convert to paise
    currency: 'inr',
    metadata: {
      userId: req.user._id.toString(),
      plan: plan
    }
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    plan: SUBSCRIPTION_PLANS[plan]
  });
});

// @desc    Subscribe user to Prime membership
// @route   POST /api/users/prime/subscribe
// @access  Private
const subscribeToPrime = asyncHandler(async (req, res) => {
  const { plan, paymentIntentId } = req.body;
  
  if (!SUBSCRIPTION_PLANS[plan]) {
    res.status(400);
    throw new Error("Invalid subscription plan");
  }

  // Verify payment with Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== 'succeeded') {
    res.status(400);
    throw new Error("Payment not successful");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + SUBSCRIPTION_PLANS[plan].duration);

    user.isPrimeMember = true;
    user.primeSubscription = {
      startDate,
      endDate,
      status: 'active',
      plan: plan,
      price: SUBSCRIPTION_PLANS[plan].price
    };

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isPrimeMember: updatedUser.isPrimeMember,
      primeSubscription: updatedUser.primeSubscription
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Cancel Prime membership
// @route   POST /api/users/prime/cancel
// @access  Private
const cancelPrimeMembership = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.isPrimeMember = false;
    user.primeSubscription.status = 'cancelled';

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isPrimeMember: updatedUser.isPrimeMember,
      primeSubscription: updatedUser.primeSubscription
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get Prime membership status
// @route   GET /api/users/prime/status
// @access  Private
const getPrimeMembershipStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      isPrimeMember: user.isPrimeMember,
      primeSubscription: user.primeSubscription
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { 
  subscribeToPrime, 
  cancelPrimeMembership, 
  getPrimeMembershipStatus,
  getSubscriptionPlans,
  createSubscriptionPayment 
}; 