import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not initialized");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(order.totalPrice * 100), // Convert to cents
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const data = await response.json();
      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        throw new Error("No client secret returned from the server");
      }

      // Confirm the payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userInfo.username || userInfo.name,
            email: userInfo.email,
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      if (paymentResult.paymentIntent.status === 'succeeded') {
        // Payment succeeded, update order in database
        await payOrder({
          orderId,
          details: {
            id: paymentResult.paymentIntent.id,
            status: paymentResult.paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: userInfo.email,
          },
        });
        
        refetch();
        toast.success('Payment successful');
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err.message || "Payment failed. Please try again.");
      toast.error(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  // Add console logs to debug the order data
  console.log('Order Data:', order);

  const calculatePrice = (item) => {
    if (userInfo?.isPrimeMember && item.primeDiscount?.discountedPrice) {
      return item.primeDiscount.discountedPrice;
    }
    return item.price;
  };

  // Ensure data fetching completes before accessing the order object
  if (isLoading || !order) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.message}</Message>;

  // Use a fallback for the order object only if it is undefined
  const orderData = order || { orderItems: [], shippingPrice: 0, taxPrice: 0 };

  // Calculate the total items price using the discounted price for Prime members
  const itemsPrice = orderData.orderItems.reduce((acc, item) => acc + calculatePrice(item) * item.qty, 0).toFixed(2);

  const totalPrice = (parseFloat(itemsPrice) + orderData.shippingPrice + orderData.taxPrice).toFixed(2);

  return (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {orderData.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {orderData.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">₹ {calculatePrice(item).toFixed(2)}</td>
                      <td className="p-2 text-center">
                        ₹ {(item.qty * calculatePrice(item)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {orderData._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {orderData.user ? orderData.user.username : "N/A"}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong>{" "}
            {orderData.user ? orderData.user.email : "N/A"}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {orderData.shippingAddress.address}, {orderData.shippingAddress.city}{" "}
            {orderData.shippingAddress.postalCode}, {orderData.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {orderData.paymentMethod}
          </p>

          {orderData.isPaid ? (
            <Message variant="success">Paid on {orderData.paidAt}</Message>
          ) : (
            <Message variant="danger">Not paid</Message>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>₹ {itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹ {orderData.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>₹ {orderData.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>₹ {totalPrice}</span>
        </div>

        {!orderData.isPaid && (
          <div className="mt-4">
            <div className="bg-white p-4 rounded-lg shadow">
              {paymentError && (
                <div className="mb-4 text-red-500 text-sm">{paymentError}</div>
              )}
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
              <button
                className="mt-4 bg-pink-500 text-white py-2 px-4 rounded-lg w-full hover:bg-pink-600 transition-colors"
                onClick={handlePayment}
                disabled={!stripe || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && orderData.isPaid && !orderData.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
