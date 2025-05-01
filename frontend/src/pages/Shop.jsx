// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
// import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
// import { 
//   FaFilter, 
//   FaSort, 
//   FaChevronDown, 
//   FaSearch, 
//   FaTimes, 
//   FaAngleRight,
//   FaCrown,
//   FaStar,
//   FaRegStar,
//   FaStarHalfAlt,
//   FaShippingFast,
//   FaPercent,
//   FaHistory,
//   FaHeart,
//   FaTrash
// } from "react-icons/fa";
// import {
//   setCategories,
//   setProducts,
//   setChecked,
// } from "../redux/features/shop/shopSlice";
// import Loader from "../components/Loader";
// import ProductCard from "./Products/ProductCard";
// import PrimeProducts from "./Products/PrimeProducts";
// import { Link } from 'react-router-dom';
// import PrimePrice from '../components/PrimePrice';

// const Shop = () => {
//   const dispatch = useDispatch();
//   const { categories, products, checked, radio } = useSelector(
//     (state) => state.shop
//   );
//   const { userInfo } = useSelector((state) => state.auth);

//   const categoriesQuery = useFetchCategoriesQuery();
//   const [priceFilter, setPriceFilter] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortBy, setSortBy] = useState("newest");
//   const [priceRange, setPriceRange] = useState([0, 5000]);
//   const [viewHistory, setViewHistory] = useState([]);
//   const [savedForLater, setSavedForLater] = useState([]);
//   const [showRecommendations, setShowRecommendations] = useState(true);

//   const filteredProductsQuery = useGetFilteredProductsQuery({
//     checked,
//     radio,
//   });

//   useEffect(() => {
//     if (!categoriesQuery.isLoading) {
//       dispatch(setCategories(categoriesQuery.data));
//     }
//   }, [categoriesQuery.data, dispatch]);

//   useEffect(() => {
//       if (!filteredProductsQuery.isLoading) {
//       let filteredProducts = filteredProductsQuery.data;

//       // Apply filters only if both categories and brands are selected
//       if (checked.length > 0 && radio.length > 0) {
//         filteredProducts = filteredProducts.filter(
//           (product) => {
//             const matchesCategory = checked.includes(product.category);
//             const matchesBrand = radio.includes(product.brand);
//             return matchesCategory && matchesBrand;
//           }
//         );
//       }

//         // Sort products
//         if (sortBy === "price-low-high") {
//           filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
//         } else if (sortBy === "price-high-low") {
//           filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
//         } else if (sortBy === "name-a-z") {
//           filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
//         } else if (sortBy === "name-z-a") {
//           filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
//         } else if (sortBy === "rating-high-low") {
//           filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
//         }

//         dispatch(setProducts(filteredProducts));
//       }
//   }, [checked, radio, filteredProductsQuery.data, dispatch, sortBy]);

//   const handleBrandClick = (brand) => {
//     const productsByBrand = filteredProductsQuery.data?.filter(
//       (product) => product.brand === brand
//     );
//     dispatch(setProducts(productsByBrand));
//   };

//   const handleCheck = (value, id) => {
//     const updatedChecked = value
//       ? [...checked, id]
//       : checked.filter((c) => c !== id);
//     dispatch(setChecked(updatedChecked));
//   };

//   // Add "All Brands" option to uniqueBrands
//   const uniqueBrands = [
//     ...Array.from(
//       new Set(
//         filteredProductsQuery.data
//           ?.map((product) => product.brand)
//           .filter((brand) => brand !== undefined)
//       )
//     ),
//   ];

//   const handlePriceChange = (e) => {
//     setPriceFilter(e.target.value);
//   };

//   const handlePriceRangeChange = (index, value) => {
//     const newRange = [...priceRange];
//     newRange[index] = Number(value);
//     setPriceRange(newRange);
//   };

//   const resetFilters = () => {
//     window.location.reload();
//   };

//   const saveForLater = (product) => {
//     if (!savedForLater.some(item => item._id === product._id)) {
//     setSavedForLater(prev => [...prev, product]);
//     }
//   };

//   const removeFromSaved = (productId) => {
//     setSavedForLater(prev => prev.filter(item => item._id !== productId));
//   };

