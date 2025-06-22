import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Add more slices here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
