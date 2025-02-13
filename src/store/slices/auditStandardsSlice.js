import { createSlice } from "@reduxjs/toolkit";

export const auditStandardsSlice = createSlice({
    name: 'auditStandardsSlice',
    initialState: {
        // Collection
        isAuditStandardsLoading: false,
        auditStandards: [],
        auditStandardsMeta: null,
        // Element
        isAuditStandardLoading: false,
        isAuditStandardCreating: false,
        auditStandardCreatedOk: false,
        isAuditStandardSaving: false,
        auditStandardSavedOk: false,
        isAuditStandardDeleting: false,
        auditStandardDeletedOk: false,
        auditStandard: null,

        auditStandardsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditStandardsLoading: (state) => {
            state.isAuditStandardsLoading = true;
        },
        isAuditStandardsLoaded: (state) => {
            state.isAuditStandardsLoading = false;
        },
        setAuditStandards: (state, action) => {
            state.isAuditStandardsLoading = false;
            state.auditStandards = action.payload.auditStandards;
            state.auditStandardsMeta = action.payload.auditStandardsMeta;
        },
        clearAuditStandards: (state) => {
            state.isAuditStandardsLoading = false;
            state.auditStandards = [];
            state.auditStandardsMeta = null;
        },
        // Element
        onAuditStandardLoading: (state) => {
            state.isAuditStandardLoading = true;
            state.auditStandard = null;
        },
        onAuditStandardCreating: (state) => {
            state.isAuditStandardCreating = true;
            state.auditStandardCreatedOk = false;
            state.auditStandard = null;
        },
        isAuditStandardCreated: (state) => {
            state.isAuditStandardCreating = false;
            state.auditStandardCreatedOk = true;
        },
        onAuditStandardSaving: (state) => {
            state.isAuditStandardSaving = true;
            state.auditStandardSavedOk = false;
        },
        isAuditStandardSaved: (state) => {
            state.isAuditStandardSaving = false;
            state.auditStandardSavedOk = true;
        },
        onAuditStandardDeleting: (state) => {
            state.isAuditStandardDeleting = true;
            state.auditStandardDeletedOk = false;
        },
        isAuditStandardDeleted: (state) => {
            state.isAuditStandardDeleting = false;
            state.auditStandardDeletedOk = true;
        },
        setAuditStandard: (state, action) => {
            state.isAuditStandardLoading = false;
            state.isAuditStandardCreating = false;
            state.auditStandardCreatedOk = false;
            state.isAuditStandardSaving = false;
            state.auditStandardSavedOk = false;
            state.isAuditStandardDeleting = false;
            state.auditStandardDeletedOk = false;
            state.auditStandard = action.payload;
        },
        clearAuditStandard: (state) => {
            state.isAuditStandardLoading = false;
            state.isAuditStandardCreating = false;
            state.auditStandardCreatedOk = false;
            state.isAuditStandardSaving = false;
            state.auditStandardSavedOk = false;
            state.isAuditStandardDeleting = false;
            state.auditStandardDeletedOk = false;
            state.auditStandard = null;
        },
        // Misc
        setAuditStandardsErrorMessage: (state, action) => {
            state.isAuditStandardsLoading = false;
            state.isAuditStandardLoading = false;
            state.isAuditStandardCreating = false;
            state.auditStandardCreatedOk = false;
            state.isAuditStandardSaving = false;
            state.auditStandardSavedOk = false;
            state.isAuditStandardDeleting = false;
            state.auditStandardDeletedOk = false;
            state.auditStandardsErrorMessage = action.payload;
        },
        clearAuditStandardsErrorMessage: (state) => {
            state.auditStandardsErrorMessage = null;
        }
    }
});

export const {
    onAuditStandardsLoading,
    isAuditStandardsLoaded,
    setAuditStandards,
    clearAuditStandards,

    onAuditStandardLoading,
    onAuditStandardCreating,
    isAuditStandardCreated,
    onAuditStandardSaving,
    isAuditStandardSaved,
    onAuditStandardDeleting,
    isAuditStandardDeleted,
    setAuditStandard,
    clearAuditStandard,

    setAuditStandardsErrorMessage,
    clearAuditStandardsErrorMessage,
} = auditStandardsSlice.actions;

export default auditStandardsSlice;