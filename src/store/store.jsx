import { configureStore } from "@reduxjs/toolkit";


import applicationFormClientSlice from "./slices/applicationFormClientSlice";
import applicationFormsSlice from "./slices/applicationFormsSlice";
import auditorsSlice from "./slices/auditorsSlice";
import authSlice from "./slices/authslice";
import contactsSlice from "./slices/contactsSlice";
import nacecodesSlice from "./slices/nacecodesSlice";
import organizationsSlice from "./slices/organizationsSlice";
import shiftsSlice from "./slices/shiftsSlice";
import sitesSlice from "./slices/sitesSlice";
import standardsSlice from "./slices/standardsSlice";

export const store = configureStore({
  reducer: {
    applicationFormClient: applicationFormClientSlice.reducer,
    applicationForms: applicationFormsSlice.reducer,
    auditors: auditorsSlice.reducer,
    auth: authSlice.reducer,
    contacts: contactsSlice.reducer,
    nacecodes: nacecodesSlice.reducer,
    organizations: organizationsSlice.reducer,
    shifts: shiftsSlice.reducer,
    sites: sitesSlice.reducer,
    standards: standardsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;