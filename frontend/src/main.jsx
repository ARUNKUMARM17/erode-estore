// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { Provider } from "react-redux";
// import store from "./redux/store";
// import { Route, RouterProvider, createRoutesFromElements } from "react-router";
// import { createBrowserRouter } from "react-router-dom";
// import { Elements } from '@stripe/react-stripe-js';
// import stripePromise from './config/stripe';

// import PrivateRoute from "./components/PrivateRoute";

// // Auth
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";

// import AdminRoute from "./pages/Admin/AdminRoute";
// import Profile from "./pages/User/Profile";
// import UserOrders from "./pages/User/UserOrders.jsx";
// import UserList from "./pages/Admin/UserList";

// import CategoryList from "./pages/Admin/CategoryList";

// import ProductList from "./pages/Admin/ProductList";
// import AllProducts from "./pages/Admin/AllProducts";
// import ProductUpdate from "./pages/Admin/ProductUpdate";

// import Home from "./pages/Home.jsx";
// import Favorites from "./pages/Products/Favorites.jsx";
// import ProductDetails from "./pages/Products/ProductDetails.jsx";
// import PrimeMembership from "./pages/PrimeMembership.jsx";

// import Cart from "./pages/Cart.jsx";
// import Shop from "./pages/Shop.jsx";

// import Shipping from "./pages/Orders/Shipping.jsx";
// import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
// import Order from "./pages/Orders/Order.jsx";
// import OrderList from "./pages/Admin/OrderList.jsx";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />}>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route index={true} path="/" element={<Home />} />
//       <Route path="/favorite" element={<Favorites />} />
//       <Route path="/product/:id" element={<ProductDetails />} />
//       <Route path="/cart" element={<Cart />} />
//       <Route path="/shop" element={<Shop />} />
//       <Route path="/prime" element={<PrimeMembership />} />

//       {/* Registered users */}
//       <Route path="" element={<PrivateRoute />}>
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/user-orders" element={<UserOrders />} />
//         <Route path="/shipping" element={<Shipping />} />
//         <Route path="/placeorder" element={<PlaceOrder />} />
//         <Route path="/order/:id" element={<Order />} />
//       </Route>

//       <Route path="/admin" element={<AdminRoute />}>
//         <Route path="userlist" element={<UserList />} />
//         <Route path="categorylist" element={<CategoryList />} />
//         <Route path="productlist" element={<ProductList />} />
//         <Route path="allproductslist" element={<AllProducts />} />
//         <Route path="productlist/:pageNumber" element={<ProductList />} />
//         <Route path="product/update/:_id" element={<ProductUpdate />} />
//         <Route path="orderlist" element={<OrderList />} />
//         <Route path="dashboard" element={<AdminDashboard />} />
//       </Route>
//     </Route>
//   )
// );

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <Elements stripe={stripePromise}>
//       <PayPalScriptProvider>
//         <RouterProvider router={router} />
//       </PayPalScriptProvider>
//     </Elements>
//   </Provider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "./config/stripe";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Routes
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./pages/Admin/AdminRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// User Pages
import Profile from "./pages/User/Profile";
import UserOrders from "./pages/User/UserOrders.jsx";

// Admin Pages
import UserList from "./pages/Admin/UserList";
import CategoryList from "./pages/Admin/CategoryList";
import ProductList from "./pages/Admin/ProductList";
import AllProducts from "./pages/Admin/AllProducts";
import ProductUpdate from "./pages/Admin/ProductUpdate";
import OrderList from "./pages/Admin/OrderList";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

// Shop & Orders
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import PrimeMembership from "./pages/PrimeMembership.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import Order from "./pages/Orders/Order.jsx";

// 404
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="favorite" element={<Favorites />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="cart" element={<Cart />} />
      <Route path="shop" element={<Shop />} />
      <Route path="prime" element={<PrimeMembership />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route path="user-orders" element={<UserOrders />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="placeorder" element={<PlaceOrder />} />
        <Route path="order/:id" element={<Order />} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Suspense fallback={<div>Loading...</div>}>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <PayPalScriptProvider>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Elements>
    </Provider>
  </React.Suspense>
);
