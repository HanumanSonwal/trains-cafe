import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import cartReducer from './cartSlice';
import { combineReducers } from 'redux';
import stationReducer from "./stationSlice";

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  cart: cartReducer,
  station: stationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
export default store;

