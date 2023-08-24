import { createSlice } from "@reduxjs/toolkit";

export const standardsSlice = createSlice({
  name: "standardsSlice",
  initialState: {
    // Collection
    isStandardsLoading: false,
    standards: [],
    standardsMeta: null,    
    // Element
    isStandardLoading: false,
    isStandardCreating: false,
    standardCreatedOk: false,
    isStandardSaving: false,
    standardSavedOk: false,
    isStandardDeleting: false,
    standardDeletedOk: false,
    standard: null,

    standardErrorMessage: null,
  },
  reducers: {
    // Collection
    onStandardsLoading: (state) => {
      state.isStandardsLoading = true;
    },
    isStandardsLoaded: (state) => {
      state.isStandardsLoading = false;
    },
    setStandards: (state, action) => {
      state.isStandardsLoading = false;
      state.standards = action.payload.standards;
      state.standardsMeta = action.payload.standardsMeta;
    },
    // Element
    onStandardLoading: (state) => {
      state.isStandardLoading = true;
      state.standard = null;
    },
    onStandardCreating: (state) => {
      state.isStandardCreating = true;
      state.standardCreatedOk = false;
      state.standard = null;      
    },
    isStandardCreated: (state) => {
      state.isStandardCreating = false;
      state.standardCreatedOk = true;
    },
    onStandardSaving: (state) => {
      state.isStandardSaving = true;
      state.standardSavedOk = false;
    },
    isStandardSaved: (state) => {
      state.isStandardSaving = false;
      state.standardSavedOk = true;
    },
    onStandardDeleting: (state) => {
      state.isStandardDeleting = true;
      state.standardDeletedOk = false;
    },
    isStandardDeleted: (state) => {
      state.isStandardDeleting = false;
      state.standardDeletedOk = true;
    },
    setStandard: (state, action) => {
      state.isStandardLoading = false;
      state.isStandardCreating = false;
      state.standardCreatedOk = false;
      state.isStandardSaving = false;
      state.standardSavedOk = false;
      state.isStandardDeleting = false;
      state.standardDeletedOk = false;
      state.standard = action.payload;
    },
    // Misc
    setStandardsErrorMessage: (state, action) => {
      state.isStandardsLoading = false;
      state.isStandardLoading = false;
      state.isStandardCreating = false;
      state.standardCreatedOk = false;
      state.isStandardSaving = false;
      state.standardSavedOk = false;
      state.isStandardDeleting = false;
      state.standardDeletedOk = false;
      state.standardErrorMessage = action.payload;
    }
  }
});

export const {
  onStandardsLoading,
  isStandardsLoaded,
  setStandards,

  onStandardLoading,
  onStandardCreating,
  isStandardCreated,
  onStandardSaving,
  isStandardSaved,
  onStandardDeleting,
  isStandardDeleted,
  setStandard,

  setStandardsErrorMessage,  
} = standardsSlice.actions;

export default standardsSlice;