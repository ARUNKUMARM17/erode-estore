import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineEye } from "react-icons/ai";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  // Generate random rating display (for demo purposes)
  const renderRatingStars = (rating = Math.floor(Math.random() * 5) + 1) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-400" />);
    }

    return stars;
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
        
        {/* Brand Badge
        <span className="absolute top-2 left-4px bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full z-10 border border-gray-700">
          {p?.brand}
        </span>
 */}
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
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-2 p-3 bg-black/60 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addToCartHandler(p, 1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 text-white transition-colors"
            title="Add to Cart"
          >
            <AiOutlineShoppingCart size={20} />
          </button>
          
          <Link
            to={`/product/${p._id}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            title="Quick View"
          >
            <AiOutlineEye size={20} />
          </Link>
          
          <div className="w-10 h-10 flex items-center justify-center">
            <HeartIcon product={p} />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating Stars */}
        <div className="flex mb-2">
          {renderRatingStars()}
          <span className="text-xs text-gray-400 ml-1">{p.numReviews || '(24)'}</span>
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
          <div className="text-pink-500 font-bold text-xl">
            ₹{p?.price?.toLocaleString()}
          </div>
          
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
