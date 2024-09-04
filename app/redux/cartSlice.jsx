import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const { id } = action.payload;
      if (state.items[id]) {
        state.items[id]++;
      } else {
        state.items[id] = 1;
      }
    },
    removeItemFromCart: (state, action) => {
      const { id } = action.payload;
      delete state.items[id];
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity > 0) {
        state.items[id] = quantity;
      } else {
        delete state.items[id];
      }
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;

