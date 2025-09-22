import { createSlice } from "@reduxjs/toolkit";

export const md5sSlice = createSlice({
    name: 'md5sSlice',
    initialState: {
        // Collection
        isMD5sLoading: false,
        md5s: [],
        md5sMeta: null,
        // Element
        isMD5Loading: false,
        isMD5Creating: false,
        md5CreatedOk: false,
        isMD5Saving: false,
        md5SavedOk: false,
        isMD5Deleting: false,
        md5DeletedOk: false,
        md5: null,

        md5sErrorMessage: null,
    },
    reducers: {
        // Collection
        onMD5sLoading: (state) => {
            state.isMD5sLoading = true;
        },
        isMD5sLoaded: (state) => {
            state.isMD5sLoading = false;
        },
        setMD5s: (state, action) => {
            state.isMD5sLoading = false;
            state.md5s = action.payload.md5s;
            state.md5sMeta = action.payload.md5sMeta;
        },
        clearMD5s: (state) => {
            state.isMD5sLoading = false;
            state.md5s = [];
            state.md5sMeta = null;
        },
        // Element
        onMD5Loading: (state) => {
            state.isMD5Loading = true;
            state.md5 = null;
        },
        onMD5Creating: (state) => {
            state.isMD5Creating = true;
            state.md5CreatedOk = false;
            state.md5 = null;
        },
        isMD5Created: (state) => {
            state.isMD5Creating = false;
            state.md5CreatedOk = true;
        },
        onMD5Saving: (state) => {
            state.isMD5Saving = true;
            state.md5SavedOk = false;
        },
        isMD5Saved: (state) => {
            state.isMD5Saving = false;
            state.md5SavedOk = true;
        },
        onMD5Deleting: (state) => {
            state.isMD5Deleting = true;
            state.md5DeletedOk = false;
        },
        isMD5Deleted: (state) => {
            state.isMD5Deleting = false;
            state.md5DeletedOk = true;
        },
        setMD5: (state, action) => {
            state.isMD5Loading = false;
            state.isMD5Creating = false;
            state.md5CreatedOk = false;
            state.isMD5Saving = false;
            state.md5SavedOk = false;
            state.isMD5Deleting = false;
            state.md5DeletedOk = false;
            state.md5 = action.payload;
        },
        clearMD5: (state) => {
            state.isMD5Loading = false;
            state.isMD5Creating = false;
            state.md5CreatedOk = false;
            state.isMD5Saving = false;
            state.md5SavedOk = false;
            state.isMD5Deleting = false;
            state.md5DeletedOk = false;
            state.md5 = null;
        },
        // Misc
        setMD5sErrorMessage: (state, action) => {
            state.isMD5sLoading = false;
            state.isMD5Loading = false;
            state.isMD5Creating = false;
            state.md5CreatedOk = false;
            state.isMD5Saving = false;
            state.md5SavedOk = false;
            state.isMD5Deleting = false;
            state.md5DeletedOk = false;
            state.md5sErrorMessage = action.payload;
        },
        clearMD5sErrorMessage: (state) => {
            state.md5sErrorMessage = null;
        }
    }
});

export const {
    onMD5sLoading,
    isMD5sLoaded,
    setMD5s,
    clearMD5s,

    onMD5Loading,
    onMD5Creating,
    isMD5Created,
    onMD5Saving,
    isMD5Saved,
    onMD5Deleting,
    isMD5Deleted,
    setMD5,
    clearMD5,

    setMD5sErrorMessage,
    clearMD5sErrorMessage,
} = md5sSlice.actions;

export default md5sSlice;