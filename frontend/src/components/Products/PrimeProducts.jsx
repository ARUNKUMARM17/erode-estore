import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { FaCrown } from 'react-icons/fa';

const PrimeProducts = ({ products }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const isPrimeMember = userInfo?.isPrimeMember || localStorage.getItem("isPrimeMember") === "true";

  if (!isPrimeMember) {
    return null;
  }

  const primeProducts = products.filter(product => product.primeDiscount?.isEligible);

  if (primeProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <FaCrown className="text-yellow-400 text-2xl" />
        <h2 className="text-2xl font-bold text-white">Prime Member Deals</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {primeProducts.map((product) => (
          <div key={product._id} className="relative">
            <div className="absolute top-2 right-2 z-10">
              <FaCrown className="text-yellow-400" />
            </div>
            <ProductCard p={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimeProducts; 