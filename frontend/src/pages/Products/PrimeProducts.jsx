import React from 'react';
import { useSelector } from 'react-redux';
import { FaCrown } from 'react-icons/fa';
import ProductCard from './ProductCard';
import PrimePrice from '../../components/PrimePrice';

const PrimeProducts = ({ products }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const isPrimeMember = userInfo?.isPrimeMember || localStorage.getItem("isPrimeMember") === "true";
  const primeProducts = products?.filter(p => p.primeDiscount?.isEligible);

  if (!primeProducts?.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FaCrown className="text-yellow-400" size={24} />
        <h2 className="text-2xl font-bold text-white">Prime Exclusive Deals</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {primeProducts.map((p) => (
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
    </div>
  );
};

export default PrimeProducts;