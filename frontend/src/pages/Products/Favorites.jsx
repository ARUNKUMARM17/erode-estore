import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFavorites = favorites.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] to-[#23232b] flex flex-col items-center py-10 px-2">
      <div className="flex items-center gap-3 mb-8">
        <FaHeart className="text-pink-500 text-3xl" />
        <h1 className="text-3xl font-bold text-white tracking-wide">Your Favourites</h1>
      </div>
      {favorites.length === 0 ? (
        <div className="text-gray-400 text-lg text-center py-16">No favourites yet. Click the heart icon on any product to add it here!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
          {currentFavorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
      <aside className="backdrop-blur-lg bg-gradient-to-br from-[#23232b]/80 to-[#18181b]/70 border border-gray-800 rounded-2xl shadow-xl sticky top-8 p-6 w-full max-w-xs mx-auto lg:mx-0 z-20">
        {/* ...Prime, Category, Brand, Price, Clear All... */}
      </aside>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full bg-gray-800 text-white font-bold shadow hover:bg-pink-600 disabled:opacity-50 transition-all"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-4 py-2 rounded-full font-bold shadow transition-all ${currentPage === idx + 1 ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-pink-600 hover:text-white'}`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-full bg-gray-800 text-white font-bold shadow hover:bg-pink-600 disabled:opacity-50 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
