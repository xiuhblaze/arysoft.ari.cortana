import { createSlice } from "@reduxjs/toolkit";

export const auditsSlice = createSlice({
    name: 'auditsSlice',
    initialState: {
        // Collection
        isAuditsLoading: false,
        audits: [],
        auditsMeta: null,
        // Element
        isAuditLoading: false,
        isAuditCreating: false,
        auditCreatedOk: false,
        isAuditSaving: false,
        auditSavedOk: false,
        isAuditDeleting: false,
        auditDeletedOk: false,
        audit: null,

        auditsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditsLoading: (state) => {
            state.isAuditsLoading = true;
        },
        isAuditsLoaded: (state) => {
            state.isAuditsLoading = false;
        },
        setAudits: (state, action) => {
            state.isAuditsLoading = false;
            state.audits = action.payload.audits;
            state.auditsMeta = action.payload.auditsMeta;
        },
        clearAudits: (state) => {
            state.isAuditsLoading = false;
            state.audits = [];
            state.auditsMeta = null;
        },
        // Element
        onAuditLoading: (state) => {
            state.isAuditLoading = true;
            state.audit = null;
        },
        onAuditCreating: (state) => {
            state.isAuditCreating = true;
            state.auditCreatedOk = false;
            state.audit = null;
        },
        isAuditCreated: (state) => {
            state.isAuditCreating = false;
            state.auditCreatedOk = true;
        },
        onAuditSaving: (state) => {
            state.isAuditSaving = true;
            state.auditSavedOk = false;
        },
        isAuditSaved: (state) => {
            state.isAuditSaving = false;
            state.auditSavedOk = true;
        },
        onAuditDeleting: (state) => {
            state.isAuditDeleting = true;
            state.auditDeletedOk = false;
        },
        isAuditDeleted: (state) => {
            state.isAuditDeleting = false;
            state.auditDeletedOk = true;
        },
        setAudit: (state, action) => {
            state.isAuditLoading = false;
            state.isAuditCreating = false;
            state.auditCreatedOk = false;
            state.isAuditSaving = false;
            state.auditSavedOk = false;
            state.isAuditDeleting = false;
            state.auditDeletedOk = false;
            state.audit = action.payload;
        },
        clearAudit: (state) => {
            state.isAuditLoading = false;
            state.isAuditCreating = false;
            state.auditCreatedOk = false;
            state.isAuditSaving = false;
            state.auditSavedOk = false;
            state.isAuditDeleting = false;
            state.auditDeletedOk = false;
            state.audit = null;
        },
        // Misc
        setAuditsErrorMessage: (state, action) => {
            state.isAuditsLoading = false;
            state.isAuditLoading = false;
            state.isAuditCreating = false;
            state.auditCreatedOk = false;
            state.isAuditSaving = false;
            state.auditSavedOk = false;
            state.isAuditDeleting = false;
            state.auditDeletedOk = false;
            state.auditsErrorMessage = action.payload;
        },
        clearAuditsErrorMessage: (state) => {
            state.auditsErrorMessage = null;
        }
    }
});

export const {
    onAuditsLoading,
    isAuditsLoaded,
    setAudits,
    clearAudits,

    onAuditLoading,
    onAuditCreating,
    isAuditCreated,
    onAuditSaving,
    isAuditSaved,
    onAuditDeleting,
    isAuditDeleted,
    setAudit,
    clearAudit,

    setAuditsErrorMessage,
    clearAuditsErrorMessage,
} = auditsSlice.actions;

export default auditsSlice;