import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetMyOrdersQuery } from '../../redux/api/orderApiSlice';
import { FaBox, FaCalendarAlt, FaCheck, FaClock, FaEye, FaRupeeSign, FaTimes } from 'react-icons/fa';

const UserOrders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <div className="h-1 w-20 bg-pink-600 mb-6"></div>
            <p className="text-gray-400">
              View and track all your orders in one place
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            </div>
          ) : orders?.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-8 text-center mb-6">
              <div className="flex justify-center mb-4">
                <FaBox className="text-5xl text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
              <p className="text-gray-400 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-pink-900/20">
                  {/* Order header */}
                  <div className="bg-gray-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">ORDER ID</p>
                      <p className="font-mono text-sm">{order._id}</p>
                    </div>
                    <div className="flex items-center mt-3 md:mt-0">
                      <div className="flex items-center mr-4">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span className="text-sm">{formatDate(order.createdAt)}</span>
                      </div>
                      <Link
                        to={`/order/${order._id}`}
                        className="ml-4 inline-flex items-center bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <FaEye className="mr-2" /> View Details
                      </Link>
                    </div>
                  </div>
                  
                  {/* Order details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Price section */}
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">TOTAL AMOUNT</p>
                        <p className="text-xl font-bold flex items-center">
                          <FaRupeeSign className="text-sm mr-1" />
                          {order.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.orderItems.reduce((acc, item) => acc + item.qty, 0)} items
                        </p>
                      </div>
                      
                      {/* Payment status */}
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">PAYMENT STATUS</p>
                        {order.isPaid ? (
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <p className="text-green-500 font-medium">Paid</p>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            <p className="text-red-500 font-medium">Not Paid</p>
                          </div>
                        )}
                        {order.isPaid && (
                          <p className="text-xs text-gray-400 flex items-center">
                            <FaClock className="mr-1" /> {formatDate(order.paidAt)}
                          </p>
                        )}
                      </div>
                      
                      {/* Delivery status */}
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">DELIVERY STATUS</p>
                        {order.isDelivered ? (
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <p className="text-green-500 font-medium">Delivered</p>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            <p className="text-yellow-500 font-medium">Pending</p>
                          </div>
                        )}
                        {order.isDelivered && (
                          <p className="text-xs text-gray-400 flex items-center">
                            <FaClock className="mr-1" /> {formatDate(order.deliveredAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <Link 
              to="/profile"
              className="inline-flex items-center text-white bg-gray-800 hover:bg-gray-700 py-3 px-6 rounded-lg transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrders; 