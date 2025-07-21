"use client"

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";





interface User {
  username : string;
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Express backend base URL
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`; 

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (userData: { username: string; password: string } , thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/login`, userData);
      return res.data; // user data with token
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message || "Login failed");
    }
  }
);

// Async register thunk
export const register = createAsyncThunk(
  "auth/register",
  async (userData: { username: string; password: string }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message || "Register failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem('user');      // clear user info
      localStorage.removeItem('cartItems'); // clear cart
      localStorage.removeItem('order');   
    
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
