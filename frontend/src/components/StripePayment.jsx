import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const StripePayment = ({ order, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: order.totalPrice,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: order.user?.name || 'Guest User',
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onPaymentSuccess(result.paymentIntent);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-4">
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
          className="p-4 border rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full bg-pink-500 text-white py-2 px-4 rounded-full ${
          (!stripe || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default StripePayment; 