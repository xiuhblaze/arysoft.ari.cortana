import { createSlice } from "@reduxjs/toolkit";

export const auditCycleStandardsSlice = createSlice({
    name: 'auditCycleStandardsSlice',
    initialState: {
        // Collection
        isAuditCycleStandardsLoading: false,
        auditCycleStandards: [],
        auditCycleStandardsMeta: null,
        // Element
        isAuditCycleStandardLoading: false,
        isAuditCycleStandardCreating: false,
        auditCycleStandardCreatedOk: false,
        isAuditCycleStandardSaving: false,
        auditCycleStandardSavedOk: false,
        isAuditCycleStandardDeleting: false,
        auditCycleStandardDeletedOk: false,
        auditCycleStandard: null,

        auditCycleStandardsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditCycleStandardsLoading: (state) => {
            state.isAuditCycleStandardsLoading = true;
        },
        isAuditCycleStandardsLoaded: (state) => {
            state.isAuditCycleStandardsLoading = false;
        },
        setAuditCycleStandards: (state, action) => {
            state.isAuditCycleStandardsLoading = false;
            state.auditCycleStandards = action.payload.auditCycleStandards;
            state.auditCycleStandardsMeta = action.payload.auditCycleStandardsMeta;
        },
        clearAuditCycleStandards: (state) => {
            state.isAuditCycleStandardsLoading = false;
            state.auditCycleStandards = [];
            state.auditCycleStandardsMeta = null;
        },
        // Element
        onAuditCycleStandardLoading: (state) => {
            state.isAuditCycleStandardLoading = true;
            state.auditCycleStandard = null;
        },
        onAuditCycleStandardCreating: (state) => {
            state.isAuditCycleStandardCreating = true;
            state.auditCycleStandardCreatedOk = false;
            state.auditCycleStandard = null;
        },
        isAuditCycleStandardCreated: (state) => {
            state.isAuditCycleStandardCreating = false;
            state.auditCycleStandardCreatedOk = true;
        },
        onAuditCycleStandardSaving: (state) => {
            state.isAuditCycleStandardSaving = true;
            state.auditCycleStandardSavedOk = false;
        },
        isAuditCycleStandardSaved: (state) => {
            state.isAuditCycleStandardSaving = false;
            state.auditCycleStandardSavedOk = true;
        },
        onAuditCycleStandardDeleting: (state) => {
            state.isAuditCycleStandardDeleting = true;
            state.auditCycleStandardDeletedOk = false;
        },
        isAuditCycleStandardDeleted: (state) => {
            state.isAuditCycleStandardDeleting = false;
            state.auditCycleStandardDeletedOk = true;
        },
        setAuditCycleStandard: (state, action) => {
            state.isAuditCycleStandardLoading = false;
            state.isAuditCycleStandardCreating = false;
            state.auditCycleStandardCreatedOk = false;
            state.isAuditCycleStandardSaving = false;
            state.auditCycleStandardSavedOk = false;
            state.isAuditCycleStandardDeleting = false;
            state.auditCycleStandardDeletedOk = false;
            state.auditCycleStandard = action.payload;
        },
        clearAuditCycleStandard: (state) => {
            state.isAuditCycleStandardLoading = false;
            state.isAuditCycleStandardCreating = false;
            state.auditCycleStandardCreatedOk = false;
            state.isAuditCycleStandardSaving = false;
            state.auditCycleStandardSavedOk = false;
            state.isAuditCycleStandardDeleting = false;
            state.auditCycleStandardDeletedOk = false;
            state.auditCycleStandard = null;
        },
        // Misc
        setAuditCycleStandardsErrorMessage: (state, action) => {
            state.isAuditCycleStandardsLoading = false;
            state.isAuditCycleStandardLoading = false;
            state.isAuditCycleStandardCreating = false;
            state.auditCycleStandardCreatedOk = false;
            state.isAuditCycleStandardSaving = false;
            state.auditCycleStandardSavedOk = false;
            state.isAuditCycleStandardDeleting = false;
            state.auditCycleStandardDeletedOk = false;
            state.auditCycleStandardsErrorMessage = action.payload;
        },
        clearAuditCycleStandardsErrorMessage: (state) => {
            state.auditCycleStandardsErrorMessage = null;
        }
    }
});

export const {
    onAuditCycleStandardsLoading,
    isAuditCycleStandardsLoaded,
    setAuditCycleStandards,
    clearAuditCycleStandards,

    onAuditCycleStandardLoading,
    onAuditCycleStandardCreating,
    isAuditCycleStandardCreated,
    onAuditCycleStandardSaving,
    isAuditCycleStandardSaved,
    onAuditCycleStandardDeleting,
    isAuditCycleStandardDeleted,
    setAuditCycleStandard,
    clearAuditCycleStandard,

    setAuditCycleStandardsErrorMessage,
    clearAuditCycleStandardsErrorMessage,
} = auditCycleStandardsSlice.actions;

export default auditCycleStandardsSlice;