import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="min-h-screen bg-black text-white">
      {!keyword && <Header />}
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : isError ? (
        <div className="container mx-auto px-4 py-10">
          <Message variant="danger">
            {isError?.data.message || isError.error}
          </Message>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-20">
          <div className="mb-16">
            <div className="flex items-center mb-4">
              <div className="w-10 h-[1px] bg-pink-500 mr-4"></div>
              <h3 className="text-sm uppercase tracking-widest text-pink-500 font-light">Collection</h3>
            </div>
            <h2 className="text-5xl font-bold text-white">Featured Products</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {data.products.slice(0, 8).map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>

          {data.products.length > 8 && (
            <div className="mt-20 text-center">
              <Link 
                to="/shop" 
                className="inline-block px-10 py-4 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider text-sm"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
