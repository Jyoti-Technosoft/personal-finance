// store.js
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./reduxSlices/dashboardSlice";
import navbarReducer from "./reduxSlices/navbarSlice";

const store = configureStore({
  reducer: {
    dashboardSlice: dashboardReducer,
    navbarSlice: navbarReducer,
  },
});

export default store;
