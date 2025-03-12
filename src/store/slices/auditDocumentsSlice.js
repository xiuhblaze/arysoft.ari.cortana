import { createSlice } from "@reduxjs/toolkit";

export const auditDocumentsSlice = createSlice({
    name: 'auditDocumentsSlice',
    initialState: {
        // Collection
        isAuditDocumentsLoading: false,
        auditDocuments: [],
        auditDocumentsMeta: null,
        // Element
        isAuditDocumentLoading: false,
        isAuditDocumentCreating: false,
        auditDocumentCreatedOk: false,
        isAuditDocumentSaving: false,
        auditDocumentSavedOk: false,
        isAuditDocumentDeleting: false,
        auditDocumentDeletedOk: false,
        auditDocument: null,

        auditDocumentsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditDocumentsLoading: (state) => {
            state.isAuditDocumentsLoading = true;
        },
        isAuditDocumentsLoaded: (state) => {
            state.isAuditDocumentsLoading = false;
        },
        setAuditDocuments: (state, action) => {
            state.isAuditDocumentsLoading = false;
            state.auditDocuments = action.payload.auditDocuments;
            state.auditDocumentsMeta = action.payload.auditDocumentsMeta;
        },
        clearAuditDocuments: (state) => {
            state.isAuditDocumentsLoading = false;
            state.auditDocuments = [];
            state.auditDocumentsMeta = null;
        },
        // Element
        onAuditDocumentLoading: (state) => {
            state.isAuditDocumentLoading = true;
            state.auditDocument = null;
        },
        onAuditDocumentCreating: (state) => {
            state.isAuditDocumentCreating = true;
            state.auditDocumentCreatedOk = false;
            state.auditDocument = null;
        },
        isAuditDocumentCreated: (state) => {
            state.isAuditDocumentCreating = false;
            state.auditDocumentCreatedOk = true;
        },
        onAuditDocumentSaving: (state) => {
            state.isAuditDocumentSaving = true;
            state.auditDocumentSavedOk = false;
        },
        isAuditDocumentSaved: (state) => {
            state.isAuditDocumentSaving = false;
            state.auditDocumentSavedOk = true;
        },
        onAuditDocumentDeleting: (state) => {
            state.isAuditDocumentDeleting = true;
            state.auditDocumentDeletedOk = false;
        },
        isAuditDocumentDeleted: (state) => {
            state.isAuditDocumentDeleting = false;
            state.auditDocumentDeletedOk = true;
        },
        setAuditDocument: (state, action) => {
            state.isAuditDocumentLoading = false;
            state.isAuditDocumentCreating = false;
            state.auditDocumentCreatedOk = false;
            state.isAuditDocumentSaving = false;
            state.auditDocumentSavedOk = false;
            state.isAuditDocumentDeleting = false;
            state.auditDocumentDeletedOk = false;
            state.auditDocument = action.payload;
        },
        clearAuditDocument: (state) => {
            state.isAuditDocumentLoading = false;
            state.isAuditDocumentCreating = false;
            state.auditDocumentCreatedOk = false;
            state.isAuditDocumentSaving = false;
            state.auditDocumentSavedOk = false;
            state.isAuditDocumentDeleting = false;
            state.auditDocumentDeletedOk = false;
            state.auditDocument = null;
        },
        // Misc
        setAuditDocumentsErrorMessage: (state, action) => {
            state.isAuditDocumentsLoading = false;
            state.isAuditDocumentLoading = false;
            state.isAuditDocumentCreating = false;
            state.auditDocumentCreatedOk = false;
            state.isAuditDocumentSaving = false;
            state.auditDocumentSavedOk = false;
            state.isAuditDocumentDeleting = false;
            state.auditDocumentDeletedOk = false;
            state.auditDocumentsErrorMessage = action.payload;
        },
        clearAuditDocumentsErrorMessage: (state) => {
            state.auditDocumentsErrorMessage = null;
        }
    }
});

export const {
    onAuditDocumentsLoading,
    isAuditDocumentsLoaded,
    setAuditDocuments,
    clearAuditDocuments,

    onAuditDocumentLoading,
    onAuditDocumentCreating,
    isAuditDocumentCreated,
    onAuditDocumentSaving,
    isAuditDocumentSaved,
    onAuditDocumentDeleting,
    isAuditDocumentDeleted,
    setAuditDocument,
    clearAuditDocument,

    setAuditDocumentsErrorMessage,
    clearAuditDocumentsErrorMessage,
} = auditDocumentsSlice.actions;

export default auditDocumentsSlice;