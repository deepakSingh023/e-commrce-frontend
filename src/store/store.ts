// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authSlice from "@/store/slices/authSlice";
import adminAuthSlice from "@/store/slices/adminAuthSlice";
import CartSlice from "@/store/slices/cartSlice";
import orderSlice from "@/store/slices/orderSlice";


const rootReducer = combineReducers({
  auth: authSlice,
  adminAuth: adminAuthSlice,
  cart: CartSlice,
  order: orderSlice,
});

const persistConfig = {
  key: "root",
  storage,
  // Apply to ALL slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
