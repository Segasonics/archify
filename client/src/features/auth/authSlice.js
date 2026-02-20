import { createSlice } from '@reduxjs/toolkit';
import { tokenManager } from '../../lib/tokenManager';

function loadStoredUser() {
  try {
    const raw = localStorage.getItem('archify_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState = {
  user: loadStoredUser(),
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      tokenManager.setToken(action.payload.accessToken);
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      tokenManager.setToken(action.payload);
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      tokenManager.clear();
      localStorage.removeItem('archify_user');
    },
  },
});

export const { setSession, setAccessToken, setUser, clearSession } = authSlice.actions;
export default authSlice.reducer;

