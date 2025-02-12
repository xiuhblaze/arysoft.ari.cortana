import { configureStore } from "@reduxjs/toolkit";


import applicationFormClientSlice from "./slices/applicationFormClientSlice";
import applicationFormsSlice from "./slices/applicationFormsSlice";
import auditorDocumentsSlice from "./slices/auditorDocumentsSlice";
import auditorsSlice from "./slices/auditorsSlice";
import auditorStandardsSlice from "./slices/auditorStandardsSlice";
import authSlice from "./slices/authslice";
import catAuditorDocumentsSlice from "./slices/catAuditorDocumentsSlice";
import certificatesSlice from "./slices/certificatesSlice";
import companiesSlice from "./slices/companiesSlice";
import contactsSlice from "./slices/contactsSlice";
import nacecodesSlice from "./slices/nacecodesSlice";
import notesSlice from "./slices/notesSlice";
import organizationsSlice from "./slices/organizationsSlice";
import organizationStandardsSlice from "./slices/organizationStandardsSlice";
import shiftsSlice from "./slices/shiftsSlice";
import sitesSlice from "./slices/sitesSlice";
import standardsSlice from "./slices/standardsSlice";
import usersSlice from "./slices/usersSlice";

export const store = configureStore({
    reducer: {
        applicationFormClient: applicationFormClientSlice.reducer,
        applicationForms: applicationFormsSlice.reducer,
        auditorDocuments: auditorDocumentsSlice.reducer,
        auditors: auditorsSlice.reducer,
        auditorStandards: auditorStandardsSlice.reducer,
        auth: authSlice.reducer,
        catAuditorDocuments: catAuditorDocumentsSlice.reducer,
        certificates: certificatesSlice.reducer,
        companies: companiesSlice.reducer,
        contacts: contactsSlice.reducer,
        nacecodes: nacecodesSlice.reducer,
        notes: notesSlice.reducer,
        organizations: organizationsSlice.reducer,
        organizationStandards: organizationStandardsSlice.reducer,
        shifts: shiftsSlice.reducer,
        sites: sitesSlice.reducer,
        standards: standardsSlice.reducer,
        users: usersSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;