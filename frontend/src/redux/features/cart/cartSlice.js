import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "Stripe" 
};

// Try to load state from localStorage, but use initialState as fallback
const loadState = () => {
  try {
    const savedState = localStorage.getItem("cart");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Ensure cartItems exists and set default payment method to Stripe
      return {
        ...initialState,
        ...parsedState,
        paymentMethod: "Stripe", 
        cartItems: Array.isArray(parsedState.cartItems) ? parsedState.cartItems : []
      };
    }
    return initialState;
  } catch (error) {
    console.error('Error loading cart state:', error);
    return initialState;
  }
};

const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Calculate shipping price (if order is over $100 then free, else $10 shipping)
  state.shippingPrice = state.itemsPrice > 10 ? 0 : 10;

  // Calculate tax price (15% tax)
  state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));

  // Calculate total price
  state.totalPrice = (
    state.itemsPrice +
    state.shippingPrice +
    state.taxPrice
  ).toFixed(2);

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadState(),
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      
      if (!state.cartItems) {
        state.cartItems = [];
      }

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      if (!state.cartItems) {
        state.cartItems = [];
      }

      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },

    resetCart: () => {
      localStorage.removeItem("cart");
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;