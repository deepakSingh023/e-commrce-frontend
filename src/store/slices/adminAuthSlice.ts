"use client"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AdminState {
  admin: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admin: null,
  token: null,
  loading: false,
  error: null,
};

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (
    credentials: { username: string; password: string; rememberMe: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/admin-login", credentials);
      const data = res.data;

      if (data?.admin?.role !== "admin") {
        return rejectWithValue("Access denied. Not an admin.");
      }

      // Store token in localStorage
      localStorage.setItem("admin", JSON.stringify({
       token: data.token,
       username: data.admin.username,
       role: data.admin.role
     }))
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed.");
    }
  }
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(adminLogin.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
