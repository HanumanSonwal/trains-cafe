import { createSlice } from "@reduxjs/toolkit";

const stationSlice = createSlice({
  name: "station",
  initialState: {
    selectedStation: null,
  },
  reducers: {
    setSelectedStation: (state, action) => {
      state.selectedStation = action.payload;
    },
    clearStation: (state) => {
      state.selectedStation = null;
    },
  },
});


export const { setSelectedStation, clearStation } = stationSlice.actions;
export default stationSlice.reducer;
