import { createSlice } from "@reduxjs/toolkit";

export const nacecodesSlice = createSlice({
  name: 'nacecodesSlice',
  initialState: {
    // Collection
    isNacecodesLoading: false,
    nacecodes: [],
    nacecodesMeta: null,    
    // Element
    isNacecodeLoading: false,
    isNacecodeCreating: false,
    nacecodeCreatedOk: false,
    isNacecodeSaving: false,
    nacecodeSavedOk: false,
    isNacecodeDeleting: false,
    nacecodeDeletedOk: false,
    nacecode: null,

    nacecodeErrorMessage: null,
  },
  reducers: {
    // Collection
    onNacecodesLoading: (state) => {
      state.isNacecodesLoading = true;
    },
    setNacecodes: (state, action) => {
      state.isNacecodesLoading = false;
      state.nacecodes = action.payload.nacecodes;
      state.nacecodesMeta = action.payload.nacecodesMeta;
    },

    // Element
    onNacecodeLoading: (state) => {
      state.isNacecodeLoading = true;
      state.nacecode = null;
    },
    setNacecode: (state, action) => {
      state.isNacecodeLoading = false;
      state.isNacecodeCreating = false;
      state.nacecodeCreatedOk = false;
      state.isNacecodeSaving = false;
      state.nacecodeSavedOk = false;
      state.isNacecodeDeleting = false;
      state.nacecodeDeletedOk = false;
      state.nacecode = action.payload;
    },
    // element - creating
    onNacecodeCreating: (state) => {
      state.isNacecodeCreating = true;
      state.nacecodeCreatedOk = false;
      state.nacecode = null;      
    },
    isNacecodeCreated: (state) => {
      state.isNacecodeCreating = false;
      state.nacecodeCreatedOk = true;
    },
    // element - saving
    onNacecodeSaving: (state) => {
      state.isNacecodeSaving = true;
      state.nacecodeSavedOk = false;
    },
    isNacecodeSaved: (state, action) => {
      state.isNacecodeSaving = false;
      state.nacecodeSavedOk = true;
      if (!!action?.payload) {
        state.nacecodes = state.nacecodes.map( item => {
          if (item.NaceCodeID === action.payload.NaceCodeID) {
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
    onNacecodeDeleting: (state) => {
      state.isNacecodeDeleting = true;
      state.nacecodeDeletedOk = false;
    },
    isNacecodeDeleted: (state) => {
      state.isNacecodeDeleting = false;
      state.nacecodeDeletedOk = true;
    },
    
    // Misc
    setNacecodesErrorMessage: (state, action) => {
      state.isNacecodesLoading = false;
      state.isNacecodeLoading = false;
      state.isNacecodeCreating = false;
      state.nacecodeCreatedOk = false;
      state.isNacecodeSaving = false;
      state.nacecodeSavedOk = false;
      state.isNacecodeDeleting = false;
      state.nacecodeDeletedOk = false;
      state.nacecodeErrorMessage = action.payload;
    }
  }
});

export const {
  onNacecodesLoading,
  isNacecodesLoaded,
  setNacecodes,

  onNacecodeLoading,
  onNacecodeCreating,
  isNacecodeCreated,
  onNacecodeSaving,
  isNacecodeSaved,
  onNacecodeDeleting,
  isNacecodeDeleted,
  setNacecode,

  setNacecodesErrorMessage,  
} = nacecodesSlice.actions;

export default nacecodesSlice;
