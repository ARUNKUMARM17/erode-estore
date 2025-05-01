import express from 'express';
import {
  subscribeToPrime,
  cancelPrimeMembership,
  getPrimeMembershipStatus,
  getSubscriptionPlans,
  createSubscriptionPayment
} from '../controllers/primeController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/plans', getSubscriptionPlans);

// Protected routes
router.route('/subscribe').post(authenticate, subscribeToPrime);
router.route('/cancel').post(authenticate, cancelPrimeMembership);
router.route('/status').get(authenticate, getPrimeMembershipStatus);
router.route('/create-payment-intent').post(authenticate, createSubscriptionPayment);

export default router; 