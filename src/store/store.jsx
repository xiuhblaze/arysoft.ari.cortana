import { configureStore } from "@reduxjs/toolkit";


import authSlice from "./slices/authslice";
import applicationFormClientSlice from "./slices/applicationFormClientSlice";
import contactsSlice from "./slices/contactsSlice";
import nacecodesSlice from "./slices/nacecodesSlice";
import organizationsSlice from "./slices/organizationsSlice";
import sitesSlice from "./slices/sitesSlice";
import standardsSlice from "./slices/standardsSlice";
import applicationFormsSlice from "./slices/applicationFormsSlice";

export const store = configureStore({
  reducer: {
    applicationFormClient: applicationFormClientSlice.reducer,
    applicationForms: applicationFormsSlice.reducer,
    auth: authSlice.reducer,
    contacts: contactsSlice.reducer,
    nacecodes: nacecodesSlice.reducer,
    organizations: organizationsSlice.reducer,
    sites: sitesSlice.reducer,
    standards: standardsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;