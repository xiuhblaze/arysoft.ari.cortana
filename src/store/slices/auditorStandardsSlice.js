import { createSlice } from "@reduxjs/toolkit";

export const auditorStandardsSlice = createSlice({
    name: 'auditorStandardsSlice',
    initialState: {
        // Collection
        isAuditorStandardsLoading: false,
        auditorStandards: [],
        auditorStandardsMeta: null,
        // Element
        isAuditorStandardLoading: false,
        isAuditorStandardCreating: false,
        auditorStandardCreatedOk: false,
        isAuditorStandardSaving: false,
        auditorStandardSavedOk: false,
        isAuditorStandardDeleting: false,
        auditorStandardDeletedOk: false,
        auditorStandard: null,

        auditorStandardsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditorStandardsLoading: (state) => {
            state.isAuditorStandardsLoading = true;
        },
        isAuditorStandardsLoaded: (state) => {
            state.isAuditorStandardsLoading = false;
        },
        setAuditorStandards: (state, action) => {
            state.isAuditorStandardsLoading = false;
            state.auditorStandards = action.payload.auditorStandards;
            state.auditorStandardsMeta = action.payload.auditorStandardsMeta;
        },
        clearAuditorStandards: (state) => {
            state.isAuditorStandardsLoading = false;
            state.auditorStandards = [];
            state.auditorStandardsMeta = null;
        },
        // Element
        onAuditorStandardLoading: (state) => {
            state.isAuditorStandardLoading = true;
            state.auditorStandard = null;
        },
        onAuditorStandardCreating: (state) => {
            state.isAuditorStandardCreating = true;
            state.auditorStandardCreatedOk = false;
            state.auditorStandard = null;
        },
        isAuditorStandardCreated: (state) => {
            state.isAuditorStandardCreating = false;
            state.auditorStandardCreatedOk = true;
        },
        onAuditorStandardSaving: (state) => {
            state.isAuditorStandardSaving = true;
            state.auditorStandardSavedOk = false;
        },
        isAuditorStandardSaved: (state) => {
            state.isAuditorStandardSaving = false;
            state.auditorStandardSavedOk = true;
        },
        onAuditorStandardDeleting: (state) => {
            state.isAuditorStandardDeleting = true;
            state.auditorStandardDeletedOk = false;
        },
        isAuditorStandardDeleted: (state) => {
            state.isAuditorStandardDeleting = false;
            state.auditorStandardDeletedOk = true;
        },
        setAuditorStandard: (state, action) => {
            state.isAuditorStandardLoading = false;
            state.isAuditorStandardCreating = false;
            state.auditorStandardCreatedOk = false;
            state.isAuditorStandardSaving = false;
            state.auditorStandardSavedOk = false;
            state.isAuditorStandardDeleting = false;
            state.auditorStandardDeletedOk = false;
            state.auditorStandard = action.payload;
        },
        clearAuditorStandard: (state) => {
            state.isAuditorStandardLoading = false;
            state.isAuditorStandardCreating = false;
            state.auditorStandardCreatedOk = false;
            state.isAuditorStandardSaving = false;
            state.auditorStandardSavedOk = false;
            state.isAuditorStandardDeleting = false;
            state.auditorStandardDeletedOk = false;
            state.auditorStandard = null;
        },
        // Misc
        setAuditorStandardsErrorMessage: (state, action) => {
            state.isAuditorStandardsLoading = false;
            state.isAuditorStandardLoading = false;
            state.isAuditorStandardCreating = false;
            state.auditorStandardCreatedOk = false;
            state.isAuditorStandardSaving = false;
            state.auditorStandardSavedOk = false;
            state.isAuditorStandardDeleting = false;
            state.auditorStandardDeletedOk = false;
            state.auditorStandardsErrorMessage = action.payload;
        },
        clearAuditorStandardsErrorMessage: (state) => {
            state.auditorStandardsErrorMessage = null;
        }
    }
});

export const {
    onAuditorStandardsLoading,
    isAuditorStandardsLoaded,
    setAuditorStandards,
    clearAuditorStandards,

    onAuditorStandardLoading,
    onAuditorStandardCreating,
    isAuditorStandardCreated,
    onAuditorStandardSaving,
    isAuditorStandardSaved,
    onAuditorStandardDeleting,
    isAuditorStandardDeleted,
    setAuditorStandard,
    clearAuditorStandard,

    setAuditorStandardsErrorMessage,
    clearAuditorStandardsErrorMessage,
} = auditorStandardsSlice.actions;

export default auditorStandardsSlice;