import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaHeart,
  FaRegHeart,
  FaTag,
  FaCrown
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgOrientation, setImgOrientation] = useState("square");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  // Detect image orientation when it loads
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const ratio = naturalWidth / naturalHeight;
    
    if (ratio > 1.2) {
      setImgOrientation("landscape");
    } else if (ratio < 0.8) {
      setImgOrientation("portrait");
    } else {
      setImgOrientation("square");
    }
    
    setImgLoaded(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error?.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success(`${product.name} added to cart`);
  };
  
  const buyNowHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };
  
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Format description with bullet points if it contains certain delimiters
  const formatDescription = (description) => {
    if (!description) return '';
    
    // Check if description contains bullet points
    if (description.includes('• ') || description.includes('* ')) {
      const items = description.split(/[•*]\s/).filter(item => item.trim());
      return (
        <div>
          <ul className="list-disc pl-5 space-y-2">
            {items.map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Check if description has multiple paragraphs
    if (description.includes('\n')) {
      const paragraphs = description.split('\n').filter(p => p.trim());
      return (
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      );
    }
    
    // Default rendering
    return description;
  };

  return (
    <div className="bg-[#0F0F0F] min-h-screen pb-12">
      {isLoading ? (
        <div className="h-[80vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 pt-8">
          <Message variant="danger">
            {error?.data?.message || error?.message}
          </Message>
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-sm text-gray-400">
            <Link to="/" className="hover:text-pink-500 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-pink-500 transition-colors">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Image Carousel */}
            <div className="lg:w-full flex justify-center items-center">
              <div className="relative bg-[#1A1A1A] rounded-xl overflow-hidden shadow-lg max-h-[500px] aspect-w-1 aspect-h-1">
                <div 
                  className="overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#1c1c22] to-[#131317] relative"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#ffffff33_1px,_transparent_1px)] bg-[length:20px_20px] mix-blend-overlay"></div>
                  
                  {/* Loading skeleton */}
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-gray-700 border-t-pink-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`
                      z-10 relative transition-transform duration-200 ease-out object-contain
                      ${imgOrientation === "landscape" ? "w-full max-h-full" : ""}
                      ${imgOrientation === "portrait" ? "h-full max-w-full" : ""}
                      ${imgOrientation === "square" ? "max-w-full max-h-full" : ""}
                      ${!imgLoaded ? "opacity-0" : "opacity-100"}
                      mix-blend-normal
                    `}
                    style={{ 
                      filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.2))',
                      transition: 'opacity 0.3s ease'
                    }}
                    onLoad={handleImageLoad}
                  />
                  
                  {/* Zoom view */}
                  {showZoom && imgLoaded && (
                    <div 
                      className="absolute inset-0 bg-no-repeat opacity-0 hover:opacity-100 z-20 pointer-events-none"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: imgOrientation === "portrait" ? "150%" : "200%",
                        backgroundOrigin: 'content-box',
                        padding: imgOrientation === "landscape" ? '5% 15%' : imgOrientation === "portrait" ? '15% 5%' : '10%',
                        mixBlendMode: 'normal'
                      }}
                    ></div>
                  )}
                  
                  {/* Favorite button */}
                  <div className="absolute top-4 right-4 z-30">
                    <HeartIcon product={product} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Info - Sticky Sidebar */}
            <div className="lg:w-full max-h-[500px] overflow-y-auto sticky top-0">
              <div className="bg-[#1A1A1A] rounded-xl p-6">
                {/* Product Name with Tooltip */}
                <div className="relative group">
                  <h1 className="text-3xl font-bold text-white mb-4 break-words" title={product.name}>
                    {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                  </h1>
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg p-2 shadow-lg">
                    {product.name}
                  </div>
                </div>
                
                {/* Rating and Created Date */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Ratings value={product.rating} />
                    <span className="ml-2">
                      ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1 flex-shrink-0" />
                    <span className="truncate">{moment(product.createdAt).fromNow()}</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  {userInfo?.isPrimeMember && product.primeDiscount?.isEligible ? (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-4xl font-bold text-pink-500">
                          ₹{product.primeDiscount.discountedPrice.toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-400 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-pink-500/10 text-pink-500 px-2 py-1 rounded-full flex items-center gap-1">
                          <FaCrown className="text-yellow-400" />
                          Prime Price
                        </span>
                        <span className="text-green-500">
                          Save ₹{(product.price - product.primeDiscount.discountedPrice).toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-white">₹{product.price.toLocaleString()}</span>
                      {product.primeDiscount?.isEligible && (
                        <div className="mt-2 text-sm text-yellow-400 flex items-center gap-1">
                          <FaCrown />
                          <span>Prime eligible - Save with Prime membership</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Availability */}
                <div className="flex items-center mb-6">
                  <span className="text-gray-300 mr-2">Availability:</span>
                  {product.countInStock > 0 ? (
                    <span className="text-green-500 flex items-center">
                      <FaCheck size={14} className="mr-1" /> In Stock ({product.countInStock} available)
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <FaTimes size={14} className="mr-1" /> Out of Stock
                    </span>
                  )}
                </div>
                
                {/* Enhanced Description with Dropdown */}
                <div className="mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
                    <FaTag className="mr-2 text-pink-500" /> Product Description
                  </h3>
                  <div className="text-gray-300 leading-relaxed overflow-hidden max-h-[300px] pr-2">
                    {formatDescription(product.description)}
                  </div>
                  {product.description && product.description.split(/[•*]\s/).length > 2 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-2 text-pink-500 hover:text-pink-700 transition-colors"
                    >
                      {showFullDescription ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
                
                {/* Key Features (if available) */}
                {product.features && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-white">Key Features</h3>
                    <ul className="list-disc pl-5 text-gray-300">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Quantity Selector */}
                {product.countInStock > 0 && (
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Quantity</label>
                    <div className="flex items-center">
                      <button 
                        className="bg-gray-800 text-white h-10 w-10 flex items-center justify-center rounded-l-lg"
                        onClick={() => setQty(prev => Math.max(1, prev - 1))}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={qty} 
                        onChange={(e) => setQty(Math.max(1, Math.min(product.countInStock, parseInt(e.target.value) || 1)))}
                        className="h-10 w-16 border-0 text-center bg-gray-800 text-white"
                      />
                      <button 
                        className="bg-gray-800 text-white h-10 w-10 flex items-center justify-center rounded-r-lg"
                        onClick={() => setQty(prev => Math.min(product.countInStock, prev + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                      product.countInStock === 0 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-800 text-white hover:bg-gray-700 transition-colors'
                    }`}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  
                  <button
                    onClick={buyNowHandler}
                    disabled={product.countInStock === 0}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold ${
                      product.countInStock === 0 
                        ? 'bg-pink-900/50 text-pink-300/50 cursor-not-allowed' 
                        : 'bg-pink-600 text-white hover:bg-pink-700 transition-colors'
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
                
                {/* Product Meta */}
                <div className="border-t border-gray-800 pt-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">SKU:</span>
                      <span className="text-white">{product._id.substring(0, 8)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">Category:</span>
                      <span className="text-white">{product.category?.name || 'General'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mt-12">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
