import { createSlice } from "@reduxjs/toolkit";

export const adcsSlice = createSlice({
    name: 'adcsSlice',
    initialState: {
        // Collection
        isADCsLoading: false,
        adcs: [],
        adcsMeta: null,
        // Element
        isADCLoading: false,
        isADCCreating: false,
        adcCreatedOk: false,
        isADCSaving: false,
        adcSavedOk: false,
        isADCDeleting: false,
        adcDeletedOk: false,
        adc: null,

        adcsErrorMessage: null,
    },
    reducers: {
        // Collection
        onADCsLoading: (state) => {
            state.isADCsLoading = true;
        },
        isADCsLoaded: (state) => {
            state.isADCsLoading = false;
        },
        setADCs: (state, action) => {
            state.isADCsLoading = false;
            state.adcs = action.payload.adcs;
            state.adcsMeta = action.payload.adcsMeta;
        },
        clearADCs: (state) => {
            state.isADCsLoading = false;
            state.adcs = [];
            state.adcsMeta = null;
        },
        // Element
        onADCLoading: (state) => {
            state.isADCLoading = true;
            state.adc = null;
        },
        onADCCreating: (state) => {
            state.isADCCreating = true;
            state.adcCreatedOk = false;
            state.adc = null;
        },
        isADCCreated: (state) => {
            state.isADCCreating = false;
            state.adcCreatedOk = true;
        },
        onADCSaving: (state) => {
            state.isADCSaving = true;
            state.adcSavedOk = false;
        },
        isADCSaved: (state) => {
            state.isADCSaving = false;
            state.adcSavedOk = true;
        },
        onADCDeleting: (state) => {
            state.isADCDeleting = true;
            state.adcDeletedOk = false;
        },
        isADCDeleted: (state) => {
            state.isADCDeleting = false;
            state.adcDeletedOk = true;
        },
        setADC: (state, action) => {
            state.isADCLoading = false;
            state.isADCCreating = false;
            state.adcCreatedOk = false;
            state.isADCSaving = false;
            state.adcSavedOk = false;
            state.isADCDeleting = false;
            state.adcDeletedOk = false;
            state.adc = action.payload;
        },
        clearADC: (state) => {
            state.isADCLoading = false;
            state.isADCCreating = false;
            state.adcCreatedOk = false;
            state.isADCSaving = false;
            state.adcSavedOk = false;
            state.isADCDeleting = false;
            state.adcDeletedOk = false;
            state.adc = null;
        },
        // Misc
        setADCsErrorMessage: (state, action) => {
            state.isADCsLoading = false;
            state.isADCLoading = false;
            state.isADCCreating = false;
            state.adcCreatedOk = false;
            state.isADCSaving = false;
            state.adcSavedOk = false;
            state.isADCDeleting = false;
            state.adcDeletedOk = false;
            state.adcsErrorMessage = action.payload;
        },
        clearADCsErrorMessage: (state) => {
            state.adcsErrorMessage = null;
        }
    }
});

export const {
    onADCsLoading,
    isADCsLoaded,
    setADCs,
    clearADCs,

    onADCLoading,
    onADCCreating,
    isADCCreated,
    onADCSaving,
    isADCSaved,
    onADCDeleting,
    isADCDeleted,
    setADC,
    clearADC,

    setADCsErrorMessage,
    clearADCsErrorMessage,
} = adcsSlice.actions;

export default adcsSlice;