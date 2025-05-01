import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Product = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const isPrimeMember = userInfo?.isPrimeMember || localStorage.getItem("isPrimeMember") === "true";

  const renderPriceDisplay = () => {
    if (isPrimeMember && product.primeDiscount?.isEligible) {
      return (
        <div className="price-container">
          <div className="prime-price">
            <FaCrown className="prime-icon" />
            <span className="discounted-price">
            ₹{product.primeDiscount.discountedPrice.toFixed(2)}
            </span>
          </div>
          <div className="original-price">
            <span className="strike-through">₹{product.price.toFixed(2)}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="price-container">
          <span className="regular-price">₹{product.price.toFixed(2)}</span>
          {product.primeDiscount?.isEligible && (
            <div className="prime-eligible">
              <FaCrown />
              <span>Prime eligible</span>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="product-item group">
      <div className="mb-4 overflow-hidden relative">
        <Link to={`/product/${product._id}`}>
          <div className="aspect-square bg-zinc-900 flex items-center justify-center relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-5 transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </Link>
      </div>
      
      <div className="px-1">
        <Link to={`/product/${product._id}`}>
          <h3 
            className="text-white text-sm font-light tracking-wide hover:text-pink-500 transition-colors line-clamp-2 min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
        
        <div className="flex justify-between items-center mt-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`w-3 h-3 ${i < Math.round(product.rating) ? "text-pink-500" : "text-zinc-700"}`} 
              />
            ))}
            <span className="text-xs text-zinc-500 ml-2">({product.numReviews})</span>
          </div>
        </div>
        
        <div className="h-px w-full bg-zinc-800 my-3"></div>
        
        {renderPriceDisplay()}
      </div>
    </div>
  );
};

export default Product;
