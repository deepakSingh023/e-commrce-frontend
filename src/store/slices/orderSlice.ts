import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api'; 
import  {Product} from "@/components/Tabs/Products"
import { Draft } from 'immer';
import { userInfo } from 'os';


interface CartItem {
  product: Product;
  quantity: number;
}

interface usermail{
  email: string
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

interface OrderState {
  items: CartItem[];
  totalCost: number;
  shippingInfo: ShippingInfo | null;
  paymentMethod: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  items: [],
  totalCost: 0,
  shippingInfo: null,
  paymentMethod: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, thunkAPI) => {
    try {
      const res = await API.get('/order/getOrders');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message || "Order fetching failed");
    }
  })

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ items, totalCost, shippingInfo,userInfo, paymentMethod }: { items: CartItem[]; totalCost: number; shippingInfo: ShippingInfo; userInfo: usermail ; paymentMethod: string }, thunkAPI) => {
    try {
      const res = await API.post('/order/createOrder', { items, totalCost, shippingInfo, paymentMethod, userInfo });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message || "Order creation failed");
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers:builder => {
    builder
    .addCase(fetchOrders.pending, (state:Draft<OrderState>) => {
      state.loading = true;
    })
    .addCase(fetchOrders.fulfilled, (state:Draft<OrderState>,action: PayloadAction<any>) => {
      state.items = action.payload;
      state.loading = false;
    })
    .addCase(fetchOrders.rejected, (state:Draft<OrderState>) => {
      state.error = 'Failed to fetch orders';
      state.loading = false;
    })
    .addCase(createOrder.fulfilled, (state:Draft<OrderState>,action: PayloadAction<any>) => {
      state.items = action.payload;
    })
  }

})