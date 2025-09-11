import { configureStore } from "@reduxjs/toolkit";

import adcConceptsSlice from "./slices/adcConceptsSlice";
import adcConceptValuesSlice from "./slices/adcConceptValuesSlice";
import adcSiteAuditsSlice from "./slices/adcSiteAuditsSlice";
import adcSitesSlice from "./slices/adcSitesSlice";
import adcsSlice from "./slices/adcsSlice";
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
import md5sSlice from "./slices/md5sSlice";
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
        adcConcepts: adcConceptsSlice.reducer,
        adcConceptValues: adcConceptValuesSlice.reducer,
        adcs: adcsSlice.reducer,
        adcSiteAudits: adcSiteAuditsSlice.reducer,
        adcSites: adcSitesSlice.reducer,
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
        md5s: md5sSlice.reducer,
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