import { createSlice } from "@reduxjs/toolkit";

export const catAuditorDocumentsSlice = createSlice({
    name: 'catAuditorDocumentsSlice',
    initialState: {
        // Collection
        isCatAuditorDocumentsLoading: false,
        catAuditorDocuments: [],
        catAuditorDocumentsMeta: null,
        // Element
        isCatAuditorDocumentLoading: false,
        isCatAuditorDocumentCreating: false,
        catAuditorDocumentCreatedOk: false,
        isCatAuditorDocumentSaving: false,
        catAuditorDocumentSavedOk: false,
        isCatAuditorDocumentDeleting: false,
        catAuditorDocumentDeletedOk: false,
        catAuditorDocument: null,

        catAuditorDocumentErrorMessage: null,
    },
    reducers: {
        // Collection
        onCatAuditorDocumentsLoading: (state) => {
            state.isCatAuditorDocumentsLoading = true;
        },
        isCatAuditorDocumentsLoaded: (state) => {
            state.isCatAuditorDocumentsLoading = false;
        },
        setCatAuditorDocuments: (state, action) => {
            state.isCatAuditorDocumentsLoading = false;
            state.catAuditorDocuments = action.payload.catAuditorDocuments;
            state.catAuditorDocumentsMeta = action.payload.catAuditorDocumentsMeta;
        },
        clearCatAuditorDocuments: (state) => {
            state.isCatAuditorDocumentsLoading = false;
            state.catAuditorDocuments = [];
            state.catAuditorDocumentsMeta = null;
        },
        // Element
        onCatAuditorDocumentLoading: (state) => {
            state.isCatAuditorDocumentLoading = true;
            state.catAuditorDocument = null;
        },
        onCatAuditorDocumentCreating: (state) => {
            state.isCatAuditorDocumentCreating = true;
            state.catAuditorDocumentCreatedOk = false;
            state.catAuditorDocument = null;
        },
        isCatAuditorDocumentCreated: (state) => {
            state.isCatAuditorDocumentCreating = false;
            state.catAuditorDocumentCreatedOk = true;
        },
        onCatAuditorDocumentSaving: (state) => {
            state.isCatAuditorDocumentSaving = true;
            state.catAuditorDocumentSavedOk = false;
        },
        isCatAuditorDocumentSaved: (state) => {
            state.isCatAuditorDocumentSaving = false;
            state.catAuditorDocumentSavedOk = true;
        },
        onCatAuditorDocumentDeleting: (state) => {
            state.isCatAuditorDocumentDeleting = true;
            state.catAuditorDocumentDeletedOk = false;
        },
        isCatAuditorDocumentDeleted: (state) => {
            state.isCatAuditorDocumentDeleting = false;
            state.catAuditorDocumentDeletedOk = true;
        },
        setCatAuditorDocument: (state, action) => {
            state.isCatAuditorDocumentLoading = false;
            state.isCatAuditorDocumentCreating = false;
            state.catAuditorDocumentCreatedOk = false;
            state.isCatAuditorDocumentSaving = false;
            state.catAuditorDocumentSavedOk = false;
            state.isCatAuditorDocumentDeleting = false;
            state.catAuditorDocumentDeletedOk = false;
            state.catAuditorDocument = action.payload;
        },
        clearCatAuditorDocument: (state) => {
            state.isCatAuditorDocumentLoading = false;
            state.isCatAuditorDocumentCreating = false;
            state.catAuditorDocumentCreatedOk = false;
            state.isCatAuditorDocumentSaving = false;
            state.catAuditorDocumentSavedOk = false;
            state.isCatAuditorDocumentDeleting = false;
            state.catAuditorDocumentDeletedOk = false;
            state.catAuditorDocument = null;
        },
        // Misc
        setCatAuditorDocumentsErrorMessage: (state, action) => {
            state.isCatAuditorDocumentsLoading = false;
            state.isCatAuditorDocumentLoading = false;
            state.isCatAuditorDocumentCreating = false;
            state.catAuditorDocumentCreatedOk = false;
            state.isCatAuditorDocumentSaving = false;
            state.catAuditorDocumentSavedOk = false;
            state.isCatAuditorDocumentDeleting = false;
            state.catAuditorDocumentDeletedOk = false;
            state.catAuditorDocumentErrorMessage = action.payload;
        },
        clearCatAuditorDocumentsErrorMessage: (state) => {
            state.catAuditorDocumentErrorMessage = null;
        }
    }
});

export const {
    onCatAuditorDocumentsLoading,
    isCatAuditorDocumentsLoaded,
    setCatAuditorDocuments,
    clearCatAuditorDocuments,

    onCatAuditorDocumentLoading,
    onCatAuditorDocumentCreating,
    isCatAuditorDocumentCreated,
    onCatAuditorDocumentSaving,
    isCatAuditorDocumentSaved,
    onCatAuditorDocumentDeleting,
    isCatAuditorDocumentDeleted,
    setCatAuditorDocument,
    clearCatAuditorDocument,

    setCatAuditorDocumentsErrorMessage,
    clearCatAuditorDocumentsErrorMessage,
} = catAuditorDocumentsSlice.actions;

export default catAuditorDocumentsSlice;