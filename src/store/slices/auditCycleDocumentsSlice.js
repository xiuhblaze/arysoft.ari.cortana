import { createSlice } from "@reduxjs/toolkit";

export const auditCycleDocumentsSlice = createSlice({
    name: 'auditCycleDocumentsSlice',
    initialState: {
        // Collection
        isAuditCycleDocumentsLoading: false,
        auditCycleDocuments: [],
        auditCycleDocumentsMeta: null,
        // Element
        isAuditCycleDocumentLoading: false,
        isAuditCycleDocumentCreating: false,
        auditCycleDocumentCreatedOk: false,
        isAuditCycleDocumentSaving: false,
        auditCycleDocumentSavedOk: false,
        isAuditCycleDocumentDeleting: false,
        auditCycleDocumentDeletedOk: false,
        auditCycleDocument: null,

        auditCycleDocumentsErrorMessage: null,
    },
    reducers: {
        // Collection
        onAuditCycleDocumentsLoading: (state) => {
            state.isAuditCycleDocumentsLoading = true;
        },
        isAuditCycleDocumentsLoaded: (state) => {
            state.isAuditCycleDocumentsLoading = false;
        },
        setAuditCycleDocuments: (state, action) => {
            state.isAuditCycleDocumentsLoading = false;
            state.auditCycleDocuments = action.payload.auditCycleDocuments;
            state.auditCycleDocumentsMeta = action.payload.auditCycleDocumentsMeta;
        },
        clearAuditCycleDocuments: (state) => {
            state.isAuditCycleDocumentsLoading = false;
            state.auditCycleDocuments = [];
            state.auditCycleDocumentsMeta = null;
        },
        // Element
        onAuditCycleDocumentLoading: (state) => {
            state.isAuditCycleDocumentLoading = true;
            state.auditCycleDocument = null;
        },
        onAuditCycleDocumentCreating: (state) => {
            state.isAuditCycleDocumentCreating = true;
            state.auditCycleDocumentCreatedOk = false;
            state.auditCycleDocument = null;
        },
        isAuditCycleDocumentCreated: (state) => {
            state.isAuditCycleDocumentCreating = false;
            state.auditCycleDocumentCreatedOk = true;
        },
        onAuditCycleDocumentSaving: (state) => {
            state.isAuditCycleDocumentSaving = true;
            state.auditCycleDocumentSavedOk = false;
        },
        isAuditCycleDocumentSaved: (state) => {
            state.isAuditCycleDocumentSaving = false;
            state.auditCycleDocumentSavedOk = true;
        },
        onAuditCycleDocumentDeleting: (state) => {
            state.isAuditCycleDocumentDeleting = true;
            state.auditCycleDocumentDeletedOk = false;
        },
        isAuditCycleDocumentDeleted: (state) => {
            state.isAuditCycleDocumentDeleting = false;
            state.auditCycleDocumentDeletedOk = true;
        },
        setAuditCycleDocument: (state, action) => {
            state.isAuditCycleDocumentLoading = false;
            state.isAuditCycleDocumentCreating = false;
            state.auditCycleDocumentCreatedOk = false;
            state.isAuditCycleDocumentSaving = false;
            state.auditCycleDocumentSavedOk = false;
            state.isAuditCycleDocumentDeleting = false;
            state.auditCycleDocumentDeletedOk = false;
            state.auditCycleDocument = action.payload;
        },
        clearAuditCycleDocument: (state) => {
            state.isAuditCycleDocumentLoading = false;
            state.isAuditCycleDocumentCreating = false;
            state.auditCycleDocumentCreatedOk = false;
            state.isAuditCycleDocumentSaving = false;
            state.auditCycleDocumentSavedOk = false;
            state.isAuditCycleDocumentDeleting = false;
            state.auditCycleDocumentDeletedOk = false;
            state.auditCycleDocument = null;
        },
        // Misc
        setAuditCycleDocumentsErrorMessage: (state, action) => {
            state.isAuditCycleDocumentsLoading = false;
            state.isAuditCycleDocumentLoading = false;
            state.isAuditCycleDocumentCreating = false;
            state.auditCycleDocumentCreatedOk = false;
            state.isAuditCycleDocumentSaving = false;
            state.auditCycleDocumentSavedOk = false;
            state.isAuditCycleDocumentDeleting = false;
            state.auditCycleDocumentDeletedOk = false;
            state.auditCycleDocumentsErrorMessage = action.payload;
        },
        clearAuditCycleDocumentsErrorMessage: (state) => {
            state.auditCycleDocumentsErrorMessage = null;
        }
    }
});

export const {
    onAuditCycleDocumentsLoading,
    isAuditCycleDocumentsLoaded,
    setAuditCycleDocuments,
    clearAuditCycleDocuments,

    onAuditCycleDocumentLoading,
    onAuditCycleDocumentCreating,
    isAuditCycleDocumentCreated,
    onAuditCycleDocumentSaving,
    isAuditCycleDocumentSaved,
    onAuditCycleDocumentDeleting,
    isAuditCycleDocumentDeleted,
    setAuditCycleDocument,
    clearAuditCycleDocument,

    setAuditCycleDocumentsErrorMessage,
    clearAuditCycleDocumentsErrorMessage,
} = auditCycleDocumentsSlice.actions;

export default auditCycleDocumentsSlice;