import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import API from '@/lib/api'; // ✅ your custom axios instance

interface CartItem {
  product: {
    _id: string;
    name?: string;
    price?: number;
    image?: string;
  };
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
  const res = await API.get('cart/getCartItems');
  return res.data.items;
});

// ✅ 2. Add to cart (calls /add)
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (productId: string) => {
    const res = await API.post(`cart/addItemCart`, { productId });
    return res.data.items;
  }
);

// ✅ 3. Decrease quantity
export const decreaseQuantity = createAsyncThunk(
  'cart/decreaseQuantity',
  async (productId: string) => {
    const res = await API.post(`${API_URL}/decrease`, { productId });
    return res.data.items;
  }
);

// ✅ 4. Remove item
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string) => {
    const res = await API.delete(`${API_URL}/remove/${productId}`);
    return res.data.items;
  }
);

// ✅ 5. Clear entire cart
export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  await API.delete(`${API_URL}/clear`);
  return [];
});

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
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCart.fulfilled, state => {
        state.items = [];
      });
  },
});

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export default cartSlice.reducer;
