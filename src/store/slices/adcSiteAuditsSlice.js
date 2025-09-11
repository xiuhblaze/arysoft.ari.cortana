import { createSlice } from "@reduxjs/toolkit";

export const adcSiteAuditsSlice = createSlice({
    name: 'adcSiteAuditsSlice',
    initialState: {
        // Collection
        isADCSiteAuditsLoading: false,
        adcSiteAudits: [],
        adcSiteAuditsMeta: null,
        // Element
        isADCSiteAuditLoading: false,
        isADCSiteAuditCreating: false,
        adcSiteAuditCreatedOk: false,
        isADCSiteAuditSaving: false,
        adcSiteAuditSavedOk: false,
        isADCSiteAuditDeleting: false,
        adcSiteAuditDeletedOk: false,
        adcSiteAudit: null,

        adcSiteAuditsErrorMessage: null,
    },
    reducers: {
        // Collection
        onADCSiteAuditsLoading: (state) => {
            state.isADCSiteAuditsLoading = true;
        },
        isADCSiteAuditsLoaded: (state) => {
            state.isADCSiteAuditsLoading = false;
        },
        setADCSiteAudits: (state, action) => {
            state.isADCSiteAuditsLoading = false;
            state.adcSiteAudits = action.payload.adcSiteAudits;
            state.adcSiteAuditsMeta = action.payload.adcSiteAuditsMeta;
        },
        clearADCSiteAudits: (state) => {
            state.isADCSiteAuditsLoading = false;
            state.adcSiteAudits = [];
            state.adcSiteAuditsMeta = null;
        },
        // Element
        onADCSiteAuditLoading: (state) => {
            state.isADCSiteAuditLoading = true;
            state.adcSiteAudit = null;
        },
        onADCSiteAuditCreating: (state) => {
            state.isADCSiteAuditCreating = true;
            state.adcSiteAuditCreatedOk = false;
            state.adcSiteAudit = null;
        },
        isADCSiteAuditCreated: (state) => {
            state.isADCSiteAuditCreating = false;
            state.adcSiteAuditCreatedOk = true;
        },
        onADCSiteAuditSaving: (state) => {
            state.isADCSiteAuditSaving = true;
            state.adcSiteAuditSavedOk = false;
        },
        isADCSiteAuditSaved: (state) => {
            state.isADCSiteAuditSaving = false;
            state.adcSiteAuditSavedOk = true;
        },
        onADCSiteAuditDeleting: (state) => {
            state.isADCSiteAuditDeleting = true;
            state.adcSiteAuditDeletedOk = false;
        },
        isADCSiteAuditDeleted: (state) => {
            state.isADCSiteAuditDeleting = false;
            state.adcSiteAuditDeletedOk = true;
        },
        setADCSiteAudit: (state, action) => {
            state.isADCSiteAuditLoading = false;
            state.isADCSiteAuditCreating = false;
            state.adcSiteAuditCreatedOk = false;
            state.isADCSiteAuditSaving = false;
            state.adcSiteAuditSavedOk = false;
            state.isADCSiteAuditDeleting = false;
            state.adcSiteAuditDeletedOk = false;
            state.adcSiteAudit = action.payload;
        },
        clearADCSiteAudit: (state) => {
            state.isADCSiteAuditLoading = false;
            state.isADCSiteAuditCreating = false;
            state.adcSiteAuditCreatedOk = false;
            state.isADCSiteAuditSaving = false;
            state.adcSiteAuditSavedOk = false;
            state.isADCSiteAuditDeleting = false;
            state.adcSiteAuditDeletedOk = false;
            state.adcSiteAudit = null;
        },
        // Misc
        setADCSiteAuditsErrorMessage: (state, action) => {
            state.isADCSiteAuditsLoading = false;
            state.isADCSiteAuditLoading = false;
            state.isADCSiteAuditCreating = false;
            state.adcSiteAuditCreatedOk = false;
            state.isADCSiteAuditSaving = false;
            state.adcSiteAuditSavedOk = false;
            state.isADCSiteAuditDeleting = false;
            state.adcSiteAuditDeletedOk = false;
            state.adcSiteAuditsErrorMessage = action.payload;
        },
        clearADCSiteAuditsErrorMessage: (state) => {
            state.adcSiteAuditsErrorMessage = null;
        }
    }
});

export const {
    onADCSiteAuditsLoading,
    isADCSiteAuditsLoaded,
    setADCSiteAudits,
    clearADCSiteAudits,

    onADCSiteAuditLoading,
    onADCSiteAuditCreating,
    isADCSiteAuditCreated,
    onADCSiteAuditSaving,
    isADCSiteAuditSaved,
    onADCSiteAuditDeleting,
    isADCSiteAuditDeleted,
    setADCSiteAudit,
    clearADCSiteAudit,

    setADCSiteAuditsErrorMessage,
    clearADCSiteAuditsErrorMessage,
} = adcSiteAuditsSlice.actions;

export default adcSiteAuditsSlice;