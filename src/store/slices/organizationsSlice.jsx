import { createSlice } from "@reduxjs/toolkit";

export const organizationsSlice = createSlice({
  name: "organizationsSlice",
  initialState: {
    // Collection
    isOrganizationsLoading: false,
    organizations: [],
    organizationsMeta: null,    
    // Element
    isOrganizationLoading: false,
    isOrganizationCreating: false,
    organizationCreatedOk: false,
    isOrganizationSaving: false,
    organizationSavedOk: false,
    isOrganizationDeleting: false,
    organizationDeletedOk: false,
    organization: null,

    organizationErrorMessage: null,
  },
  reducers: {
    // Collection
    onOrganizationsLoading: (state) => {
      state.isOrganizationsLoading = true;
    },
    isOrganizationsLoaded: (state) => {
      state.isOrganizationsLoading = false;
    },
    setOrganizations: (state, action) => {
      state.isOrganizationsLoading = false;
      state.organizations = action.payload.organizations;
      state.organizationsMeta = action.payload.organizationsMeta;
    },
    // Element
    onOrganizationLoading: (state) => {
      state.isOrganizationLoading = true;
      state.organization = null;
    },
    onOrganizationCreating: (state) => {
      state.isOrganizationCreating = true;
      state.organizationCreatedOk = false;
      state.organization = null;
    },
    isOrganizationCreated: (state) => {
      state.isOrganizationCreating = false;
      state.organizationCreatedOk = true;
    },
    onOrganizationSaving: (state) => {
      state.isOrganizationSaving = true;
      state.organizationSavedOk = false;
    },
    isOrganizationSaved: (state) => {
      state.isOrganizationSaving = false;
      state.organizationSavedOk = true;
    },
    onOrganizationDeleting: (state) => {
      state.isOrganizationDeleting = true;
      state.organizationDeletedOk = false;
    },
    isOrganizationDeleted: (state) => {
      state.isOrganizationDeleting = false;
      state.organizationDeletedOk = true;
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
      state.organizationErrorMessage = action.payload;
    }
  }
});

export const {
  onOrganizationsLoading,
  isOrganizationsLoaded,
  setOrganizations,

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