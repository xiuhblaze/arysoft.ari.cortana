import { createSlice } from "@reduxjs/toolkit";

export const organizationsSlice = createSlice({
    name: "organizationsSlice",
    initialState: {
        // Collection
        isOrganizationsLoading: false,
        organizations: [],
        organizationsMeta: null,
        isOrganizationsFullListLoading: false,
        organizationsFullList: [],
        // Element
        isOrganizationLoading: false,
        isOrganizationCreating: false,
        organizationCreatedOk: false,
        isOrganizationSaving: false,
        organizationSavedOk: false,
        isOrganizationDeleting: false,
        organizationDeletedOk: false,
        organization: null,

        organizationsErrorMessage: null,
    },
    reducers: {
        // Collection
        onOrganizationsLoading: (state) => {
            state.isOrganizationsLoading = true;
        },
        setOrganizations: (state, action) => {
            state.isOrganizationsLoading = false;
            state.organizations = action.payload.organizations;
            state.organizationsMeta = action.payload.organizationsMeta;
        },
        onOrganizationsFullListLoading: (state) => {
            state.isOrganizationsFullListLoading = true;
        },
        setOrganizationsFullList: (state, action) => {
            state.isOrganizationsFullListLoading = false;
            state.organizationsFullList = action.payload.data;
        },
        // Element data
        onOrganizationLoading: (state) => {
            state.isOrganizationLoading = true;
            state.organization = null;
        },
        setOrganization: (state, action) => {
            state.isOrganizationLoading = false;
            state.isOrganizationCreating = false;
            state.organizationCreatedOk = false;
            state.isOrganizationSaving = false;
            state.organizationSavedOk = false;
            state.isOrganizationDeleting = false;
            state.organizationDeletedOk = false;
            state.organization = action.payload;
        },
        // element creating data
        onOrganizationCreating: (state) => {
            state.isOrganizationCreating = true;
            state.organizationCreatedOk = false;
            state.organization = null;
        },
        isOrganizationCreated: (state) => {
            state.isOrganizationCreating = false;
            state.organizationCreatedOk = true;
        },
        // element saving data
        onOrganizationSaving: (state) => {
            state.isOrganizationSaving = true;
            state.organizationSavedOk = false;
        },
        isOrganizationSaved: (state, action) => {
            state.isOrganizationSaving = false;
            state.organizationSavedOk = true;
        },
        // element deleting data
        onOrganizationDeleting: (state) => {
            state.isOrganizationDeleting = true;
            state.organizationDeletedOk = false;
        },
        isOrganizationDeleted: (state) => {
            state.isOrganizationDeleting = false;
            state.organizationDeletedOk = true;
        },
        // Misc
        setOrganizationsErrorMessage: (state, action) => {
            state.isOrganizationsLoading = false;
            state.isOrganizationLoading = false;
            state.isOrganizationCreating = false;
            state.organizationCreatedOk = false;
            state.isOrganizationSaving = false;
            state.organizationSavedOk = false;
            state.isOrganizationDeleting = false;
            state.organizationDeletedOk = false;
            state.organizationsErrorMessage = action.payload;
        }
    }
});

export const {
    onOrganizationsLoading,
    setOrganizations,
    onOrganizationsFullListLoading,
    setOrganizationsFullList,

    onOrganizationLoading,
    onOrganizationCreating,
    isOrganizationCreated,
    onOrganizationSaving,
    isOrganizationSaved,
    onOrganizationDeleting,
    isOrganizationDeleted,
    setOrganization,

    setOrganizationsErrorMessage,
} = organizationsSlice.actions;

export default organizationsSlice;