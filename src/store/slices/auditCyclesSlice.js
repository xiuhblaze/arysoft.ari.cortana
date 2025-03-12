import { createSlice } from "@reduxjs/toolkit";

export const auditCyclesSlice = createSlice({
    name: 'auditCyclesSlice',
    initialState: {
        // Collection
        isAuditCyclesLoading: false,
        auditCycles: [],
        auditCyclesMeta: null,
        // Element
        isAuditCycleLoading: false,
        isAuditCycleCreating: false,
        auditCycleCreatedOk: false,
        isAuditCycleSaving: false,
        auditCycleSavedOk: false,
        isAuditCycleDeleting: false,
        auditCycleDeletedOk: false,
        auditCycle: null,

        auditCyclesErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditCyclesLoading: (state) => {
            state.isAuditCyclesLoading = true;
        },
        isAuditCyclesLoaded: (state) => {
            state.isAuditCyclesLoading = false;
        },
        setAuditCycles: (state, action) => {
            state.isAuditCyclesLoading = false;
            state.auditCycles = action.payload.auditCycles;
            state.auditCyclesMeta = action.payload.auditCyclesMeta;
        },
        clearAuditCycles: (state) => {
            state.isAuditCyclesLoading = false;
            state.auditCycles = [];
            state.auditCyclesMeta = null;
        },
        // Element
        onAuditCycleLoading: (state) => {
            state.isAuditCycleLoading = true;
            state.auditCycle = null;
        },
        onAuditCycleCreating: (state) => {
            state.isAuditCycleCreating = true;
            state.auditCycleCreatedOk = false;
            state.auditCycle = null;
        },
        isAuditCycleCreated: (state) => {
            state.isAuditCycleCreating = false;
            state.auditCycleCreatedOk = true;
        },
        onAuditCycleSaving: (state) => {
            state.isAuditCycleSaving = true;
            state.auditCycleSavedOk = false;
        },
        isAuditCycleSaved: (state) => {
            state.isAuditCycleSaving = false;
            state.auditCycleSavedOk = true;
        },
        onAuditCycleDeleting: (state) => {
            state.isAuditCycleDeleting = true;
            state.auditCycleDeletedOk = false;
        },
        isAuditCycleDeleted: (state) => {
            state.isAuditCycleDeleting = false;
            state.auditCycleDeletedOk = true;
        },
        setAuditCycle: (state, action) => {
            state.isAuditCycleLoading = false;
            state.isAuditCycleCreating = false;
            state.auditCycleCreatedOk = false;
            state.isAuditCycleSaving = false;
            state.auditCycleSavedOk = false;
            state.isAuditCycleDeleting = false;
            state.auditCycleDeletedOk = false;
            state.auditCycle = action.payload;
        },
        clearAuditCycle: (state) => {
            state.isAuditCycleLoading = false;
            state.isAuditCycleCreating = false;
            state.auditCycleCreatedOk = false;
            state.isAuditCycleSaving = false;
            state.auditCycleSavedOk = false;
            state.isAuditCycleDeleting = false;
            state.auditCycleDeletedOk = false;
            state.auditCycle = null;
        },
        // Misc
        setAuditCyclesErrorMessage: (state, action) => {
            state.isAuditCyclesLoading = false;
            state.isAuditCycleLoading = false;
            state.isAuditCycleCreating = false;
            state.auditCycleCreatedOk = false;
            state.isAuditCycleSaving = false;
            state.auditCycleSavedOk = false;
            state.isAuditCycleDeleting = false;
            state.auditCycleDeletedOk = false;
            state.auditCyclesErrorMessage = action.payload;
        },
        clearAuditCyclesErrorMessage: (state) => {
            state.auditCyclesErrorMessage = null;
        }
    }
});

export const {
    onAuditCyclesLoading,
    isAuditCyclesLoaded,
    setAuditCycles,
    clearAuditCycles,

    onAuditCycleLoading,
    onAuditCycleCreating,
    isAuditCycleCreated,
    onAuditCycleSaving,
    isAuditCycleSaved,
    onAuditCycleDeleting,
    isAuditCycleDeleted,
    setAuditCycle,
    clearAuditCycle,

    setAuditCyclesErrorMessage,
    clearAuditCyclesErrorMessage,
} = auditCyclesSlice.actions;

export default auditCyclesSlice;