import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductCarousel.css";
import { Link } from "react-router-dom";
import { FaArrowRight, FaStar, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";

// Custom arrow components for the slider
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button className="custom-arrow prev-arrow" onClick={onClick}>
      <FaChevronLeft />
    </button>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button className="custom-arrow next-arrow" onClick={onClick}>
      <FaChevronRight />
    </button>
  );
};

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const dispatch = useDispatch();
  const [loadedImages, setLoadedImages] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  
  const { userInfo } = useSelector((state) => state.auth);
  const isPrimeMember = userInfo?.isPrimeMember || localStorage.getItem("isPrimeMember") === "true";

  useEffect(() => {
    // Add a class to the body when the component mounts to enable smooth page transitions
    document.body.classList.add('carousel-active');
    
    return () => {
      // Remove the class when the component unmounts
      document.body.classList.remove('carousel-active');
    };
  }, []);

  if (isLoading) {
    return (
      <div className="carousel-loading">
        <div className="carousel-loader">
          <div className="loader-circle"></div>
          <div className="loader-line-mask">
            <div className="loader-line"></div>
          </div>
          <span className="loader-text">Loading premium products</span>
        </div>
      </div>
    );
  }

  if (error) return null;

  const addToCartHandler = (product, e) => {
    e.preventDefault();
    // Add a ripple effect at click position
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    e.currentTarget.appendChild(ripple);
    
    // Position the ripple where clicked
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Remove the ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    // Don't add to cart if product is out of stock
    if (product.countInStock === 0) {
      toast.error("Sorry, this product is out of stock");
      return;
    }
    
    const price = isPrimeMember && product.primeDiscount?.isEligible 
      ? product.primeDiscount.discountedPrice 
      : product.price;
    
    dispatch(addToCart({ ...product, qty: 1, price }));
    toast.success(`${product.name} added to cart`);
  };

  const handleImageLoad = (productId) => {
    setLoadedImages(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    appendDots: dots => (
      <div className="custom-dots">
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <button className={`dot ${currentSlide === i ? 'active' : ''}`}>
        <span className="dot-indicator"></span>
      </button>
    )
  };

  // Function to truncate text while preserving words
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    // Find the last space before maxLength
    const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
    return text.substring(0, lastSpaceIndex > 0 ? lastSpaceIndex : maxLength) + '...';
  };

  return (
    <div className="premium-carousel">
      <Slider ref={sliderRef} {...settings}>
        {products.map((product, index) => (
          <div key={product._id} className="hero-slide">
            <div className="slide-background-wrapper">
              <div 
                className="slide-background" 
                style={{ backgroundImage: `url(${product.image})` }}
              ></div>
              <div className="gradient-overlay"></div>
            </div>
            
            <div className="slide-container">
              <div className="slide-content" data-aos="fade-right">
                <div className="product-meta">
                  <div className="product-badge">
                    {truncateText(product.brand || 'Featured', 20)}
                  </div>
                  <div className="product-category">
                    {truncateText(product.category?.name || 'Premium', 20)}
                  </div>
                </div>
                
                <h2 className="product-title" title={product.name} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {product.name}
                  <span className="title-accent"></span>
                </h2>
                
                <div className="rating">
                  <div className="stars-container">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < product.rating ? "star filled" : "star"} />
                    ))}
                  </div>
                  <span className="review-count">{product.numReviews} Reviews</span>
                </div>
                
                <p className="product-description" title={product.description}>
                  {truncateText(product.description, 120) || 
                   'Experience premium quality and design with our flagship product.'}
                </p>
                
                <div className="product-price-container flex items-center justify-between">
                  <div className="price-wrapper">
                    {isPrimeMember && product.primeDiscount?.isEligible ? (
                      <>
                        <div className="prime-price">
                          <FaCrown className="prime-icon" />
                          <span className="discounted-price">
                          ₹ {product.primeDiscount.discountedPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="original-price">
                          <span className="strike-through">
                          ₹{product.price.toFixed(2)}
                          </span>
                          {/* {product.primeDiscount.discountType === 'percentage' && (
                            <span className="discount-tag">
                              {product.primeDiscount.discountValue}% Prime discount
                            </span> */}
                          {/* )} */}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="product-price">
                          ₹{product.price.toFixed(2)}
                        </span>
                        {product.primeDiscount?.isEligible && (
                          <div className="prime-eligible">
                            <FaCrown />
                            <span>Prime eligible</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {product.countInStock > 0 ? (
                    <span className="stock in-stock">
                      <span className="stock-dot"></span>
                      In Stock
                    </span>
                  ) : (
                    <span className="stock out-stock">
                      <span className="stock-dot"></span>
                      Out of Stock
                    </span>
                  )}
                </div>
                
                <div className="cta-container">
                  <Link to={`/product/${product._id}`} className="view-details-btn">
                    <span className="btn-text hover:text-pink-500">View Details</span>
                    <span className="btn-icon">
                      <FaArrowRight />
                    </span>
                  </Link>
                  <button 
                    onClick={(e) => addToCartHandler(product, e)} 
                    className={`add-to-cart-btn ${product.countInStock === 0 ? 'disabled' : ''}`}
                    disabled={product.countInStock === 0}
                  >
                    <span className="btn-icon">
                      <FaShoppingCart />
                    </span>
                    <span className="btn-text">Add to Cart</span>
                  </button>
                </div>
              </div>
              
              <div className="product-image-container" data-aos="fade-left">
                <div className="image-number">{index + 1 < 10 ? `0${index + 1}` : index + 1}</div>
                
                {!loadedImages[product._id] && (
                  <div className="image-loading-spinner">
                    <div className="spinner-ring"></div>
                  </div>
                )}
                
                <div className={`image-frame ${loadedImages[product._id] ? 'loaded' : ''}`}>
                  <div className="frame-inner">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-image"
                      onLoad={() => handleImageLoad(product._id)}
                    />
                  </div>
                  <div className="frame-shadow"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
