import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Oops! Page not found</h2>
      <p className="text-gray-600 mb-6">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
