import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineEye } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import PrimePrice from "../PrimePrice";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const isPrimeMember = userInfo?.isPrimeMember || localStorage.getItem("isPrimeMember") === "true";

  const addToCartHandler = (product, qty) => {
    const price = isPrimeMember && product.primeDiscount?.isEligible 
      ? product.primeDiscount.discountedPrice 
      : product.price;
      
    dispatch(addToCart({ ...product, qty, price }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="group bg-[#1A1A1A] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-[220px] overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        {/* Discount Badge (optional) */}
        {p.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            {p.discount}% OFF
          </div>
        )}
        
        {/* Product Image */}
        <Link to={`/product/${p._id}`} className="block h-full">
          <div className="w-full h-full flex items-center justify-center overflow-hidden p-4">
            <img
              className="cursor-pointer object-contain h-full max-h-[180px] w-auto mx-auto group-hover:scale-110 transition-transform duration-500 ease-out"
              src={p.image}
              alt={p.name}
            />
          </div>
        </Link>

        {/* Quick Action Buttons (visible on hover) */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={() => addToCartHandler(p, 1)}
            className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors"
          >
            <AiOutlineShoppingCart size={24} />
          </button>
          <Link
            to={`/product/${p._id}`}
            className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <AiOutlineEye size={24} />
          </Link>
        </div>
      </div>

      <div className="p-4">
        {/* Rating Stars */}
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={`w-4 h-4 ${i < Math.round(p.rating) ? "text-yellow-400" : "text-gray-400"}`} 
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({p.numReviews || 0})</span>
        </div>
        
        {/* Product Name */}
        <Link to={`/product/${p._id}`}>
          <h3 className="text-white font-medium text-lg mb-1 truncate hover:text-pink-500 transition-colors">
            {p?.name}
          </h3>
        </Link>
        
        {/* Product Description */}
        <p className="text-gray-400 text-sm line-clamp-2 mb-3 h-10">
          {p?.description?.substring(0, 60)} ...
        </p>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-2">
          <PrimePrice product={p} />
          
          <button
            onClick={() => addToCartHandler(p, 1)}
            className="flex items-center justify-center px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded transition-colors"
          >
            Add to Cart
          </button>
        </div>
        
        {/* Stock Status */}
        {p.countInStock > 0 ? (
          <div className="text-green-500 text-xs mt-2">In Stock</div>
        ) : (
          <div className="text-red-500 text-xs mt-2">Out of Stock</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 