//   // Mock recommendations based on current viewed products
//   const recommendations = products.length > 0 ? 
//     products.slice(0, Math.min(4, products.length)) : [];

//   // Enhanced Product Card
//   const EnhancedProductCard = ({ product }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const isPrime = product.primeDiscount?.isEligible;
//     const randomReviews = Math.floor(Math.random() * 1000) + 5; // Random review count
    
//     console.log('Product:', product);
//     console.log('User Info:', userInfo);

//     return (
//       <div 
//         className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div className="relative">
//           {/* Badges */}
//           <div className="absolute top-2 left-2 flex flex-col gap-1">
//             {isPrime && (
//               <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
//                 <FaCrown className="mr-1" /> Prime
//               </span>
//             )}
//           </div>
          
//           {/* Quick actions overlay */}
//           {isHovered && (
//             <div className="absolute top-2 right-2 flex flex-col gap-2">
//               <button 
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   saveForLater(product);
//                 }}
//                 className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
//               >
//                 <FaHeart className="text-pink-500" />
//               </button>
//             </div>
//           )}
          
//           <Link to={`/product/${product._id}`}>
//             <div className="h-48 bg-gray-900 flex items-center justify-center p-4">
//               <img 
//                 src={product.image || "/placeholder-product.png"} 
//                 alt={product.name} 
//                 className="max-h-full max-w-full object-contain mix-blend-normal"
//               />
//             </div>
//           </Link>
//         </div>
        
//         <div className="p-4">
//           <Link to={`/product/${product._id}`}>
//             <h3 className="text-white font-medium line-clamp-2 hover:text-blue-400 transition-colors mb-1">{product.name}</h3>
//           </Link>
          
//           <div className="mb-3">
//             <div className="flex items-baseline">
//               {isPrime && userInfo?.isPrimeMember && product.primeDiscount?.price ? (
//                 <span className="text-2xl font-bold text-white">${product.primeDiscount.price.toFixed(2)}</span>
//               ) : (
//                 <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
//               )}
//               {isPrime && userInfo?.isPrimeMember && (
//                 <span className="ml-2 text-blue-500 text-sm">Prime Price</span>
//               )}
//             </div>
            
//             {/* Shipping info */}
//             <div className="text-sm text-green-500 mt-1 flex items-center">
//               <FaShippingFast className="mr-1" /> 
//               Free shipping
//               {isPrime && <span className="ml-1">with Prime</span>}
//             </div>
//           </div>
          
//           <div className="mt-4">
//             <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-full transition-colors">
//               Add to Cart
//             </button>
//             {isHovered && (
//               <Link to={`/product/${product._id}`} className="w-full mt-2 block">
//                 <button className="w-full border border-gray-400 text-gray-200 font-medium py-1.5 px-4 rounded-full hover:bg-gray-700 transition-colors text-sm">
//                 View Details
//               </button>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const handleShopNow = () => {
//     // Reset filters and show all products
//     dispatch(setChecked([]));
//     dispatch(setProducts(filteredProductsQuery.data));
//   };

//   const handleDealsAndDiscounts = () => {
//     // Filter products with discounts
//     const discountedProducts = filteredProductsQuery.data.filter(
//       (product) => product.primeDiscount?.isEligible || product.discount > 0
//     );
//     dispatch(setProducts(discountedProducts));
//   };

//   // Calculate initial min and max prices from all products
//   const allProducts = filteredProductsQuery.data || [];
//   const initialMinPrice = Math.min(...allProducts.map(p => p.price));
//   const initialMaxPrice = Math.max(...allProducts.map(p => p.price));

//   // Update price range state with initial values
//   useEffect(() => {
//     setPriceRange([initialMinPrice, initialMaxPrice]);
//   }, [initialMinPrice, initialMaxPrice]);

//   // Update min and max prices based on selected category and brand
//   useEffect(() => {
//     if (!filteredProductsQuery.isLoading) {
//       let filteredProducts = filteredProductsQuery.data;

//       if (checked.length > 0 && radio.length > 0) {
//         filteredProducts = filteredProducts.filter(
//           (product) => {
//             const matchesCategory = checked.includes(product.category);
//             const matchesBrand = radio.includes(product.brand);
//             return matchesCategory && matchesBrand;
//           }
//         );
//       }

