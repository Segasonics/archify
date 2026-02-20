import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
  },
  reducers: {
    setMobileMenuOpen(state, action) {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;

