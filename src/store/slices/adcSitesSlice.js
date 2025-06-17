import { createSlice } from "@reduxjs/toolkit";

export const adcSitesSlice = createSlice({
    name: 'adcSitesSlice',
    initialState: {
        // Collection
        isADCSitesLoading: false,
        adcSites: [],
        adcSitesMeta: null,
        // Element
        isADCSiteLoading: false,
        isADCSiteCreating: false,
        adcSiteCreatedOk: false,
        isADCSiteSaving: false,
        adcSiteSavedOk: false,
        isADCSiteDeleting: false,
        adcSiteDeletedOk: false,
        adcSite: null,

        adcSitesErrorMessage: null,
    },
    reducers: {
        // Collection
        onADCSitesLoading: (state) => {
            state.isADCSitesLoading = true;
        },
        isADCSitesLoaded: (state) => {
            state.isADCSitesLoading = false;
        },
        setADCSites: (state, action) => {
            state.isADCSitesLoading = false;
            state.adcSites = action.payload.adcSites;
            state.adcSitesMeta = action.payload.adcSitesMeta;
        },
        clearADCSites: (state) => {
            state.isADCSitesLoading = false;
            state.adcSites = [];
            state.adcSitesMeta = null;
        },
        // Element
        onADCSiteLoading: (state) => {
            state.isADCSiteLoading = true;
            state.adcSite = null;
        },
        onADCSiteCreating: (state) => {
            state.isADCSiteCreating = true;
            state.adcSiteCreatedOk = false;
            state.adcSite = null;
        },
        isADCSiteCreated: (state) => {
            state.isADCSiteCreating = false;
            state.adcSiteCreatedOk = true;
        },
        onADCSiteSaving: (state) => {
            state.isADCSiteSaving = true;
            state.adcSiteSavedOk = false;
        },
        isADCSiteSaved: (state) => {
            state.isADCSiteSaving = false;
            state.adcSiteSavedOk = true;
        },
        onADCSiteDeleting: (state) => {
            state.isADCSiteDeleting = true;
            state.adcSiteDeletedOk = false;
        },
        isADCSiteDeleted: (state) => {
            state.isADCSiteDeleting = false;
            state.adcSiteDeletedOk = true;
        },
        setADCSite: (state, action) => {
            state.isADCSiteLoading = false;
            state.isADCSiteCreating = false;
            state.adcSiteCreatedOk = false;
            state.isADCSiteSaving = false;
            state.adcSiteSavedOk = false;
            state.isADCSiteDeleting = false;
            state.adcSiteDeletedOk = false;
            state.adcSite = action.payload;
        },
        clearADCSite: (state) => {
            state.isADCSiteLoading = false;
            state.isADCSiteCreating = false;
            state.adcSiteCreatedOk = false;
            state.isADCSiteSaving = false;
            state.adcSiteSavedOk = false;
            state.isADCSiteDeleting = false;
            state.adcSiteDeletedOk = false;
            state.adcSite = null;
        },
        // Misc
        setADCSitesErrorMessage: (state, action) => {
            state.isADCSitesLoading = false;
            state.isADCSiteLoading = false;
            state.isADCSiteCreating = false;
            state.adcSiteCreatedOk = false;
            state.isADCSiteSaving = false;
            state.adcSiteSavedOk = false;
            state.isADCSiteDeleting = false;
            state.adcSiteDeletedOk = false;
            state.adcSitesErrorMessage = action.payload;
        },
        clearADCSitesErrorMessage: (state) => {
            state.adcSitesErrorMessage = null;
        }
    }
});

export const {
    onADCSitesLoading,
    isADCSitesLoaded,
    setADCSites,
    clearADCSites,

    onADCSiteLoading,
    onADCSiteCreating,
    isADCSiteCreated,
    onADCSiteSaving,
    isADCSiteSaved,
    onADCSiteDeleting,
    isADCSiteDeleted,
    setADCSite,
    clearADCSite,

    setADCSitesErrorMessage,
    clearADCSitesErrorMessage,
} = adcSitesSlice.actions;

export default adcSitesSlice;