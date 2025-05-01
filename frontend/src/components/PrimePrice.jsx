import React from 'react';
import { useSelector } from 'react-redux';
import { FaCrown } from 'react-icons/fa';

const PrimePrice = ({ product }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const isPrimeMember = userInfo?.isPrimeMember || localStorage.getItem("isPrimeMember") === "true";

  if (!product.primeDiscount?.isEligible) {
    return (
      <div className="text-xl font-bold text-pink-500">₹{product.regularPrice.toLocaleString()}</div>
    );
  }

  return (
    <div className="space-y-1">
      {isPrimeMember ? (
        <>
          <div className="flex items-center gap-2">
            <FaCrown className="text-yellow-400" />
            <span className="text-xl font-bold text-pink-500">
              ₹{product.primeDiscount.discountedPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm line-through text-gray-400">
              ₹{product.regularPrice.toLocaleString()}
            </span>
            <span className="text-sm text-green-500">
              Save ₹{(product.regularPrice - product.primeDiscount.discountedPrice).toLocaleString()}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="text-xl font-bold text-pink-500">₹{product.regularPrice.toLocaleString()}</div>
          {product.primeDiscount?.isEligible && (
            <div className="flex items-center gap-1 text-sm text-yellow-400">
              <FaCrown size={12} />
              <span>Prime eligible</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PrimePrice; 