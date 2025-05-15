import { configureStore, isImmutableDefault } from "@reduxjs/toolkit";

import appFormsSlice from "./slices/appFormsSlice";
import auditAuditorsSlice from "./slices/auditAuditorsSlice";
import auditCycleDocumentsSlice from "./slices/auditCycleDocumentsSlice";
import auditCyclesSlice from "./slices/auditCyclesSlice";
import auditCycleStandardsSlice from "./slices/auditCycleStandardsSlice";
import auditDocumentsSlice from "./slices/auditDocumentsSlice";
import auditorDocumentsSlice from "./slices/auditorDocumentsSlice";
import auditorsSlice from "./slices/auditorsSlice";
import auditorStandardsSlice from "./slices/auditorStandardsSlice";
import auditsSlice from "./slices/auditsSlice";
import auditStandardsSlice from "./slices/auditStandardsSlice";
import authSlice from "./slices/authSlice";
import catAuditorDocumentsSlice from "./slices/catAuditorDocumentsSlice";
import certificatesSlice from "./slices/certificatesSlice";
import companiesSlice from "./slices/companiesSlice";
import contactsSlice from "./slices/contactsSlice";
import nacecodesSlice from "./slices/nacecodesSlice";
import notesSlice from "./slices/notesSlice";
import organizationsSlice from "./slices/organizationsSlice";
import organizationStandardsSlice from "./slices/organizationStandardsSlice";
import rolesSlice from "./slices/rolesSlice";
import shiftsSlice from "./slices/shiftsSlice";
import sitesSlice from "./slices/sitesSlice";
import standardsSlice from "./slices/standardsSlice";
import usersSlice from "./slices/usersSlice";

export const store = configureStore({
    reducer: {
        appForms: appFormsSlice.reducer,
        auditAuditors: auditAuditorsSlice.reducer,
        auditCycleDocuments: auditCycleDocumentsSlice.reducer,
        auditCycles: auditCyclesSlice.reducer,
        auditCycleStandards: auditCycleStandardsSlice.reducer,
        auditDocuments: auditDocumentsSlice.reducer,
        auditorDocuments: auditorDocumentsSlice.reducer,
        auditors: auditorsSlice.reducer,
        auditorStandards: auditorStandardsSlice.reducer,
        audits: auditsSlice.reducer,
        auditStandards: auditStandardsSlice.reducer,
        auth: authSlice.reducer,
        catAuditorDocuments: catAuditorDocumentsSlice.reducer,
        certificates: certificatesSlice.reducer,
        companies: companiesSlice.reducer,
        contacts: contactsSlice.reducer,
        nacecodes: nacecodesSlice.reducer,
        notes: notesSlice.reducer,
        organizations: organizationsSlice.reducer,
        organizationStandards: organizationStandardsSlice.reducer,
        roles: rolesSlice.reducer,
        shifts: shiftsSlice.reducer,
        sites: sitesSlice.reducer,
        standards: standardsSlice.reducer,
        users: usersSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        {
            return process.env.NODE_ENV === 'development'
                ? getDefaultMiddleware({ 
                    serializableCheck: false,
                    immutableCheck: true,
                })
                : getDefaultMiddleware({
                    serializableCheck: false,
                    immutableCheck: false,
                });
        },
          
});

export default store;