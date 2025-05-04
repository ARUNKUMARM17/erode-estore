import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log('setCredentials action:', action.payload);
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      
      // Update Prime status in localStorage
      if (action.payload?.isPrimeMember) {
        console.log('User is a Prime Member');
        localStorage.setItem("isPrimeMember", "true");
        localStorage.setItem("primeSubscription", JSON.stringify(action.payload.primeSubscription));
      } else {
        console.log('User is not a Prime Member');
        localStorage.removeItem("isPrimeMember");
        localStorage.removeItem("primeSubscription");
      }
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("isPrimeMember");
      localStorage.removeItem("primeSubscription");
    },
    updatePrimeStatus: (state, action) => {
      if (state.userInfo) {
        state.userInfo = {
          ...state.userInfo,
          isPrimeMember: action.payload.isPrimeMember,
          primeSubscription: action.payload.primeSubscription
        };
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
        
        if (action.payload.isPrimeMember) {
          console.log('Updating Prime status: User is a Prime Member');
          localStorage.setItem("isPrimeMember", "true");
          localStorage.setItem("primeSubscription", JSON.stringify(action.payload.primeSubscription));
        } else {
          console.log('Updating Prime status: User is not a Prime Member');
          localStorage.removeItem("isPrimeMember");
          localStorage.removeItem("primeSubscription");
        }
      }
    },
  },
});

export const { setCredentials, logout, updatePrimeStatus } = authSlice.actions;

export default authSlice.reducer;
