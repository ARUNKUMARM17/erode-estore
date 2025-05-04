import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaCrown } from 'react-icons/fa';
import ProductCard from './ProductCard';
import PrimePrice from '../../components/PrimePrice';

const PrimeProducts = ({ products }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const isPrimeMember = userInfo?.isPrimeMember || localStorage.getItem("isPrimeMember") === "true";
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const primeProducts = products?.filter(p => p.primeDiscount?.isEligible);
  const totalPages = Math.ceil(primeProducts?.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = primeProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

  if (!primeProducts?.length) return null;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-pink-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
        >
          Previous
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FaCrown className="text-yellow-400" size={24} />
        <h2 className="text-2xl font-bold text-white">Prime Exclusive Deals</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((p) => (
          <div key={p._id} className="relative">
            <div className="absolute top-2 right-2 z-10">
              <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
                <FaCrown size={12} />
                <span>Prime</span>
              </div>
            </div>
            <div className="bg-[#151515] rounded-xl overflow-hidden">
              <ProductCard p={p} showPrice={false} />
              <div className="p-4">
                <PrimePrice product={p} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {renderPagination()}
    </div>
  );
};

export default PrimeProducts;