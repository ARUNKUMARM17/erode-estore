import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const SmallProduct = ({ product }) => {
  return (
    <div className="flex gap-3">
      {/* Product Image */}
      <Link 
        to={`/product/${product._id}`} 
        className="block w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-1"
        />
      </Link>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${product._id}`}>
          <h3 
            className="font-medium text-gray-800 line-clamp-2 hover:text-pink-600 transition-colors min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mt-1 mb-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                size={12}
                className={i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"} 
              />
            ))}
          </div>
        </div>
        
        {/* Price */}
        <div className="text-pink-600 font-bold truncate">
        ₹ {parseFloat(product.price).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
