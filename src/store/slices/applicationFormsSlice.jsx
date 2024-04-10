import { createSlice } from "@reduxjs/toolkit";

export const applicationFormsSlice = createSlice({
    name: 'applicationFormSlice',
    initialState: {
        // list
        isApplicationFormsLoading: false,
        applicationForms: [],
        applicationFormsMeta: null,
        // item
        isApplicationFormLoading: false,
        isApplicationFormCreating: false,
        applicationFormCreatedOk: false,
        isApplicationFormSaving: false,
        applicationFormSavedOk: false,
        isApplicationFormDeleting: false,
        applicationFormDeletedOk: false,
        applicationForm: null,
        // misc
        applicationFormsErrorMessage: null
    },
    reducers: {
        // list
        onApplicationFormsLoading: (state) => {
            state.isApplicationFormsLoading = true;
        },
        setApplicationForms: (state, action) => {
            state.isApplicationFormsLoading = false;
            state.applicationForms = action.payload.applicationForms;
            state.applicationFormsMeta = action.payload.meta;
        },
        // item
        onApplicationFormLoading: (state) => {
            state.isApplicationFormLoading = true;
          },
          setApplicationForm: (state, action) => {
            state.isApplicationFormLoading = false;
            state.isApplicationFormCreating = false;
            state.applicationFormCreatedOk = false;
            state.isApplicationFormSaving = false;
            state.applicationFormSavedOk = false;
            state.isApplicationFormDeleting = false;
            state.applicationFormDeletedOk = false;
            state.applicationForm = action.payload;
          },
          clearApplicationForm: (state) => {
            state.isApplicationFormLoading = false;
            state.isApplicationFormCreating = false;
            state.applicationFormCreatedOk = false;
            state.isApplicationFormSaving = false;
            state.applicationFormSavedOk = false;
            state.isApplicationFormDeleting = false;
            state.applicationFormDeletedOk = false;
            state.applicationForm = null;
          },
          // element - creating
          onApplicationFormCreating: (state) => {
            state.isApplicationFormCreating = true;
            state.applicationFormCreatedOk = false;
            state.applicationForm = null;
          },
          isApplicationFormCreated: (state) => {
            state.isApplicationFormCreating = false;
            state.applicationFormCreatedOk = true;
          },
          // element - saving
          onApplicationFormSaving: (state) => {
            state.isApplicationFormSaving = true;
            state.applicationFormSavedOk = false;
          },
          isApplicationFormSaved: (state) => {
            state.isApplicationFormSaving = false;
            state.applicationFormSavedOk = true;
            // state.applicationFormAction = null;
          },
          // item - deleting
          onApplicationFormDeleting: (state) => {
            state.isApplicationFormDeleting = true;
            state.applicationFormDeletedOk = false;
          },
          isApplicationFormDeleted: (state) => {
            state.isApplicationFormDeleting = false;
            state.applicationFormDeletedOk = true;
          },
          // misc
          setApplicationFormsErrorMessage: (state, action) => {
            state.isApplicationFormsLoading = false;
            state.isApplicationFormLoading = false;
            state.isApplicationFormCreating = false;
            state.applicationFormCreatedOk = false;
            state.isApplicationFormSaving = false;
            state.applicationFormSavedOk = false;
            state.ApplicationFormsErrorMessage = action.payload;
          },
          clearApplicationFormsErrorMessage: (state) => {
            state.applicationFormsErrorMessage = null;
          }
    }
});

export const {
    onApplicationFormsLoading,
    setApplicationForms,
  
    onApplicationFormLoading,
    setApplicationForm,  
    clearApplicationForm,
    onApplicationFormCreating,
    isApplicationFormCreated,
    onApplicationFormSaving,
    isApplicationFormSaved,
    onApplicationFormDeleting,
    isApplicationFormDeleted,
    
    setApplicationFormsErrorMessage,
    clearApplicationFormsErrorMessage,
} = applicationFormsSlice.actions;

export default applicationFormsSlice;