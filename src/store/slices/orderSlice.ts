import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';

import { Draft } from 'immer';

// Interfaces
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

interface ShippingInfo {
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  phone: string;
}

interface usermail {
  email: string;
}

interface Order {
  _id?: string;
  items: CartItem[];
  totalCost: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  userInfo: usermail;
  createdAt?: string;
}

interface OrderState {
  orders: Order[];           // for fetchOrders
  currentOrder: Order | null; // for createOrder response
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, thunkAPI) => {
    try {
      const res = await API.get('/orders/getOrders');
      return res.data as Order[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Order fetching failed");
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/placeOrder',
  async (
    {
      items,
      totalCost,
      shippingInfo,
      userInfo,
      paymentMethod,
    }: {
      items: CartItem[];
      totalCost: number;
      shippingInfo: ShippingInfo;
      userInfo: usermail;
      paymentMethod: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await API.post('/orders/placeOrder', {
        orderItems: items,
        totalCost,
        shippingInfo,
        paymentMethod,
        userInfo,
      });
      return res.data as Order;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Order creation failed");
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state: Draft<OrderState>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state: Draft<OrderState>, action: PayloadAction<Order[]>) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state: Draft<OrderState>, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })

      // createOrder
      .addCase(createOrder.pending, (state: Draft<OrderState>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state: Draft<OrderState>, action: PayloadAction<Order>) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state: Draft<OrderState>, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
