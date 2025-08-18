import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  vendor: {},
  station: {},
  train: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.items.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.final_price = item.final_price;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },

    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (cartItem) => cartItem._id === id
      );

      if (itemIndex !== -1) {
        if (quantity > 0) {
          state.items[itemIndex].quantity = quantity;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },

    addVendorDetails: (state, action) => {
      state.vendor = action.payload;
    },

    addStationDetails: (state, action) => {
      state.station = action.payload;
    },

    addTrainDetails: (state, action) => {
      state.train = action.payload;
    },

    resetCart: (state) => {
      state.items = [];
      state.vendor = {};
      state.station = {};
      state.train = {};
    },
  },
});

export const {
  addItemToCart,
  updateItemQuantity,
  addVendorDetails,
  addStationDetails,
  addTrainDetails,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
