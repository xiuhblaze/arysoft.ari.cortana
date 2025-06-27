import { createSlice } from "@reduxjs/toolkit";

export const adcConceptValuesSlice = createSlice({
    name: 'adcConceptValuesSlice',
    initialState: {
        // Collection
        isADCConceptValuesLoading: false,
        adcConceptValues: [],
        adcConceptValuesMeta: null,
        // Element
        isADCConceptValueLoading: false,
        isADCConceptValueCreating: false,
        adcConceptValueCreatedOk: false,
        isADCConceptValueSaving: false,
        adcConceptValueSavedOk: false,
        isADCConceptValueDeleting: false,
        adcConceptValueDeletedOk: false,
        adcConceptValue: null,

        adcConceptValuesErrorMessage: null,
    },
    reducers: {
        // Collection
        onADCConceptValuesLoading: (state) => {
            state.isADCConceptValuesLoading = true;
        },
        isADCConceptValuesLoaded: (state) => {
            state.isADCConceptValuesLoading = false;
        },
        setADCConceptValues: (state, action) => {
            state.isADCConceptValuesLoading = false;
            state.adcConceptValues = action.payload.adcConceptValues;
            state.adcConceptValuesMeta = action.payload.adcConceptValuesMeta;
        },
        clearADCConceptValues: (state) => {
            state.isADCConceptValuesLoading = false;
            state.adcConceptValues = [];
            state.adcConceptValuesMeta = null;
        },
        // Element
        onADCConceptValueLoading: (state) => {
            state.isADCConceptValueLoading = true;
            state.adcConceptValue = null;
        },
        onADCConceptValueCreating: (state) => {
            state.isADCConceptValueCreating = true;
            state.adcConceptValueCreatedOk = false;
            state.adcConceptValue = null;
        },
        isADCConceptValueCreated: (state) => {
            state.isADCConceptValueCreating = false;
            state.adcConceptValueCreatedOk = true;
        },
        onADCConceptValueSaving: (state) => {
            state.isADCConceptValueSaving = true;
            state.adcConceptValueSavedOk = false;
        },
        isADCConceptValueSaved: (state) => {
            state.isADCConceptValueSaving = false;
            state.adcConceptValueSavedOk = true;
        },
        onADCConceptValueDeleting: (state) => {
            state.isADCConceptValueDeleting = true;
            state.adcConceptValueDeletedOk = false;
        },
        isADCConceptValueDeleted: (state) => {
            state.isADCConceptValueDeleting = false;
            state.adcConceptValueDeletedOk = true;
        },
        setADCConceptValue: (state, action) => {
            state.isADCConceptValueLoading = false;
            state.isADCConceptValueCreating = false;
            state.adcConceptValueCreatedOk = false;
            state.isADCConceptValueSaving = false;
            state.adcConceptValueSavedOk = false;
            state.isADCConceptValueDeleting = false;
            state.adcConceptValueDeletedOk = false;
            state.adcConceptValue = action.payload;
        },
        clearADCConceptValue: (state) => {
            state.isADCConceptValueLoading = false;
            state.isADCConceptValueCreating = false;
            state.adcConceptValueCreatedOk = false;
            state.isADCConceptValueSaving = false;
            state.adcConceptValueSavedOk = false;
            state.isADCConceptValueDeleting = false;
            state.adcConceptValueDeletedOk = false;
            state.adcConceptValue = null;
        },
        // Misc
        setADCConceptValuesErrorMessage: (state, action) => {
            state.isADCConceptValuesLoading = false;
            state.isADCConceptValueLoading = false;
            state.isADCConceptValueCreating = false;
            state.adcConceptValueCreatedOk = false;
            state.isADCConceptValueSaving = false;
            state.adcConceptValueSavedOk = false;
            state.isADCConceptValueDeleting = false;
            state.adcConceptValueDeletedOk = false;
            state.adcConceptValuesErrorMessage = action.payload;
        },
        clearADCConceptValuesErrorMessage: (state) => {
            state.adcConceptValuesErrorMessage = null;
        }
    }
});

export const {
    onADCConceptValuesLoading,
    isADCConceptValuesLoaded,
    setADCConceptValues,
    clearADCConceptValues,

    onADCConceptValueLoading,
    onADCConceptValueCreating,
    isADCConceptValueCreated,
    onADCConceptValueSaving,
    isADCConceptValueSaved,
    onADCConceptValueDeleting,
    isADCConceptValueDeleted,
    setADCConceptValue,
    clearADCConceptValue,

    setADCConceptValuesErrorMessage,
    clearADCConceptValuesErrorMessage,
} = adcConceptValuesSlice.actions;

export default adcConceptValuesSlice;