//       const minPrice = Math.min(...filteredProducts.map(p => p.price));
//       const maxPrice = Math.max(...filteredProducts.map(p => p.price));
//       setPriceRange([minPrice, maxPrice]);
//     }
//   }, [checked, radio, filteredProductsQuery.data]);

//   // Filter products for prime members
//   const primeMemberProducts = userInfo?.isPrimeMember && filteredProductsQuery.data ? 
//     filteredProductsQuery.data.filter(
//       (product) => product.primeDiscount?.isEligible
//     ) : 
//     filteredProductsQuery.data || [];

//   // Update the products state with only prime member products
//   useEffect(() => {
//     if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
//       dispatch(setProducts(primeMemberProducts));
//     }
//   }, [filteredProductsQuery.data, dispatch, userInfo]);

//   return (
//     <div className="bg-black min-h-screen">
//       {/* Prime Banner */}
//       {!userInfo?.isPrimeMember && (
//         <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-2">
//           <div className="container mx-auto px-4">
//             <div className="flex flex-col md:flex-row items-center justify-between">
//               <div className="flex items-center">
//                 <FaCrown className="text-yellow-400 mr-2 text-xl" />
//                 <span className="text-white text-sm font-medium">Try Prime FREE for 30 days - Get exclusive deals & fast shipping</span>
//               </div>
//               <Link
//                 to="/prime"
//                 className="bg-yellow-400 text-black px-4 py-1 rounded-sm hover:bg-yellow-500 transition-colors text-sm font-bold mt-2 md:mt-0"
//               >
//                 Join Prime
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 py-8">
//         {/* Hero Banner */}
//         <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white p-6 rounded-lg mb-8 overflow-hidden relative">
//           {/* <div className="flex flex-col md:flex-row items-center justify-between">
//             <div className="z-10">
//             </div>
//           </div> */}
//           {/* Decorative elements */}
//           <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
//           <div className="absolute -top-8 -left-8 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-xl"></div>
//         </div>

//         {/* Main Content */}
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Mobile Filter Toggle */}
//           <div className="lg:hidden flex justify-between items-center mb-4">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-lg"
//             >
//               <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
//             </button>
            
//             <div className="relative inline-block">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="bg-gray-800 text-white py-2 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500"
//               >
//                 <option value="newest">Newest</option>
//                 <option value="price-low-high">Price: Low to High</option>
//                 <option value="price-high-low">Price: High to Low</option>
//                 <option value="name-a-z">Name: A to Z</option>
//                 <option value="name-z-a">Name: Z to A</option>
//                 <option value="rating-high-low">Highest Rated</option>
//               </select>
//               <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
//             </div>
//           </div>
          
//           {/* Filters Sidebar - Mobile (Collapsible) */}
//           <div 
//             className={`lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-300 ${
//               showFilters ? "opacity-100 visible" : "opacity-0 invisible"
//             }`}
//           >
//             <div className={`bg-[#151515] w-[80%] max-w-sm h-full overflow-y-auto transition-transform duration-300 ${
//               showFilters ? "translate-x-0" : "-translate-x-full"
//             }`}>
//               <div className="flex justify-between items-center p-4 border-b border-gray-700">
//                 <h2 className="text-lg font-semibold text-white">Filters</h2>
//                 <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
//                   <FaTimes size={20} />
//                 </button>
//               </div>
              
//               <div className="p-4">
//                 {renderFilters()}
//               </div>
//             </div>
//           </div>
          
//           {/* Filters Sidebar - Desktop */}
//           <div className="hidden lg:block w-72 shrink-0">
//             <div className="bg-[#151515] rounded-xl overflow-hidden sticky top-4">
//               {renderFilters()}
//             </div>
            
//             {/* Saved Items */}
//             {savedForLater.length > 0 && (
//               <div className="bg-[#151515] rounded-xl overflow-hidden mt-4 p-4">
//                 <h3 className="text-white font-medium mb-3 border-b border-gray-700 pb-2">Saved for Later</h3>
//                 <div className="space-y-3">
//                   {savedForLater.map(item => (
//                     <div key={item._id} className="flex items-center gap-2 text-sm">
//                       <img 
//                         src={item.image || "/placeholder-product.png"} 
//                         alt={item.name} 
//                         className="w-10 h-10 object-cover rounded"
//                       />
//                       <div className="flex-1 text-gray-300 line-clamp-1">{item.name}</div>
//                       <button 
//                         onClick={() => removeFromSaved(item._id)}
//                         className="text-gray-400 hover:text-white"
//                       >
//                         <FaTrash size={12} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Main Content Area */}
//           <div className="flex-1">
//             {/* Desktop Sorting and Results Count */}
//             <div className="hidden lg:flex justify-between items-center mb-6">
//               <div className="text-white">
//                 <span className="font-medium">{products?.length}</span> results
//               </div>
              
