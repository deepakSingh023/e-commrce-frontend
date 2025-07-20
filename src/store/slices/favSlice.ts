// redux/favSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

import axios from 'axios';

interface FavouriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
}

interface FavState {
  items: FavouriteItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FavState = {
  items: [],
  loading: false,
  error: null,
};

const favSlice = createSlice({
  name: 'fav',
  initialState,
  reducers: {
    addToFav(state, action: PayloadAction<FavouriteItem>) {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    removeFromFav(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearFav(state) {
      state.items = [];
    },
    setFavItems(state, action: PayloadAction<FavouriteItem[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  addToFav,
  removeFromFav,
  clearFav,
  setFavItems,
  setLoading,
  setError,
} = favSlice.actions;

export const selectFavItems = (state: any) => state.fav.items;

// ✅ Thunk to fetch favorites from backend after login
export const fetchFavItems = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axios.get(`/api/user/${userId}/favourites`);
    dispatch(setFavItems(res.data)); // expects an array of favourite items
    dispatch(setError(null));
  } catch (err: any) {
    dispatch(setError(err.message || "Failed to fetch favourites"));
  } finally {
    dispatch(setLoading(false));
  }
};

export default favSlice.reducer;
