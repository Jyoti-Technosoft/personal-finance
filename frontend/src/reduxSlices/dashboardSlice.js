import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState: {
    dashboardUserData: [],
    dashboardAccountData: [],
    dashboardPinData: [],
    dashboardTransectionData: [],
    pinButton: false,
  },
  reducers: {
    setDashboardUserData: (state, action) => {
      state.dashboardUserData = action.payload;
    },
    setDashboardAccountData: (state, action) => {
      state.dashboardAccountData = action.payload;
    },
    setDashboardPinData: (state, action) => {
      state.dashboardPinData = action.payload;
    },
    setDashboardTransectionData: (state, action) => {
      state.dashboardTransectionData = action.payload;
    },
    setPinButton: (state, action) => {
      state.pinButton = action.payload;
    },
  },
});

export const {
  setDashboardUserData,
  setDashboardAccountData,
  setDashboardPinData,
  setDashboardTransectionData,
  setPinButton,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
