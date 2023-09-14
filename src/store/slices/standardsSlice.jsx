import { createSlice } from "@reduxjs/toolkit";

export const standardsSlice = createSlice({
  name: 'standards',
  initialState: {
    // list
    isStandardsLoading: false,
    standards: [],
    standardsMeta: null,
    isStandardsFullListLoading: false,
    standardsFullList: [],
    // element
    isStandardLoading: false,
    isStandardCreating: false,
    standardCreatedOk: false,
    isStandardSaving: false,
    standardSavedOk: false,
    isStandardDeleting: false,
    standardDeletedOk: false,
    standard: null,
    // misc
    standardsErrorMessage: undefined,
  },
  reducers: {
    // list
    onStandardsLoading: (state) => {
      state.isStandardsLoading = true;
    },
    setStandards: (state, action) => {
      state.isStandardsLoading = false;
      state.standards = action.payload.standards;
      state.standardsMeta = action.payload.standardsMeta;
    },
    onStandardsFullListLoading: (state) => {
      state.isStandardsFullListLoading = true;
    },
    setStandardsFullList: (state, action) => {
      state.isStandardsFullListLoading = false;
      state.standardsFullList = action.payload.data;
    },
    // element
    onStandardLoading: (state) => {
      state.isStandardLoading = true;
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
    clearStandard: (state) => {
      state.isStandardLoading = false;
      state.isStandardCreating = false;
      state.standardCreatedOk = false;
      state.isStandardSaving = false;
      state.standardSavedOk = false;
      state.isStandardDeleting = false;
      state.standardDeletedOk = false;
      state.standard = null;
    },
    // element - creating
    onStandardCreating: (state) => {
      state.isStandardCreating = true;
      state.standardCreatedOk = false;
      state.standard = null;
    },
    isStandardCreated: (state) => {
      state.isStandardCreating = false;
      state.standardCreatedOk = true;
    },
    // element - saving
    onStandardSaving: (state) => {
      state.isStandardSaving = true;
      state.standardSavedOk = false;
    },
    isStandardSaved: (state, action) => {
      state.isStandardSaving = false;
      state.standardSavedOk = true;
      if (!!action?.payload) {
        state.standards = state.standards.map( item => {
          if (item.StandardID === action.payload.StandardID) {
            return {
              ...item,
              ...action.payload,
            }
          }
          return item;
        });
      }
    },
    // element - deleting
    onStandardDeleting: (state) => {
      state.isStandardDeleting = true;
      state.standardDeletedOk = false;
    },
    isStandardDeleted: (state) => {
      state.isStandardDeleting = false;
      state.standardDeletedOk = true;
    },
    // misc
    setStandardsErrorMessage: (state, action) => {
      state.isStandardsLoading = false;
      state.isStandardLoading = false;
      state.isStandardCreating = false;
      state.standardCreatedOk = false;
      state.isStandardSaving = false;
      state.standardSavedOk = false;
      state.isStandardDeleting = false;
      state.standardDeletedOk = false;
      state.standardsErrorMessage = action.payload;
    },
    clearStandardsErrorMessage: (state) => {
      state.standardsErrorMessage = undefined;
    }
  }
});

export const {
  onStandardsLoading,
  setStandards,
  onStandardsFullListLoading,
  setStandardsFullList,

  onStandardLoading,
  setStandard,  
  clearStandard,
  onStandardCreating,
  isStandardCreated,
  onStandardSaving,
  isStandardSaved,
  onStandardDeleting,
  isStandardDeleted,
  
  setStandardsErrorMessage,
  clearStandardsErrorMessage,
} = standardsSlice.actions;

export default standardsSlice;