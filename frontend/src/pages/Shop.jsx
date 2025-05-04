import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { 
  FaFilter, 
  FaSort, 
  FaChevronDown, 
  FaSearch, 
  FaTimes, 
  FaAngleRight,
  FaCrown,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaShippingFast,
  FaPercent,
  FaHistory,
  FaHeart,
  FaRegHeart,
  FaTrash
} from "react-icons/fa";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import PrimeProducts from "./Products/PrimeProducts";
import { Link } from 'react-router-dom';
import PrimePrice from '../components/PrimePrice';
import { toast } from 'react-hot-toast';
import { addToCart } from "../redux/features/cart/cartSlice";
import { addToFavorites, removeFromFavorites } from "../redux/features/favorites/favoriteSlice";
import { addFavoriteToLocalStorage, removeFavoriteFromLocalStorage } from "../Utils/localStorage";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const { userInfo } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites);

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewHistory, setViewHistory] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [isPrimeOnly, setIsPrimeOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      let filteredProducts = [...filteredProductsQuery.data];

      // Apply category and brand filters
      if (checked.length > 0) {
        filteredProducts = filteredProducts.filter(
          (product) => checked.includes(product.category)
        );
      }
      
      if (radio.length > 0) {
        filteredProducts = filteredProducts.filter(
          (product) => radio.includes(product.brand)
        );
      }

      // Apply price range filter
      filteredProducts = filteredProducts.filter(
        (product) => {
          const price = product.price;
          return price >= priceRange[0] && price <= priceRange[1];
        }
      );

      // Apply Prime only filter if selected
      if (isPrimeOnly && userInfo?.isPrimeMember) {
        filteredProducts = filteredProducts.filter(
          (product) => product.primeDiscount?.isEligible
        );
      }

      // Apply search filter
      if (searchTerm.trim() !== "") {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Sort products
      if (sortBy === "price-low-high") {
        filteredProducts = [...filteredProducts].sort((a, b) => {
          // Use prime price for comparison if user is prime member and product is prime eligible
          const priceA = userInfo?.isPrimeMember && a.primeDiscount?.isEligible ? 
            a.primeDiscount.price : a.price;
          const priceB = userInfo?.isPrimeMember && b.primeDiscount?.isEligible ? 
            b.primeDiscount.price : b.price;
          return priceA - priceB;
        });
      } else if (sortBy === "price-high-low") {
        filteredProducts = [...filteredProducts].sort((a, b) => {
          const priceA = userInfo?.isPrimeMember && a.primeDiscount?.isEligible ? 
            a.primeDiscount.price : a.price;
          const priceB = userInfo?.isPrimeMember && b.primeDiscount?.isEligible ? 
            b.primeDiscount.price : b.price;
          return priceB - priceA;
        });
      } else if (sortBy === "name-a-z") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "name-z-a") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortBy === "rating-high-low") {
        filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      dispatch(setProducts(filteredProducts));
      setCurrentPage(1); // Reset to first page on filter/sort change
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, sortBy, priceRange, isPrimeOnly, userInfo, searchTerm]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
    
    // If user enters a price, filter products by that price
    if (e.target.value) {
      const price = parseFloat(e.target.value);
      if (!isNaN(price)) {
        // Set both min and max to the entered price to show exact matches
        setPriceRange([price, price]);
      }
    } else {
      // Reset to original price range if input is cleared
      const allProducts = filteredProductsQuery.data || [];
      const min = Math.min(...allProducts.map(p => p.price), Infinity) || 0;
      const max = Math.max(...allProducts.map(p => p.price), 0) || 5000;
      setPriceRange([min, max]);
    }
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    
    // Ensure min is never greater than max
    if (index === 0 && Number(value) > priceRange[1]) {
      newRange[1] = Number(value);
    } else if (index === 1 && Number(value) < priceRange[0]) {
      newRange[0] = Number(value);
    }
    
    setPriceRange(newRange);
  };

  const resetFilters = () => {
    // Reset all filters
    dispatch(setChecked([]));
    dispatch(setRadio([]));
    const allProducts = filteredProductsQuery.data || [];
    const min = Math.min(...allProducts.map(p => p.price), Infinity) || 0;
    const max = Math.max(...allProducts.map(p => p.price), 0) || 5000;
    setPriceRange([min, max]);
    setPriceFilter("");
    setSortBy("newest");
    setIsPrimeOnly(false);
    
    // Reset products to original list
    if (filteredProductsQuery.data) {
      dispatch(setProducts(filteredProductsQuery.data));
    }
  };

  // Enhanced Product Card
  const EnhancedProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isPrime = product.primeDiscount?.isEligible;
    const randomReviews = Math.floor(Math.random() * 1000) + 5; // Random review count
    const isWishlisted = favorites.some(item => item._id === product._id);

    // Calculate the displayed price based on user membership and product eligibility
    const displayPrice = isPrime && userInfo?.isPrimeMember && product.primeDiscount?.discountedPrice
      ? product.primeDiscount.discountedPrice
      : product.price;

    // Calculate the savings percentage if there's a prime discount
    const savingsPercentage = isPrime && userInfo?.isPrimeMember && product.primeDiscount?.discountedPrice
      ? Math.round((1 - (product.primeDiscount.discountedPrice / product.price)) * 100)
      : 0;

    const handleWishlistClick = (e) => {
      e.stopPropagation();
      if (!userInfo) {
        toast.info('Login to use wishlist');
        return;
      }
      if (isWishlisted) {
        dispatch(removeFromFavorites(product));
        removeFavoriteFromLocalStorage(product._id);
        toast.success('Removed from wishlist');
      } else {
        dispatch(addToFavorites(product));
        addFavoriteToLocalStorage(product);
        toast.success('Added to wishlist');
      }
    };

    return (
      <div 
        className="bg-[#18181b] border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 p-4 flex flex-col justify-between min-h-[420px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mb-4">
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isPrime && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                <FaCrown className="mr-1" /> Prime
              </span>
            )}
          </div>
          {/* Wishlist Heart Icon - always visible */}
          <button 
            onClick={handleWishlistClick}
            className={`absolute top-2 right-2 p-2 rounded-full z-10 transition-colors ${isWishlisted ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            title={userInfo ? (isWishlisted ? 'Remove from wishlist' : 'Add to wishlist') : 'Login to use wishlist'}
          >
            {isWishlisted ? (
              <FaHeart className="text-white" />
            ) : (
              <FaRegHeart className="text-pink-500" />
            )}
          </button>
          <Link to={`/product/${product._id}`} className="block">
            <div className="h-56 bg-gray-900 flex items-center justify-center p-6 rounded-lg">
              <img 
                src={product.image || "/placeholder-product.png"} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain mix-blend-normal"
              />
            </div>
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-white font-medium line-clamp-2 hover:text-blue-400 transition-colors mb-2 text-lg">{product.name}</h3>
          </Link>
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">₹{displayPrice.toFixed(2)}</span>
              {/* Show original price if prime discount is applied */}
              {isPrime && userInfo?.isPrimeMember && product.primeDiscount?.discountedPrice && (
                <span className="text-gray-400 line-through text-base">₹{product.price.toFixed(2)}</span>
              )}
            </div>
            {/* Prime badge and savings */}
            {isPrime && userInfo?.isPrimeMember && savingsPercentage > 0 && (
              <div className="flex items-center mt-1">
                <span className="mr-1 text-blue-500 text-sm font-medium">Prime</span>
                <span className="text-green-500 text-sm">
                  Save {savingsPercentage}%
                </span>
              </div>
            )}
            {/* Shipping info */}
            <div className="text-sm text-green-500 mt-1 flex items-center">
              <FaShippingFast className="mr-1" /> 
              Free shipping
              {isPrime && <span className="ml-1">with Prime</span>}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-full transition-colors"
              onClick={() => {
                if (!userInfo) {
                  toast.info('Login to add to cart');
                  return;
                }
                dispatch(addToCart({ ...product, qty: 1 }));
                toast.success('Added to cart');
              }}
            >
              Add to Cart
            </button>
            <Link to={`/product/${product._id}`} className="w-full block">
              <button className="w-full border border-gray-400 text-gray-200 font-medium py-1.5 px-4 rounded-full hover:bg-gray-700 transition-colors text-sm">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const handleShopNow = () => {
    // Reset filters and show all products
    dispatch(setChecked([]));
    dispatch(setProducts(filteredProductsQuery.data));
  };

  const handleDealsAndDiscounts = () => {
    // Filter products with discounts
    const discountedProducts = filteredProductsQuery.data.filter(
      (product) => product.primeDiscount?.isEligible || product.discount > 0
    );
    dispatch(setProducts(discountedProducts));
  };

  // Calculate initial min and max prices from all products
  const allProducts = filteredProductsQuery.data || [];
  const initialMinPrice = Math.min(...allProducts.map(p => p.price), Infinity) || 0;
  const initialMaxPrice = Math.max(...allProducts.map(p => p.price), 0) || 5000;

  // Update price range state with initial values
  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const min = Math.min(...filteredProductsQuery.data.map(p => p.price), Infinity) || 0;
      const max = Math.max(...filteredProductsQuery.data.map(p => p.price), 0) || 5000;
      setPriceRange([min, max]);
    }
  }, [filteredProductsQuery.isLoading, filteredProductsQuery.data]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Prime Banner */}
      {!userInfo?.isPrimeMember && (
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center">
                <FaCrown className="text-yellow-400 mr-2 text-xl" />
                <span className="text-white text-sm font-medium">Try Prime FREE for 30 days - Get exclusive deals & fast shipping</span>
              </div>
              <Link
                to="/prime"
                className="bg-yellow-400 text-black px-4 py-1 rounded-sm hover:bg-yellow-500 transition-colors text-sm font-bold mt-2 md:mt-0"
              >
                Join Prime
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white p-6 rounded-lg mb-8 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-xl"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-lg"
            >
              <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            
            <div className="relative inline-block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white py-2 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
                <option value="rating-high-low">Highest Rated</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Filters Sidebar - Mobile (Collapsible) */}
          <div 
            className={`lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-300 ${
              showFilters ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <div className={`bg-[#151515] w-[80%] max-w-sm h-full overflow-y-auto transition-transform duration-300 ${
              showFilters ? "translate-x-0" : "-translate-x-full"
            }`}>
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="p-4">
                {renderFilters()}
              </div>
            </div>
          </div>
          
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-[#151515] rounded-xl overflow-hidden sticky top-4">
              {renderFilters()}
            </div>
            
            {/* Saved Items */}
            <div className="bg-[#151515] rounded-xl overflow-hidden mt-4 p-4">
              <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
                <FaHeart className="text-pink-500 text-lg" />
                <h3 className="text-white font-semibold text-lg">Your Favourites</h3>
              </div>
              {favorites.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-6">No favourites yet. Click the heart icon on any product to add it here!</div>
              ) : (
                <div className="space-y-3">
                  {favorites.map(item => (
                    <div key={item._id} className="flex items-center gap-3 text-sm bg-[#23232b] rounded-lg p-2 hover:bg-[#29293a] transition-colors">
                      <img 
                        src={item.image || "/placeholder-product.png"} 
                        alt={item.name} 
                        className="w-10 h-10 object-cover rounded shadow"
                      />
                      <div className="flex-1 text-gray-200 font-medium line-clamp-1">{item.name}</div>
                      <button 
                        onClick={() => { dispatch(removeFromFavorites(item)); removeFavoriteFromLocalStorage(item._id); }}
                        className="text-pink-500 hover:text-white bg-gray-800 hover:bg-pink-600 rounded-full p-2 transition-colors"
                        title="Remove from favourites"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Desktop Sorting and Results Count */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <div className="text-white">
                <span className="font-medium">{products?.length}</span> results
              </div>
              
              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-white py-2 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="name-a-z">Name: A to Z</option>
                  <option value="name-z-a">Name: Z to A</option>
                  <option value="rating-high-low">Highest Rated</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Results Count - Mobile */}
            <h2 className="lg:hidden text-lg font-semibold text-white mb-4">
              {products?.length} Products Found
            </h2>
            
            {/* Search Bar */}
            <div className="mb-6 flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full md:w-96 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <FaSearch className="text-pink-500" />
            </div>
            
            {/* Products Grid */}
            {filteredProductsQuery.isLoading ? (
              <div className="flex flex-col justify-center items-center h-64 bg-[#111111] rounded-lg border border-gray-800 p-8">
                <Loader />
                <p className="text-gray-400 mt-4">Searching for products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 bg-[#111111] rounded-lg border border-gray-800 p-8">
                <p className="text-gray-400">No products found with the selected filters.</p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  {isPrimeOnly ? 'Prime Eligible Products' : 'All Products'}
                </h2>
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 mt-4">
                  {currentProducts.map((p) => (
                    <div key={p._id} className="break-inside-avoid">
                      <EnhancedProductCard product={p} />
                    </div>
                  ))}
                </div>
                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex gap-2">
                      {[...Array(totalPages)].map((_, idx) => {
                        const page = idx + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-full font-semibold transition-colors
                              ${currentPage === page
                                ? 'bg-pink-600 text-white shadow-lg'
                                : 'bg-gray-800 text-gray-300 hover:bg-pink-500 hover:text-white'}
                            `}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  function renderFilters() {
    return (
      <aside className="backdrop-blur-lg bg-gradient-to-br from-[#23232b]/80 to-[#18181b]/70 border border-gray-800 rounded-2xl shadow-xl sticky top-8 p-6 w-full max-w-xs mx-auto lg:mx-0 z-20">
        {/* Prime Filter */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={isPrimeOnly}
              onChange={(e) => setIsPrimeOnly(e.target.checked)}
              className="w-4 h-4 accent-pink-500 rounded focus:ring-pink-500"
            />
            <span className="text-white flex items-center font-semibold">
              <FaCrown className="text-yellow-400 mr-1" /> Prime Only
            </span>
          </label>
        </div>
        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <FaAngleRight className="text-pink-400" /> Categories
          </h2>
          <div className="space-y-2">
            {categories?.map((c) => (
              <label key={c._id} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-pink-400">
                <input
                  type="checkbox"
                  checked={checked.includes(c._id)}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        {/* Brand Filter */}
        <div className="mb-6">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <FaAngleRight className="text-blue-400" /> Brands
          </h2>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 bg-[#18181b] rounded border border-gray-800">
            {uniqueBrands?.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-blue-400">
                <input
                  type="checkbox"
                  checked={radio.includes(brand)}
                  onChange={(e) => {
                    const newRadio = e.target.checked
                      ? [...radio, brand]
                      : radio.filter((b) => b !== brand);
                    dispatch(setRadio(newRadio));
                  }}
                  className="w-4 h-4 accent-blue-500 rounded"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
        {/* Price Range Filter */}
        <div className="mb-6">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <FaAngleRight className="text-green-400" /> Price Range
          </h2>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange(0, e.target.value)}
              className="w-20 bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-sm"
              placeholder="Min"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, e.target.value)}
              className="w-20 bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-sm"
              placeholder="Max"
            />
          </div>
          <input
            type="range"
            min={initialMinPrice}
            max={initialMaxPrice}
            value={priceRange[1]}
            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
            className="w-full h-1 bg-gradient-to-r from-pink-500 via-blue-500 to-green-400 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {/* Clear All Filters */}
        <div className="pt-2">
          <button
            onClick={resetFilters}
            className="w-full py-2 text-center border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-500 hover:text-white transition-colors font-semibold shadow"
          >
            Clear All Filters
          </button>
        </div>
      </aside>
    );
  }
};
  
export default Shop;