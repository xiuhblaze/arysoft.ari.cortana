import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'checking', // 'checking', 'not-authenticated', 'authenticated'
    user: {},
    userErrorMessage: undefined,
  },
  reducers: {
    onChecking: (state) => {
      state.status = 'checking';
      state.user = {};
    },
    onLogin: (state, action) => {
      state.status = 'authenticated';
      state.user = action.payload;
    },
    onLogout: (state) => {
      state.status = 'not-authenticated';
      state.user = {};
    },
    setAuthErrorMessage: (state, action) => {
      state.userErrorMessage = action.payload;
    },
    clearAuthErrorMessage: (state) => {
      state.userErrorMessage = undefined
    }
  }
});

export const {
  onChecking,
  onLogin,
  onLogout,
  setAuthErrorMessage,
  clearAuthErrorMessage,
} = authSlice.actions;

export default authSlice;