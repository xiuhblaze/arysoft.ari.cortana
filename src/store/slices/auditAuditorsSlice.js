import { createSlice } from "@reduxjs/toolkit";

export const auditAuditorsSlice = createSlice({
    name: 'auditAuditorsSlice',
    initialState: {
        // Collection
        isAuditAuditorsLoading: false,
        auditAuditors: [],
        auditAuditorsMeta: null,
        // Element
        isAuditAuditorLoading: false,
        isAuditAuditorCreating: false,
        auditAuditorCreatedOk: false,
        isAuditAuditorSaving: false,
        auditAuditorSavedOk: false,
        isAuditAuditorDeleting: false,
        auditAuditorDeletedOk: false,
        auditAuditor: null,

        auditAuditorsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditAuditorsLoading: (state) => {
            state.isAuditAuditorsLoading = true;
        },
        isAuditAuditorsLoaded: (state) => {
            state.isAuditAuditorsLoading = false;
        },
        setAuditAuditors: (state, action) => {
            state.isAuditAuditorsLoading = false;
            state.auditAuditors = action.payload.auditAuditors;
            state.auditAuditorsMeta = action.payload.auditAuditorsMeta;
        },
        clearAuditAuditors: (state) => {
            state.isAuditAuditorsLoading = false;
            state.auditAuditors = [];
            state.auditAuditorsMeta = null;
        },
        // Element
        onAuditAuditorLoading: (state) => {
            state.isAuditAuditorLoading = true;
            state.auditAuditor = null;
        },
        onAuditAuditorCreating: (state) => {
            state.isAuditAuditorCreating = true;
            state.auditAuditorCreatedOk = false;
            state.auditAuditor = null;
        },
        isAuditAuditorCreated: (state) => {
            state.isAuditAuditorCreating = false;
            state.auditAuditorCreatedOk = true;
        },
        onAuditAuditorSaving: (state) => {
            state.isAuditAuditorSaving = true;
            state.auditAuditorSavedOk = false;
        },
        isAuditAuditorSaved: (state) => {
            state.isAuditAuditorSaving = false;
            state.auditAuditorSavedOk = true;
        },
        onAuditAuditorDeleting: (state) => {
            state.isAuditAuditorDeleting = true;
            state.auditAuditorDeletedOk = false;
        },
        isAuditAuditorDeleted: (state) => {
            state.isAuditAuditorDeleting = false;
            state.auditAuditorDeletedOk = true;
        },
        setAuditAuditor: (state, action) => {
            state.isAuditAuditorLoading = false;
            state.isAuditAuditorCreating = false;
            state.auditAuditorCreatedOk = false;
            state.isAuditAuditorSaving = false;
            state.auditAuditorSavedOk = false;
            state.isAuditAuditorDeleting = false;
            state.auditAuditorDeletedOk = false;
            state.auditAuditor = action.payload;
        },
        clearAuditAuditor: (state) => {
            state.isAuditAuditorLoading = false;
            state.isAuditAuditorCreating = false;
            state.auditAuditorCreatedOk = false;
            state.isAuditAuditorSaving = false;
            state.auditAuditorSavedOk = false;
            state.isAuditAuditorDeleting = false;
            state.auditAuditorDeletedOk = false;
            state.auditAuditor = null;
        },
        // Misc
        setAuditAuditorsErrorMessage: (state, action) => {
            state.isAuditAuditorsLoading = false;
            state.isAuditAuditorLoading = false;
            state.isAuditAuditorCreating = false;
            state.auditAuditorCreatedOk = false;
            state.isAuditAuditorSaving = false;
            state.auditAuditorSavedOk = false;
            state.isAuditAuditorDeleting = false;
            state.auditAuditorDeletedOk = false;
            state.auditAuditorsErrorMessage = action.payload;
        },
        clearAuditAuditorsErrorMessage: (state) => {
            state.auditAuditorsErrorMessage = null;
        }
    }
});

export const {
    onAuditAuditorsLoading,
    isAuditAuditorsLoaded,
    setAuditAuditors,
    clearAuditAuditors,

    onAuditAuditorLoading,
    onAuditAuditorCreating,
    isAuditAuditorCreated,
    onAuditAuditorSaving,
    isAuditAuditorSaved,
    onAuditAuditorDeleting,
    isAuditAuditorDeleted,
    setAuditAuditor,
    clearAuditAuditor,

    setAuditAuditorsErrorMessage,
    clearAuditAuditorsErrorMessage,
} = auditAuditorsSlice.actions;

export default auditAuditorsSlice;