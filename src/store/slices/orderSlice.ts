import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api';
import {FrontOrders} from "@/app/orders/page"
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
  orders: FrontOrders[];   
  counts: {                    
    all: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };        
  currentOrder: Order | null; 
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  counts: {
    all: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  },
  currentOrder: null,
  loading: false,
  error: null,
};


export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters: { status?: string; search?: string } = {}) => {
    const { status, search } = filters

    const queryParams = new URLSearchParams()
    if (status && status !== 'all') queryParams.append('status', status)
    if (search) queryParams.append('search', search)

    const res = await API.get(`/orders/getOrderById`, { params: queryParams })
     return res.data as { orders: FrontOrders[]; counts: OrderState['counts'] };
  }
)

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
    clearOrders: (state) => {
    state.orders = [];
    state.counts = {
      all: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    },
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
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<{ orders: FrontOrders[]; counts: OrderState['counts'] }>) => {
         state.orders = action.payload.orders;
         state.counts = action.payload.counts;
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

export const { clearCurrentOrder, clearOrders } = orderSlice.actions;

export default orderSlice.reducer;
