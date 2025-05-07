import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { updatePrimeStatus } from '../redux/features/auth/authSlice';

const PrimeMembership = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.isPrimeMember) {
      navigate('/shop');
      toast.info('You are already a Prime member!');
    } else {
      if(!userInfo){
        toast.error('Please login to continue');
        navigate('/');
      }
    
      fetchPlans();
      
    }
  }, [userInfo, navigate]);

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/users/prime/plans');
      setPlans([
        { id: 'monthly', ...data.monthly },
        { id: 'quarterly', ...data.quarterly },
        { id: 'annual', ...data.annual },
      ]);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setProcessing(true);

      // Create payment intent
      const { data } = await axios.post('/api/users/prime/create-payment-intent', {
        plan: selectedPlan.id
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: userInfo.username,
            email: userInfo.email,
          },
        },
      });

      if (error) {
        toast.error(error?.message);
      } else {
        // Subscribe user to prime
        const { data: subscriptionData } = await axios.post('/api/users/prime/subscribe', {
          plan: selectedPlan.id,
          paymentIntentId: paymentIntent.id,
        });

        // Update Redux state with new Prime status
        dispatch(updatePrimeStatus({
          isPrimeMember: true,
          primeSubscription: subscriptionData.primeSubscription
        }));

        toast.success('Successfully subscribed to Prime!');
        setShowPaymentForm(false);
        navigate('/shop'); // Redirect to shop page after successful subscription
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Join Prime Membership</h1>
        <p className="text-xl text-gray-600">Enjoy exclusive discounts and benefits</p>
      </div>

      {showPaymentForm ? (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Complete Your Subscription</h2>
            <p className="mb-4">
              Selected Plan: <span className="font-semibold">{selectedPlan.name}</span>
              <br />
              Price: <span className="font-semibold">₹{selectedPlan.price}</span>
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Details
                </label>
                <div className="p-3 border rounded-md">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!stripe || processing}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark disabled:bg-gray-400"
                >
                  {processing ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 capitalize">{plan.name}</h2>
                <p className="text-4xl font-bold mb-6">
                  ₹{plan.price}
                  <span className="text-base font-normal text-gray-600">
                    /{plan.id === 'monthly' ? 'month' : plan.id === 'quarterly' ? 'quarter' : 'year'}
                  </span>
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Exclusive Prime discounts
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Early access to deals
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Special member events
                </li>
              </ul>

              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={processing}
                className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">Prime Benefits</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold mb-2">Exclusive Discounts</h4>
              <p className="text-gray-600">
                Get special discounts on eligible products across all categories
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold mb-2">Early Access</h4>
              <p className="text-gray-600">
                Shop new arrivals and deals before anyone else
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeMembership; 