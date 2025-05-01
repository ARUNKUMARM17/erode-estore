import React from 'react';
import { FaTruck, FaGift, FaVideo, FaMusic, FaBook } from 'react-icons/fa';

const PrimeComponents = () => {
  const primeBenefits = [
    {
      icon: <FaTruck className="text-2xl text-blue-600" />,
      title: "Free & Fast Delivery",
      description: "Get free delivery on millions of items with Prime shipping"
    },
    {
      icon: <FaGift className="text-2xl text-blue-600" />,
      title: "Exclusive Deals",
      description: "Access to Prime Day deals and exclusive member discounts"
    },
    {
      icon: <FaVideo className="text-2xl text-blue-600" />,
      title: "Prime Video",
      description: "Stream thousands of movies and TV shows"
    },
    {
      icon: <FaMusic className="text-2xl text-blue-600" />,
      title: "Prime Music",
      description: "Ad-free music streaming with millions of songs"
    },
    {
      icon: <FaBook className="text-2xl text-blue-600" />,
      title: "Prime Reading",
      description: "Access to a rotating selection of books and magazines"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Prime Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {primeBenefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex-shrink-0">
              {benefit.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{benefit.title}</h3>
              <p className="text-gray-600 mt-1">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimeComponents; 