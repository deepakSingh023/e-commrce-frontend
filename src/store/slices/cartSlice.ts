import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api'; // ✅ your custom axios instance
import  {Product} from "@/components/Tabs/Products"



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


// ✅ 1. Fetch cart from backend
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await API.get('/cart/getCartItems');
  return res.data.cart;
});

// ✅ 2. Add to cart (calls /add)
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const res = await API.post(`/cart/addItemCart`, { productId, quantity });
    return res.data.cart;
  }
);


// ✅ 3. Decrease quantity
export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const res = await API.post(`/cart/updateQuantity`, { productId , quantity});
    return res.data.cart;
  }
);

// ✅ 4. Remove item
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string) => {
    const res = await API.delete(`/cart/removeItemCart/${productId}`);
    return res.data.cart;
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = 'Failed to fetch cart';
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
  },
});

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export default cartSlice.reducer;
