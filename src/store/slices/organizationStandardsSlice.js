import { createSlice } from "@reduxjs/toolkit";

export const organizationStandardsSlice = createSlice({
    name: 'organizationStandardsSlice',
    initialState: {
        // Collection
        isOrganizationStandardsLoading: false,
        organizationStandards: [],
        organizationStandardsMeta: null,
        // Element
        isOrganizationStandardLoading: false,
        isOrganizationStandardCreating: false,
        organizationStandardCreatedOk: false,
        isOrganizationStandardSaving: false,
        organizationStandardSavedOk: false,
        isOrganizationStandardDeleting: false,
        organizationStandardDeletedOk: false,
        organizationStandard: null,

        organizationStandardsErrorMessage: null,
    },
    reducers: {
        // Collection
        onOrganizationStandardsLoading: (state) => {
            state.isOrganizationStandardsLoading = true;
        },
        isOrganizationStandardsLoaded: (state) => {
            state.isOrganizationStandardsLoading = false;
        },
        setOrganizationStandards: (state, action) => {
            state.isOrganizationStandardsLoading = false;
            state.organizationStandards = action.payload.organizationStandards;
            state.organizationStandardsMeta = action.payload.organizationStandardsMeta;
        },
        clearOrganizationStandards: (state) => {
            state.isOrganizationStandardsLoading = false;
            state.organizationStandards = [];
            state.organizationStandardsMeta = null;
        },
        // Element
        onOrganizationStandardLoading: (state) => {
            state.isOrganizationStandardLoading = true;
            state.organizationStandard = null;
        },
        onOrganizationStandardCreating: (state) => {
            state.isOrganizationStandardCreating = true;
            state.organizationStandardCreatedOk = false;
            state.organizationStandard = null;
        },
        isOrganizationStandardCreated: (state) => {
            state.isOrganizationStandardCreating = false;
            state.organizationStandardCreatedOk = true;
        },
        onOrganizationStandardSaving: (state) => {
            state.isOrganizationStandardSaving = true;
            state.organizationStandardSavedOk = false;
        },
        isOrganizationStandardSaved: (state) => {
            state.isOrganizationStandardSaving = false;
            state.organizationStandardSavedOk = true;
        },
        onOrganizationStandardDeleting: (state) => {
            state.isOrganizationStandardDeleting = true;
            state.organizationStandardDeletedOk = false;
        },
        isOrganizationStandardDeleted: (state) => {
            state.isOrganizationStandardDeleting = false;
            state.organizationStandardDeletedOk = true;
        },
        setOrganizationStandard: (state, action) => {
            state.isOrganizationStandardLoading = false;
            state.isOrganizationStandardCreating = false;
            state.organizationStandardCreatedOk = false;
            state.isOrganizationStandardSaving = false;
            state.organizationStandardSavedOk = false;
            state.isOrganizationStandardDeleting = false;
            state.organizationStandardDeletedOk = false;
            state.organizationStandard = action.payload;
        },
        clearOrganizationStandard: (state) => {
            state.isOrganizationStandardLoading = false;
            state.isOrganizationStandardCreating = false;
            state.organizationStandardCreatedOk = false;
            state.isOrganizationStandardSaving = false;
            state.organizationStandardSavedOk = false;
            state.isOrganizationStandardDeleting = false;
            state.organizationStandardDeletedOk = false;
            state.organizationStandard = null;
        },
        // Misc
        setOrganizationStandardsErrorMessage: (state, action) => {
            state.isOrganizationStandardsLoading = false;
            state.isOrganizationStandardLoading = false;
            state.isOrganizationStandardCreating = false;
            state.organizationStandardCreatedOk = false;
            state.isOrganizationStandardSaving = false;
            state.organizationStandardSavedOk = false;
            state.isOrganizationStandardDeleting = false;
            state.organizationStandardDeletedOk = false;
            state.organizationStandardsErrorMessage = action.payload;
        },
        clearOrganizationStandardsErrorMessage: (state) => {
            state.organizationStandardsErrorMessage = null;
        }
    }
});

export const {
    onOrganizationStandardsLoading,
    isOrganizationStandardsLoaded,
    setOrganizationStandards,
    clearOrganizationStandards,

    onOrganizationStandardLoading,
    onOrganizationStandardCreating,
    isOrganizationStandardCreated,
    onOrganizationStandardSaving,
    isOrganizationStandardSaved,
    onOrganizationStandardDeleting,
    isOrganizationStandardDeleted,
    setOrganizationStandard,
    clearOrganizationStandard,

    setOrganizationStandardsErrorMessage,
    clearOrganizationStandardsErrorMessage,
} = organizationStandardsSlice.actions;

export default organizationStandardsSlice;