import { createSlice } from "@reduxjs/toolkit";

export const auditorsSlice = createSlice({
    name: 'auditorsSlice',
    initialState: {
        // Collection
        isAuditorsLoading: false,
        auditors: [],
        auditorsMeta: null,
        // Element
        isAuditorLoading: false,
        isAuditorCreating: false,
        auditorCreatedOk: false,
        isAuditorSaving: false,
        auditorSavedOk: false,
        isAuditorDeleting: false,
        auditorDeletedOk: false,
        auditor: null,

        auditorsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditorsLoading: (state) => {
            state.isAuditorsLoading = true;
        },
        isAuditorsLoaded: (state) => {
            state.isAuditorsLoading = false;
        },
        setAuditors: (state, action) => {
            state.isAuditorsLoading = false;
            state.auditors = action.payload.auditors;
            state.auditorsMeta = action.payload.auditorsMeta;
        },
        clearAuditors: (state) => {
            state.isAuditorsLoading = false;
            state.auditors = [];
            state.auditorsMeta = null;
        },
        // Element
        onAuditorLoading: (state) => {
            state.isAuditorLoading = true;
            state.auditor = null;
        },
        onAuditorCreating: (state) => {
            state.isAuditorCreating = true;
            state.auditorCreatedOk = false;
            state.auditor = null;
        },
        isAuditorCreated: (state) => {
            state.isAuditorCreating = false;
            state.auditorCreatedOk = true;
        },
        onAuditorSaving: (state) => {
            state.isAuditorSaving = true;
            state.auditorSavedOk = false;
        },
        isAuditorSaved: (state) => {
            state.isAuditorSaving = false;
            state.auditorSavedOk = true;
        },
        onAuditorDeleting: (state) => {
            state.isAuditorDeleting = true;
            state.auditorDeletedOk = false;
        },
        isAuditorDeleted: (state) => {
            state.isAuditorDeleting = false;
            state.auditorDeletedOk = true;
        },
        setAuditor: (state, action) => {
            state.isAuditorLoading = false;
            state.isAuditorCreating = false;
            state.auditorCreatedOk = false;
            state.isAuditorSaving = false;
            state.auditorSavedOk = false;
            state.isAuditorDeleting = false;
            state.auditorDeletedOk = false;
            state.auditor = action.payload;
        },
        clearAuditor: (state) => {
            state.isAuditorLoading = false;
            state.isAuditorCreating = false;
            state.auditorCreatedOk = false;
            state.isAuditorSaving = false;
            state.auditorSavedOk = false;
            state.isAuditorDeleting = false;
            state.auditorDeletedOk = false;
            state.auditor = null;
        },
        // Misc
        setAuditorsErrorMessage: (state, action) => {
            state.isAuditorsLoading = false;
            state.isAuditorLoading = false;
            state.isAuditorCreating = false;
            state.auditorCreatedOk = false;
            state.isAuditorSaving = false;
            state.auditorSavedOk = false;
            state.isAuditorDeleting = false;
            state.auditorDeletedOk = false;
            state.auditorsErrorMessage = action.payload;
        },
        clearAuditorsErrorMessage: (state) => {
            state.auditorsErrorMessage = null;
        }
    }
});

export const {
    onAuditorsLoading,
    isAuditorsLoaded,
    setAuditors,
    clearAuditors,

    onAuditorLoading,
    onAuditorCreating,
    isAuditorCreated,
    onAuditorSaving,
    isAuditorSaved,
    onAuditorDeleting,
    isAuditorDeleted,
    setAuditor,
    clearAuditor,

    setAuditorsErrorMessage,
    clearAuditorsErrorMessage,
} = auditorsSlice.actions;

export default auditorsSlice;