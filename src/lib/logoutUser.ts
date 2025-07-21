// utils/logoutUser.ts
import { AppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { clearOrders } from '@/store/slices/orderSlice';

export const logoutUser = () => (dispatch: AppDispatch) => {
  // LocalStorage cleanup
  localStorage.removeItem('user');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('order');

  // Redux state cleanup
  dispatch(clearOrders());
  dispatch(logout());
};
