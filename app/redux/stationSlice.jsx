import { createSlice } from "@reduxjs/toolkit";

const stationSlice = createSlice({
  name: "station",
  initialState: {
    selectedStation: null,  // Make sure this is the correct key
  },
  reducers: {
    setSelectedStation: (state, action) => {
      state.selectedStation = action.payload;  // Ensure this key matches with useSelector
    },
    clearStation: (state) => {
      state.selectedStation = null;
    },
  },
});


export const { setSelectedStation, clearStation } = stationSlice.actions;
export default stationSlice.reducer;
