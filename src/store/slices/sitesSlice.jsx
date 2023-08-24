import { createSlice } from "@reduxjs/toolkit";

export const sitesSlice = createSlice({
  name: 'sitesSlice',
  initialState: {
    // Collection
    isSitesLoading: false,
    sites: [],
    sitesMeta: null,    
    // Element
    isSiteLoading: false,
    isSiteCreating: false,
    siteCreatedOk: false,
    isSiteSaving: false,
    siteSavedOk: false,
    isSiteDeleting: false,
    siteDeletedOk: false,
    site: null,

    siteErrorMessage: null,
  },
  reducers: {
    // Collection
    onSitesLoading: (state) => {
      state.isSitesLoading = true;
    },
    isSitesLoaded: (state) => {
      state.isSitesLoading = false;
    },
    setSites: (state, action) => {
      state.isSitesLoading = false;
      state.sites = action.payload.sites;
      state.sitesMeta = action.payload.sitesMeta;
    },
    // Element
    onSiteLoading: (state) => {
      state.isSiteLoading = true;
      state.site = null;
    },
    onSiteCreating: (state) => {
      state.isSiteCreating = true;
      state.siteCreatedOk = false;
      state.site = null;
    },
    isSiteCreated: (state) => {
      state.isSiteCreating = false;
      state.siteCreatedOk = true;
    },
    onSiteSaving: (state) => {
      state.isSiteSaving = true;
      state.siteSavedOk = false;
    },
    isSiteSaved: (state) => {
      state.isSiteSaving = false;
      state.siteSavedOk = true;
    },
    onSiteDeleting: (state) => {
      state.isSiteDeleting = true;
      state.siteDeletedOk = false;
    },
    isSiteDeleted: (state) => {
      state.isSiteDeleting = false;
      state.siteDeletedOk = true;
    },
    setSite: (state, action) => {
      state.isSiteLoading = false;
      state.isSiteCreating = false;
      state.siteCreatedOk = false;
      state.isSiteSaving = false;
      state.siteSavedOk = false;
      state.isSiteDeleting = false;
      state.siteDeletedOk = false;
      state.site = action.payload;
    },
    // Misc
    setSitesErrorMessage: (state, action) => {
      state.isSitesLoading = false;
      state.isSiteLoading = false;
      state.isSiteCreating = false;
      state.siteCreatedOk = false;
      state.isSiteSaving = false;
      state.siteSavedOk = false;
      state.isSiteDeleting = false;
      state.siteDeletedOk = false;
      state.siteErrorMessage = action.payload;
    }
  }
});

export const {
  onSitesLoading,
  isSitesLoaded,
  setSites,

  onSiteLoading,
  onSiteCreating,
  isSiteCreated,
  onSiteSaving,
  isSiteSaved,
  onSiteDeleting,
  isSiteDeleted,
  setSite,

  setSitesErrorMessage,  
} = sitesSlice.actions;

export default sitesSlice;