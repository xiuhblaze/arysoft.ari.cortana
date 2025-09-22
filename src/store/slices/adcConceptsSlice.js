import { createSlice } from "@reduxjs/toolkit";

export const adcConceptsSlice = createSlice({
    name: 'adcConceptsSlice',
    initialState: {
        // Collection
        isADCConceptsLoading: false,
        adcConcepts: [],
        adcConceptsMeta: null,
        // Element
        isADCConceptLoading: false,
        isADCConceptCreating: false,
        adcConceptCreatedOk: false,
        isADCConceptSaving: false,
        adcConceptSavedOk: false,
        isADCConceptDeleting: false,
        adcConceptDeletedOk: false,
        adcConcept: null,

        adcConceptsErrorMessage: null,
    },
    reducers: {
        // Collection
        onADCConceptsLoading: (state) => {
            state.isADCConceptsLoading = true;
        },
        isADCConceptsLoaded: (state) => {
            state.isADCConceptsLoading = false;
        },
        setADCConcepts: (state, action) => {
            state.isADCConceptsLoading = false;
            state.adcConcepts = action.payload.adcConcepts;
            state.adcConceptsMeta = action.payload.adcConceptsMeta;
        },
        clearADCConcepts: (state) => {
            state.isADCConceptsLoading = false;
            state.adcConcepts = [];
            state.adcConceptsMeta = null;
        },
        // Element
        onADCConceptLoading: (state) => {
            state.isADCConceptLoading = true;
            state.adcConcept = null;
        },
        onADCConceptCreating: (state) => {
            state.isADCConceptCreating = true;
            state.adcConceptCreatedOk = false;
            state.adcConcept = null;
        },
        isADCConceptCreated: (state) => {
            state.isADCConceptCreating = false;
            state.adcConceptCreatedOk = true;
        },
        onADCConceptSaving: (state) => {
            state.isADCConceptSaving = true;
            state.adcConceptSavedOk = false;
        },
        isADCConceptSaved: (state) => {
            state.isADCConceptSaving = false;
            state.adcConceptSavedOk = true;
        },
        onADCConceptDeleting: (state) => {
            state.isADCConceptDeleting = true;
            state.adcConceptDeletedOk = false;
        },
        isADCConceptDeleted: (state) => {
            state.isADCConceptDeleting = false;
            state.adcConceptDeletedOk = true;
        },
        setADCConcept: (state, action) => {
            state.isADCConceptLoading = false;
            state.isADCConceptCreating = false;
            state.adcConceptCreatedOk = false;
            state.isADCConceptSaving = false;
            state.adcConceptSavedOk = false;
            state.isADCConceptDeleting = false;
            state.adcConceptDeletedOk = false;
            state.adcConcept = action.payload;
        },
        clearADCConcept: (state) => {
            state.isADCConceptLoading = false;
            state.isADCConceptCreating = false;
            state.adcConceptCreatedOk = false;
            state.isADCConceptSaving = false;
            state.adcConceptSavedOk = false;
            state.isADCConceptDeleting = false;
            state.adcConceptDeletedOk = false;
            state.adcConcept = null;
        },
        // Misc
        setADCConceptsErrorMessage: (state, action) => {
            state.isADCConceptsLoading = false;
            state.isADCConceptLoading = false;
            state.isADCConceptCreating = false;
            state.adcConceptCreatedOk = false;
            state.isADCConceptSaving = false;
            state.adcConceptSavedOk = false;
            state.isADCConceptDeleting = false;
            state.adcConceptDeletedOk = false;
            state.adcConceptsErrorMessage = action.payload;
        },
        clearADCConceptsErrorMessage: (state) => {
            state.adcConceptsErrorMessage = null;
        }
    }
});

export const {
    onADCConceptsLoading,
    isADCConceptsLoaded,
    setADCConcepts,
    clearADCConcepts,

    onADCConceptLoading,
    onADCConceptCreating,
    isADCConceptCreated,
    onADCConceptSaving,
    isADCConceptSaved,
    onADCConceptDeleting,
    isADCConceptDeleted,
    setADCConcept,
    clearADCConcept,

    setADCConceptsErrorMessage,
    clearADCConceptsErrorMessage,
} = adcConceptsSlice.actions;

export default adcConceptsSlice;