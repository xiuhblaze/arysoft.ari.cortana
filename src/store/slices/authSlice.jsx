import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'checking', // 'checking', 'not-authenticated', 'authenticated'
    user: {},
    isPwdSaving: false,
    pwdSavedOk: false,
    userErrorMessage: null,
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
    onPwdSaving: (state) => {
      state.isPwdSaving = true;
    },
    isPwdSavedOk: (state) => {
      state.isPwdSaving = false;
      state.pwdSavedOk = true;
    },
    setAuthErrorMessage: (state, action) => {
      state.isPwdSaving = false;
      state.pwdSavedOk = false;
      state.userErrorMessage = action.payload;
    },
    clearAuthErrorMessage: (state) => {
      state.userErrorMessage = null
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