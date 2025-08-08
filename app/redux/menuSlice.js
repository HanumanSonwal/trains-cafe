import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStations = createAsyncThunk(
  "menu/fetchStations",
  async () => {
    const res = await fetch("/api/station?search=&page=0");
    const data = await res.json();
    if (!data.success) throw new Error("Failed to load stations");
    return data.data;
  }
);

export const fetchVendorsByStation = createAsyncThunk(
  "menu/fetchVendorsByStation",
  async (stationCode) => {
    const res = await fetch(`/api/vendors?stationcode=${stationCode}`);
    const data = await res.json();
    if (!data.success) throw new Error("Failed to load vendors");
    return data.data;
  }
);

export const fetchCategoriesByVendor = createAsyncThunk(
  "menu/fetchCategoriesByVendor",
  async ({ vendorId, isVeg }) => {
    const res = await fetch(
      `/api/vendors/categories-menuItems/${vendorId}?veg=${isVeg}`
    );
    const data = await res.json();
    if (!data.success) throw new Error("Failed to load categories & items");
    return data.data;
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    stations: [],
    vendors: [],
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetMenuData: (state) => {
      state.stations = [];
      state.vendors = [];
      state.categories = [];
      state.error = null;
    },
    clearVendors: (state) => {
      state.vendors = [];
    },
    clearCategories: (state) => {
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.stations = action.payload;
      })
      .addCase(fetchVendorsByStation.fulfilled, (state, action) => {
        state.vendors = action.payload;
      })
      .addCase(fetchCategoriesByVendor.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("menu") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("menu") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("menu") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { resetMenuData, clearVendors, clearCategories } =
  menuSlice.actions;
export default menuSlice.reducer;
