import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api'; // ✅ your custom axios instance
import  {Product} from "@/components/Tabs/Products"
import { Draft } from 'immer';


interface CartItem {
  product: Product; // Assuming Product is defined in your components
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};



export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await API.get('/cart/getCartItems');
  return res.data;
});


export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const res = await API.post(`/cart/addItemCart`, { productId, quantity });
    return res.data;
  }
);



export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const res = await API.post(`/cart/updateQuantity`, { productId , quantity});
    return res.data;
  }
);


export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId }: { productId: string }) => {
    const res = await API.delete(`/cart/removeItemCart`, {data :{productId}});
    return res.data;
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, (state:Draft<CartState>) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state:Draft<CartState>,action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state:Draft<CartState>) => {
        state.error = 'Failed to fetch cart';
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state:Draft<CartState>, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(updateQuantity.fulfilled, (state:Draft<CartState>,action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state:Draft<CartState>,action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
  },
});

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export default cartSlice.reducer;
