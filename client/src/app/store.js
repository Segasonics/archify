import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import { apiClient } from '../lib/apiClient';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [apiClient.reducerPath]: apiClient.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiClient.middleware),
});

store.subscribe(() => {
  const { user } = store.getState().auth;
  if (user) {
    localStorage.setItem('archify_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('archify_user');
  }
});