//               <div className="relative inline-block">
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="bg-gray-800 text-white py-2 pl-4 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500"
//                 >
//                   <option value="newest">Newest</option>
//                   <option value="price-low-high">Price: Low to High</option>
//                   <option value="price-high-low">Price: High to Low</option>
//                   <option value="name-a-z">Name: A to Z</option>
//                   <option value="name-z-a">Name: Z to A</option>
//                   <option value="rating-high-low">Highest Rated</option>
//                 </select>
//                 <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
//               </div>
//             </div>
            
//             {/* Results Count - Mobile */}
//             <h2 className="lg:hidden text-lg font-semibold text-white mb-4">
//               {products?.length} Products Found
//             </h2>
            
//             {/* Prime Products Section */}
//             {userInfo?.isPrimeMember && (
//               <div className="mb-8">
//                 <div className="flex items-center mb-4">
//                   <FaCrown className="text-yellow-400 mr-2" />
//                   <h2 className="text-xl font-bold text-white">Prime Exclusive Deals</h2>
//                 </div>
//                 <PrimeProducts products={products} />
//               </div>
//             )}
            
//             {/* Products Grid */}
//             {products.length === 0 ? (
//               <div className="flex flex-col justify-center items-center h-64 bg-[#111111] rounded-lg border border-gray-800 p-8">
//                 <Loader />
//                 <p className="text-gray-400 mt-4">Searching for products...</p>
//               </div>
//             ) : (
//               <div>
//                 <h2 className="text-xl font-bold text-white mb-4">{userInfo?.isPrimeMember ? 'Prime Deals' : 'All Products'}</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                   {products.map((p) => (
//                     <EnhancedProductCard key={p._id} product={p} />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
  
//   function renderFilters() {
//     return (
//       <>
//         {/* Prime Filter */}
//         {userInfo?.isPrimeMember && (
//           <div className="p-4 border-b border-gray-700">
//             <div className="flex items-center justify-between">
//               <label className="inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-offset-gray-800"
//                 />
//                 <span className="ml-2 text-white flex items-center">
//                   <FaCrown className="text-yellow-400 mr-1" /> Prime Eligible
//                 </span>
//               </label>
//             </div>
//           </div>
//         )}
        
//         {/* Categories Section */}
//         <div className="p-4 border-b border-gray-700">
//           <h2 className="flex items-center justify-between text-white font-medium mb-3">
//             <span>Categories</span>
//             <FaAngleRight className="text-gray-400" />
//           </h2>
          
//           <div className="space-y-2">
//             {categories?.map((c) => (
//               <div key={c._id} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id={`category-${c._id}`}
//                   onChange={(e) => handleCheck(e.target.checked, c._id)}
//                   className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-800"
//                 />
//                 <label
//                   htmlFor={`category-${c._id}`}
//                   className="ml-2 text-sm text-gray-300 hover:text-white cursor-pointer"
//                 >
//                   {c.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Brands Section */}
//         <div className="p-4 border-b border-gray-700">
//           <h2 className="flex items-center justify-between text-white font-medium mb-3">
//             <span>Brands</span>
//             <FaAngleRight className="text-gray-400" />
//           </h2>
          
