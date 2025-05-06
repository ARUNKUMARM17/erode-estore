import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import { FaEdit, FaTrash, FaSearch, FaSort, FaPlus, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  useEffect(() => {
    if (products) {
      let sortedProducts = [...products];

      // Apply search filter
      if (searchTerm.trim() !== "") {
        sortedProducts = sortedProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.category && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      switch (sortOrder) {
        case 'newest':
          sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'priceAsc':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'nameAsc':
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'nameDesc':
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }

      setFilteredProducts(sortedProducts);
    }
  }, [products, sortOrder, searchTerm]);

  const handleStockFilter = (filter) => {
    setStockFilter(filter);
    setFilterMenuOpen(false);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setSortMenuOpen(false);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Product list refreshed");
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-menu') && !event.target.closest('.sort-menu')) {
        setFilterMenuOpen(false);
        setSortMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Products</h1>
          <p className="text-gray-400 mb-6">We encountered a problem while loading the product data.</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="flex">
        {/* Sidebar - Fixed position */}

        {/* Main Content */}
        <div className="w-full pl-64">
          <div className="max-w-[calc(100vw-16rem)] mx-auto p-6">
            {/* Header Section */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                {/* Left side - Title */}
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Product Management
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Manage your product inventory and listings
                  </p>
                </div>
                
                {/* Right side - Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Link 
                    to="/admin/dashboard"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    Admin Dashboard
                  </Link>
                  
                  <Link 
                    to="/admin/productlist"
                    className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all duration-300"
                  >
                    <FaPlus className="mr-2" />
                    Add Product
                  </Link>
                  
                  <button 
                    onClick={handleRefresh}
                    className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>

                  <Link 
                    to="/admin/categorylist"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    Create Category
                  </Link>
                </div>
              </div>
              
              {/* Search and Filters Row */}
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="flex-1 relative w-full">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                    placeholder="Search products by name, brand, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Filters */}
                <div className="flex gap-3 shrink-0">
                  <div className="relative filter-menu">
                    <button
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border transition-all duration-300 ${
                        stockFilter !== "all"
                          ? "bg-pink-600 border-pink-600 hover:bg-pink-700"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterMenuOpen(!filterMenuOpen);
                        setSortMenuOpen(false);
                      }}
                    >
                      <FaFilter className="text-sm" />
                      <span>Filter</span>
                    </button>
                    
                    {filterMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-[9999] border border-gray-700 overflow-hidden">
                        <div className="py-2">
                          <button
                            onClick={() => handleStockFilter("all")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              stockFilter === "all" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            All Products
                          </button>
                          <button
                            onClick={() => handleStockFilter("inStock")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              stockFilter === "inStock" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            In Stock
                          </button>
                          <button
                            onClick={() => handleStockFilter("outOfStock")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              stockFilter === "outOfStock" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            Out of Stock
                          </button>
                          <button
                            onClick={() => handleStockFilter("lowStock")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              stockFilter === "lowStock" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            Low Stock
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative sort-menu">
                    <button
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortMenuOpen(!sortMenuOpen);
                        setFilterMenuOpen(false);
                      }}
                    >
                      <FaSort className="text-sm" />
                      <span>Sort</span>
                    </button>
                    
                    {sortMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl z-[9999] border border-gray-700 overflow-hidden">
                        <div className="py-2">
                          <button
                            onClick={() => handleSort("newest")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              sortOrder === "newest" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            Newest First
                          </button>
                          <button
                            onClick={() => handleSort("oldest")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              sortOrder === "oldest" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            Oldest First
                          </button>
                          <button
                            onClick={() => handleSort("priceAsc")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              sortOrder === "priceAsc" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            Price: Low to High
                          </button>
                          <button
                            onClick={() => handleSort("priceDesc")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              sortOrder === "priceDesc" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            Price: High to Low
                          </button>
                          <button
                            onClick={() => handleSort("nameAsc")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              sortOrder === "nameAsc" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            Name: A to Z
                          </button>
                          <button
                            onClick={() => handleSort("nameDesc")}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                              sortOrder === "nameDesc" ? "bg-pink-600/20 text-pink-500" : ""
                            }`}
                          >
                            Name: Z to A
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStockFilter("all");
                    setSortOrder("newest");
                  }}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-900">
                    <img
                      src={product.image}
                      alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                      {product.countInStock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]" title={product.name}>
                          {product.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <span className="truncate max-w-[100px]" title={product.brand}>{product.brand}</span>
                          {product.category?.name && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="truncate max-w-[100px]" title={product.category.name}>
                                {product.category.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xl font-bold text-pink-500">
                          ₹{product.price.toLocaleString()}
                        </div>
                        <div className={`text-sm px-2 py-1 rounded ${
                          product.countInStock > 5 
                            ? "bg-green-500/20 text-green-500" 
                            : product.countInStock > 0 
                              ? "bg-yellow-500/20 text-yellow-500" 
                              : "bg-red-500/20 text-red-500"
                        }`}>
                          {product.countInStock > 5 
                            ? `In Stock (${product.countInStock})` 
                            : product.countInStock > 0 
                              ? `Low Stock (${product.countInStock})` 
                              : "Out of Stock"}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </Link>
                        <Link
                          to={`/product/${product._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
