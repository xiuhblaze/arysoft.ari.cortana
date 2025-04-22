import { createSlice } from "@reduxjs/toolkit";

export const appFormsSlice = createSlice({
    name: 'appFormsSlice',
    initialState: {
        // Collection
        isAppFormsLoading: false,
        appForms: [],
        appFormsMeta: null,
        // Element
        isAppFormLoading: false,
        isAppFormCreating: false,
        appFormCreatedOk: false,
        isAppFormSaving: false,
        appFormSavedOk: false,
        isAppFormDeleting: false,
        appFormDeletedOk: false,
        appForm: null,

        appFormsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAppFormsLoading: (state) => {
            state.isAppFormsLoading = true;
        },
        isAppFormsLoaded: (state) => {
            state.isAppFormsLoading = false;
        },
        setAppForms: (state, action) => {
            state.isAppFormsLoading = false;
            state.appForms = action.payload.appForms;
            state.appFormsMeta = action.payload.appFormsMeta;
        },
        clearAppForms: (state) => {
            state.isAppFormsLoading = false;
            state.appForms = [];
            state.appFormsMeta = null;
        },
        // Element
        onAppFormLoading: (state) => {
            state.isAppFormLoading = true;
            state.appForm = null;
        },
        onAppFormCreating: (state) => {
            state.isAppFormCreating = true;
            state.appFormCreatedOk = false;
            state.appForm = null;
        },
        isAppFormCreated: (state) => {
            state.isAppFormCreating = false;
            state.appFormCreatedOk = true;
        },
        onAppFormSaving: (state) => {
            state.isAppFormSaving = true;
            state.appFormSavedOk = false;
        },
        isAppFormSaved: (state) => {
            state.isAppFormSaving = false;
            state.appFormSavedOk = true;
        },
        onAppFormDeleting: (state) => {
            state.isAppFormDeleting = true;
            state.appFormDeletedOk = false;
        },
        isAppFormDeleted: (state) => {
            state.isAppFormDeleting = false;
            state.appFormDeletedOk = true;
        },
        setAppForm: (state, action) => {
            state.isAppFormLoading = false;
            state.isAppFormCreating = false;
            state.appFormCreatedOk = false;
            state.isAppFormSaving = false;
            state.appFormSavedOk = false;
            state.isAppFormDeleting = false;
            state.appFormDeletedOk = false;
            state.appForm = action.payload;
        },
        clearAppForm: (state) => {
            state.isAppFormLoading = false;
            state.isAppFormCreating = false;
            state.appFormCreatedOk = false;
            state.isAppFormSaving = false;
            state.appFormSavedOk = false;
            state.isAppFormDeleting = false;
            state.appFormDeletedOk = false;
            state.appForm = null;
        },
        // Misc
        setAppFormsErrorMessage: (state, action) => {
            state.isAppFormsLoading = false;
            state.isAppFormLoading = false;
            state.isAppFormCreating = false;
            state.appFormCreatedOk = false;
            state.isAppFormSaving = false;
            state.appFormSavedOk = false;
            state.isAppFormDeleting = false;
            state.appFormDeletedOk = false;
            state.appFormsErrorMessage = action.payload;
        },
        clearAppFormsErrorMessage: (state) => {
            state.appFormsErrorMessage = null;
        }
    }
});

export const {
    onAppFormsLoading,
    isAppFormsLoaded,
    setAppForms,
    clearAppForms,

    onAppFormLoading,
    onAppFormCreating,
    isAppFormCreated,
    onAppFormSaving,
    isAppFormSaved,
    onAppFormDeleting,
    isAppFormDeleted,
    setAppForm,
    clearAppForm,

    setAppFormsErrorMessage,
    clearAppFormsErrorMessage,
} = appFormsSlice.actions;

export default appFormsSlice;