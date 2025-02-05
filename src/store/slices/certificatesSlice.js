import { createSlice } from "@reduxjs/toolkit";

export const certificatesSlice = createSlice({
    name: 'certificatesSlice',
    initialState: {
        // Collection
        isCertificatesLoading: false,
        certificates: [],
        certificatesMeta: null,
        // Element
        isCertificateLoading: false,
        isCertificateCreating: false,
        certificateCreatedOk: false,
        isCertificateSaving: false,
        certificateSavedOk: false,
        isCertificateDeleting: false,
        certificateDeletedOk: false,
        certificate: null,

        certificatesErrorMessage: null,
    },
    reducers: {
        // Collection
        onCertificatesLoading: (state) => {
            state.isCertificatesLoading = true;
        },
        isCertificatesLoaded: (state) => {
            state.isCertificatesLoading = false;
        },
        setCertificates: (state, action) => {
            state.isCertificatesLoading = false;
            state.certificates = action.payload.certificates;
            state.certificatesMeta = action.payload.certificatesMeta;
        },
        clearCertificates: (state) => {
            state.isCertificatesLoading = false;
            state.certificates = [];
            state.certificatesMeta = null;
        },
        // Element
        onCertificateLoading: (state) => {
            state.isCertificateLoading = true;
            state.certificate = null;
        },
        onCertificateCreating: (state) => {
            state.isCertificateCreating = true;
            state.certificateCreatedOk = false;
            state.certificate = null;
        },
        isCertificateCreated: (state) => {
            state.isCertificateCreating = false;
            state.certificateCreatedOk = true;
        },
        onCertificateSaving: (state) => {
            state.isCertificateSaving = true;
            state.certificateSavedOk = false;
        },
        isCertificateSaved: (state) => {
            state.isCertificateSaving = false;
            state.certificateSavedOk = true;
        },
        onCertificateDeleting: (state) => {
            state.isCertificateDeleting = true;
            state.certificateDeletedOk = false;
        },
        isCertificateDeleted: (state) => {
            state.isCertificateDeleting = false;
            state.certificateDeletedOk = true;
        },
        setCertificate: (state, action) => {
            state.isCertificateLoading = false;
            state.isCertificateCreating = false;
            state.certificateCreatedOk = false;
            state.isCertificateSaving = false;
            state.certificateSavedOk = false;
            state.isCertificateDeleting = false;
            state.certificateDeletedOk = false;
            state.certificate = action.payload;
        },
        clearCertificate: (state) => {
            state.isCertificateLoading = false;
            state.isCertificateCreating = false;
            state.certificateCreatedOk = false;
            state.isCertificateSaving = false;
            state.certificateSavedOk = false;
            state.isCertificateDeleting = false;
            state.certificateDeletedOk = false;
            state.certificate = null;
        },
        // Misc
        setCertificatesErrorMessage: (state, action) => {
            state.isCertificatesLoading = false;
            state.isCertificateLoading = false;
            state.isCertificateCreating = false;
            state.certificateCreatedOk = false;
            state.isCertificateSaving = false;
            state.certificateSavedOk = false;
            state.isCertificateDeleting = false;
            state.certificateDeletedOk = false;
            state.certificatesErrorMessage = action.payload;
        },
        clearCertificatesErrorMessage: (state) => {
            state.certificatesErrorMessage = null;
        }
    }
});

export const {
    onCertificatesLoading,
    isCertificatesLoaded,
    setCertificates,
    clearCertificates,

    onCertificateLoading,
    onCertificateCreating,
    isCertificateCreated,
    onCertificateSaving,
    isCertificateSaved,
    onCertificateDeleting,
    isCertificateDeleted,
    setCertificate,
    clearCertificate,

    setCertificatesErrorMessage,
    clearCertificatesErrorMessage,
} = certificatesSlice.actions;

export default certificatesSlice;