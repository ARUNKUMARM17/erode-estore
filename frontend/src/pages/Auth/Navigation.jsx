import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose
} from "react-icons/ai";
import { FaHeart, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.cart || { cartItems: [] });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="block md:hidden fixed top-4 right-4 z-[10000]">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 bg-black rounded-md"
        >
          {mobileMenuOpen ? (
            <AiOutlineClose className="text-white" size={24} />
          ) : (
            <AiOutlineMenu className="text-white" size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-8">
            <Link
              to="/"
              className="flex items-center text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <AiOutlineHome className="mr-2" size={26} />
              <span>HOME</span>
            </Link>

            <Link
              to="/shop"
              className="flex items-center text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <AiOutlineShopping className="mr-2" size={26} />
              <span>SHOP</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <AiOutlineShoppingCart className="mr-2" size={26} />
              <span>CART</span>
              {cartItems && cartItems.length > 0 && (
                <span className="ml-1 px-2 py-1 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>

            <Link
              to="/favorite"
              className="flex items-center text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaHeart className="mr-2" size={20} />
              <span>FAVORITES</span>
              <FavoritesCount />
            </Link>

            <Link
              to="/prime"
              className="flex items-center text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>PRIME</span>
              {userInfo?.isPrimeMember && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
                  Active
                </span>
              )}
            </Link>

            {userInfo && !userInfo.isAdmin && (
              <Link
                to="/user-orders"
                className="flex items-center text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaClipboardList className="mr-2" size={20} />
                <span>MY ORDERS</span>
              </Link>
            )}

            {userInfo ? (
              <div className="flex flex-col items-center space-y-4">
                <span className="text-white">{userInfo.username}</span>
                <Link
                  to="/profile"
                  className="text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {userInfo.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logoutHandler();
                    setMobileMenuOpen(false);
                  }}
                  className="text-white bg-pink-600 px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Link
                  to="/login"
                  className="flex items-center text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <AiOutlineLogin className="mr-2" size={26} />
                  <span>LOGIN</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <AiOutlineUserAdd className="mr-2" size={26} />
                  <span>REGISTER</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        style={{ zIndex: 9998 }}
        className={`${
          showSidebar ? "hidden" : "flex"
        } xl:flex lg:flex md:flex hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-[100vh] fixed`}
        id="navigation-container"
      >
        <div className="flex flex-col justify-center space-y-4">
          <Link
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">HOME</span>{" "}
          </Link>

          <Link
            to="/shop"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">SHOP</span>{" "}
          </Link>

          <Link to="/cart" className="flex relative">
            <div className="flex items-center transition-transform transform hover:translate-x-2">
              <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Cart</span>{" "}
            </div>

            <div className="absolute top-9">
              {cartItems && cartItems.length > 0 && (
                <span>
                  <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                </span>
              )}
            </div>
          </Link>

          <Link to="/favorite" className="flex relative">
            <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
              <FaHeart className="mt-[3rem] mr-2" size={20} />
              <span className="hidden nav-item-name mt-[3rem]">
                Favorites
              </span>{" "}
              <FavoritesCount />
            </div>
          </Link>

          <Link to="/prime" className="flex relative">
            <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
              <svg
                className="mt-[3rem] mr-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden nav-item-name mt-[3rem]">
                Prime
              </span>{" "}
              {userInfo?.isPrimeMember && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
                  Active
                </span>
              )}
            </div>
          </Link>

          {userInfo && !userInfo.isAdmin && (
            <Link to="/user-orders" className="flex relative">
              <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
                <FaClipboardList className="mt-[3rem] mr-2" size={20} />
                <span className="hidden nav-item-name mt-[3rem]">
                  My Orders
                </span>{" "}
              </div>
            </Link>
          )}
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-800 focus:outline-none"
          >
            {userInfo ? (
              <span className="text-white">{userInfo.username}</span>
            ) : (
              <></>
            )}
            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 ${
                !userInfo.isAdmin ? "-top-20" : "-top-80"
              } `}
            >
              {userInfo.isAdmin && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/categorylist"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
          {!userInfo && (
            <ul>
              <li>
                <Link
                  to="/login"
                  className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                >
                  <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
                  <span className="hidden nav-item-name">LOGIN</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                >
                  <AiOutlineUserAdd className="mr-2 mt-[4px]" size={26} />
                  <span className="hidden nav-item-name">REGISTER</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