//           <div className="space-y-2">
//             {uniqueBrands?.map((brand) => (
//               <div key={brand} className="flex items-center">
//                 <input
//                   type="radio"
//                   id={`brand-${brand}`}
//                   name="brand"
//                   onChange={() => handleBrandClick(brand)}
//                   className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500 focus:ring-offset-gray-800"
//                 />
//                 <label
//                   htmlFor={`brand-${brand}`}
//                   className="ml-2 text-sm text-gray-300 hover:text-white cursor-pointer"
//                 >
//                   {brand}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Price Range Slider */}
//         <div className="p-4 border-b border-gray-700">
//           <h2 className="flex items-center justify-between text-white font-medium mb-3">
//             <span>Price Range</span>
//             <FaAngleRight className="text-gray-400" />
//           </h2>
          
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="w-5/12">
//                 <label className="text-gray-400 text-xs block mb-1">Min</label>
//                 <input
//                   type="number"
//                   min="0"
//                   value={priceRange[0]}
//                   onChange={(e) => handlePriceRangeChange(0, e.target.value)}
//                   className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 text-sm"
//                 />
//               </div>
//               <div className="text-gray-500">-</div>
//               <div className="w-5/12">
//                 <label className="text-gray-400 text-xs block mb-1">Max</label>
//                 <input
//                   type="number"
//                   min={priceRange[0]}
//                   value={priceRange[1]}
//                   onChange={(e) => handlePriceRangeChange(1, e.target.value)}
//                   className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 text-sm"
//                 />
//               </div>
//             </div>
            
//             <div className="relative">
//               <input
//                 type="range"
//                 min="0"
//                 max="5000"
//                 value={priceRange[1]}
//                 onChange={(e) => handlePriceRangeChange(1, e.target.value)}
//                 className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
//               />
//             </div>
            
//             {/* Price Search */}
//             <div className="relative mt-3">
//               <div className="flex items-center border border-gray-700 rounded-lg bg-gray-800 focus-within:border-pink-500 overflow-hidden">
//               <div className="pl-3 pr-1">
//                   <FaSearch className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search by price"
//                   value={priceFilter}
//                   onChange={handlePriceChange}
//                   className="w-full py-2 px-2 bg-transparent text-white focus:outline-none text-sm"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Reset Filters */}
//         <div className="p-4">
//           <button
//             onClick={resetFilters}
//             className="w-full py-2 text-center border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors font-medium"
//           >
//             Reset Filters
//           </button>
//         </div>
//       </>
//     );
//   }
// };

