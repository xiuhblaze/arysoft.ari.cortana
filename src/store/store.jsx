import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slices/authslice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;