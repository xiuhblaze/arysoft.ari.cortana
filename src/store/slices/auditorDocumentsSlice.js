import { createSlice } from "@reduxjs/toolkit";

export const auditorDocumentsSlice = createSlice({
    name: 'auditorDocumentsSlice',
    initialState: {
        // Collection
        isAuditorDocumentsLoading: false,
        auditorDocuments: [],
        auditorDocumentsMeta: null,
        // Element
        isAuditorDocumentLoading: false,
        isAuditorDocumentCreating: false,
        auditorDocumentCreatedOk: false,
        isAuditorDocumentSaving: false,
        auditorDocumentSavedOk: false,
        isAuditorDocumentDeleting: false,
        auditorDocumentDeletedOk: false,
        auditorDocument: null,

        auditorDocumentsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditorDocumentsLoading: (state) => {
            state.isAuditorDocumentsLoading = true;
        },
        isAuditorDocumentsLoaded: (state) => {
            state.isAuditorDocumentsLoading = false;
        },
        setAuditorDocuments: (state, action) => {
            state.isAuditorDocumentsLoading = false;
            state.auditorDocuments = action.payload.auditorDocuments;
            state.auditorDocumentsMeta = action.payload.auditorDocumentsMeta;
        },
        clearAuditorDocuments: (state) => {
            state.isAuditorDocumentsLoading = false;
            state.auditorDocuments = [];
            state.auditorDocumentsMeta = null;
        },
        // Element
        onAuditorDocumentLoading: (state) => {
            state.isAuditorDocumentLoading = true;
            state.auditorDocument = null;
        },
        onAuditorDocumentCreating: (state) => {
            state.isAuditorDocumentCreating = true;
            state.auditorDocumentCreatedOk = false;
            state.auditorDocument = null;
        },
        isAuditorDocumentCreated: (state) => {
            state.isAuditorDocumentCreating = false;
            state.auditorDocumentCreatedOk = true;
        },
        onAuditorDocumentSaving: (state) => {
            state.isAuditorDocumentSaving = true;
            state.auditorDocumentSavedOk = false;
        },
        isAuditorDocumentSaved: (state) => {
            state.isAuditorDocumentSaving = false;
            state.auditorDocumentSavedOk = true;
        },
        onAuditorDocumentDeleting: (state) => {
            state.isAuditorDocumentDeleting = true;
            state.auditorDocumentDeletedOk = false;
        },
        isAuditorDocumentDeleted: (state) => {
            state.isAuditorDocumentDeleting = false;
            state.auditorDocumentDeletedOk = true;
        },
        setAuditorDocument: (state, action) => {
            state.isAuditorDocumentLoading = false;
            state.isAuditorDocumentCreating = false;
            state.auditorDocumentCreatedOk = false;
            state.isAuditorDocumentSaving = false;
            state.auditorDocumentSavedOk = false;
            state.isAuditorDocumentDeleting = false;
            state.auditorDocumentDeletedOk = false;
            state.auditorDocument = action.payload;
        },
        clearAuditorDocument: (state) => {
            state.isAuditorDocumentLoading = false;
            state.isAuditorDocumentCreating = false;
            state.auditorDocumentCreatedOk = false;
            state.isAuditorDocumentSaving = false;
            state.auditorDocumentSavedOk = false;
            state.isAuditorDocumentDeleting = false;
            state.auditorDocumentDeletedOk = false;
            state.auditorDocument = null;
        },
        // Misc
        setAuditorDocumentsErrorMessage: (state, action) => {
            state.isAuditorDocumentsLoading = false;
            state.isAuditorDocumentLoading = false;
            state.isAuditorDocumentCreating = false;
            state.auditorDocumentCreatedOk = false;
            state.isAuditorDocumentSaving = false;
            state.auditorDocumentSavedOk = false;
            state.isAuditorDocumentDeleting = false;
            state.auditorDocumentDeletedOk = false;
            state.auditorDocumentsErrorMessage = action.payload;
        },
        clearAuditorDocumentsErrorMessage: (state) => {
            state.auditorDocumentsErrorMessage = null;
        }
    }
});

export const {
    onAuditorDocumentsLoading,
    isAuditorDocumentsLoaded,
    setAuditorDocuments,
    clearAuditorDocuments,

    onAuditorDocumentLoading,
    onAuditorDocumentCreating,
    isAuditorDocumentCreated,
    onAuditorDocumentSaving,
    isAuditorDocumentSaved,
    onAuditorDocumentDeleting,
    isAuditorDocumentDeleted,
    setAuditorDocument,
    clearAuditorDocument,

    setAuditorDocumentsErrorMessage,
    clearAuditorDocumentsErrorMessage,
} = auditorDocumentsSlice.actions;

export default auditorDocumentsSlice;