// export default Shop;
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
  FaTrash
} from "react-icons/fa";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import PrimeProducts from "./Products/PrimeProducts";
import { Link } from 'react-router-dom';
import PrimePrice from '../components/PrimePrice';

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const { userInfo } = useSelector((state) => state.auth);

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewHistory, setViewHistory] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [isPrimeOnly, setIsPrimeOnly] = useState(false);

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
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, sortBy, priceRange, isPrimeOnly, userInfo]);

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

  const saveForLater = (product) => {
    if (!savedForLater.some(item => item._id === product._id)) {
    setSavedForLater(prev => [...prev, product]);
    }
  };

  const removeFromSaved = (productId) => {
    setSavedForLater(prev => prev.filter(item => item._id !== productId));
  };

  // Mock recommendations based on current viewed products
  const recommendations = products.length > 0 ? 
    products.slice(0, Math.min(4, products.length)) : [];

  // Enhanced Product Card
  const EnhancedProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isPrime = product.primeDiscount?.isEligible;
    const randomReviews = Math.floor(Math.random() * 1000) + 5; // Random review count
    
    // Calculate the displayed price based on user membership and product eligibility
    const displayPrice = isPrime && userInfo?.isPrimeMember && product.primeDiscount?.price ? 
      product.primeDiscount.price : product.price;
    
    // Calculate the savings percentage if there's a prime discount
    const savingsPercentage = isPrime && userInfo?.isPrimeMember && product.primeDiscount?.price ? 
      Math.round((1 - (product.primeDiscount.price / product.price)) * 100) : 0;

    return (
      <div 
        className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isPrime && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                <FaCrown className="mr-1" /> Prime
              </span>
            )}
          </div>
          
          {/* Quick actions overlay */}
          {isHovered && (
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  saveForLater(product);
                }}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
              >
                <FaHeart className="text-pink-500" />
              </button>
            </div>
          )}
          
          <Link to={`/product/${product._id}`}>
            <div className="h-48 bg-gray-900 flex items-center justify-center p-4">
              <img 
                src={product.image || "/placeholder-product.png"} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain mix-blend-normal"
              />
            </div>
          </Link>
        </div>
        
        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-white font-medium line-clamp-2 hover:text-blue-400 transition-colors mb-1">{product.name}</h3>
          </Link>
          
          <div className="mb-3">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">${displayPrice.toFixed(2)}</span>
              
              {/* Show original price if prime discount is applied */}
              {isPrime && userInfo?.isPrimeMember && product.primeDiscount?.price && (
                <span className="ml-2 text-gray-400 line-through text-sm">${product.price.toFixed(2)}</span>
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
          
          <div className="mt-4">
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-full transition-colors">
              Add to Cart
            </button>
            {isHovered && (
              <Link to={`/product/${product._id}`} className="w-full mt-2 block">
                <button className="w-full border border-gray-400 text-gray-200 font-medium py-1.5 px-4 rounded-full hover:bg-gray-700 transition-colors text-sm">
                View Details
              </button>
              </Link>
            )}
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
            {savedForLater.length > 0 && (
              <div className="bg-[#151515] rounded-xl overflow-hidden mt-4 p-4">
                <h3 className="text-white font-medium mb-3 border-b border-gray-700 pb-2">Saved for Later</h3>
                <div className="space-y-3">
                  {savedForLater.map(item => (
                    <div key={item._id} className="flex items-center gap-2 text-sm">
                      <img 
                        src={item.image || "/placeholder-product.png"} 
                        alt={item.name} 
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 text-gray-300 line-clamp-1">{item.name}</div>
                      <button 
                        onClick={() => removeFromSaved(item._id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            
            {/* Prime Products Section */}
            {userInfo?.isPrimeMember && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaCrown className="text-yellow-400 mr-2" />
                  <h2 className="text-xl font-bold text-white">Prime Exclusive Deals</h2>
                </div>
                <PrimeProducts products={products.filter(p => p.primeDiscount?.isEligible)} />
              </div>
            )}
            
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((p) => (
                    <EnhancedProductCard key={p._id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  function renderFilters() {
    return (
      <>
        {/* Prime Filter */}
        {userInfo?.isPrimeMember && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimeOnly}
                  onChange={(e) => setIsPrimeOnly(e.target.checked)}
                  className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-white flex items-center">
                  <FaCrown className="text-yellow-400 mr-1" /> Prime Eligible
                </span>
              </label>
            </div>
          </div>
        )}
        
        {/* Categories Section */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="flex items-center justify-between text-white font-medium mb-3">
            <span>Categories</span>
            <FaAngleRight className="text-gray-400" />
          </h2>
          
          <div className="space-y-2">
            {categories?.map((c) => (
              <div key={c._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${c._id}`}
                  checked={checked.includes(c._id)}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-offset-gray-800"
                />
                <label
                  htmlFor={`category-${c._id}`}
                  className="ml-2 text-sm text-gray-300 hover:text-white cursor-pointer"
                >
                  {c.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Brands Section */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="flex items-center justify-between text-white font-medium mb-3">
            <span>Brands</span>
            <FaAngleRight className="text-gray-400" />
          </h2>
          
          <div className="space-y-2">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  type="radio"
                  id={`brand-${brand}`}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500 focus:ring-offset-gray-800"
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-2 text-sm text-gray-300 hover:text-white cursor-pointer"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Range Slider */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="flex items-center justify-between text-white font-medium mb-3">
            <span>Price Range</span>
            <FaAngleRight className="text-gray-400" />
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-5/12">
                <label className="text-gray-400 text-xs block mb-1">Min</label>
                <input
                  type="number"
                  min="0"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 text-sm"
                />
              </div>
              <div className="text-gray-500">-</div>
              <div className="w-5/12">
                <label className="text-gray-400 text-xs block mb-1">Max</label>
                <input
                  type="number"
                  min={priceRange[0]}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-1 text-sm"
                />
              </div>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min={initialMinPrice}
                max={initialMaxPrice}
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
              />
            </div>
            
            {/* Price Search */}
            <div className="relative mt-3">
              <div className="flex items-center border border-gray-700 rounded-lg bg-gray-800 focus-within:border-pink-500 overflow-hidden">
              <div className="pl-3 pr-1">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by price"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full py-2 px-2 bg-transparent text-white focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Reset Filters */}
        <div className="p-4">
          <button
            onClick={resetFilters}
            className="w-full py-2 text-center border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-colors font-medium"
            >
              Reset Filters
            </button>
          </div>
        </>
      );
    }
  };
  
  export default Shop;