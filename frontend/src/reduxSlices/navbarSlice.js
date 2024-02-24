import { createSlice } from "@reduxjs/toolkit";

const navbarSlice = createSlice({
  name: "navbarSlice",
  initialState: {
    isSidebarOpen: "true",
  },
  reducers: {
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setIsSidebarOpen } = navbarSlice.actions;

export default navbarSlice.reducer;
