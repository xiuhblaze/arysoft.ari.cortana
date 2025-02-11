import { createSlice } from "@reduxjs/toolkit";

export const companiesSlice = createSlice({
    name: 'companiesSlice',
    initialState: {
        // Collection
        isCompaniesLoading: false,
        companies: [],
        companiesMeta: null,
        // Element
        isCompanyLoading: false,
        isCompanyCreating: false,
        companyCreatedOk: false,
        isCompanySaving: false,
        companySavedOk: false,
        isCompanyDeleting: false,
        companyDeletedOk: false,
        company: null,

        companiesErrorMessage: null,
    },
    reducers: {
        // Collection
        onCompaniesLoading: (state) => {
            state.isCompaniesLoading = true;
        },
        isCompaniesLoaded: (state) => {
            state.isCompaniesLoading = false;
        },
        setCompanies: (state, action) => {
            state.isCompaniesLoading = false;
            state.companies = action.payload.companies;
            state.companiesMeta = action.payload.companiesMeta;
        },
        clearCompanies: (state) => {
            state.isCompaniesLoading = false;
            state.companies = [];
            state.companiesMeta = null;
        },
        // Element
        onCompanyLoading: (state) => {
            state.isCompanyLoading = true;
            state.company = null;
        },
        onCompanyCreating: (state) => {
            state.isCompanyCreating = true;
            state.companyCreatedOk = false;
            state.company = null;
        },
        isCompanyCreated: (state) => {
            state.isCompanyCreating = false;
            state.companyCreatedOk = true;
        },
        onCompanySaving: (state) => {
            state.isCompanySaving = true;
            state.companySavedOk = false;
        },
        isCompanySaved: (state) => {
            state.isCompanySaving = false;
            state.companySavedOk = true;
        },
        onCompanyDeleting: (state) => {
            state.isCompanyDeleting = true;
            state.companyDeletedOk = false;
        },
        isCompanyDeleted: (state) => {
            state.isCompanyDeleting = false;
            state.companyDeletedOk = true;
        },
        setCompany: (state, action) => {
            state.isCompanyLoading = false;
            state.isCompanyCreating = false;
            state.companyCreatedOk = false;
            state.isCompanySaving = false;
            state.companySavedOk = false;
            state.isCompanyDeleting = false;
            state.companyDeletedOk = false;
            state.company = action.payload;
        },
        clearCompany: (state) => {
            state.isCompanyLoading = false;
            state.isCompanyCreating = false;
            state.companyCreatedOk = false;
            state.isCompanySaving = false;
            state.companySavedOk = false;
            state.isCompanyDeleting = false;
            state.companyDeletedOk = false;
            state.company = null;
        },
        // Misc
        setCompaniesErrorMessage: (state, action) => {
            state.isCompaniesLoading = false;
            state.isCompanyLoading = false;
            state.isCompanyCreating = false;
            state.companyCreatedOk = false;
            state.isCompanySaving = false;
            state.companySavedOk = false;
            state.isCompanyDeleting = false;
            state.companyDeletedOk = false;
            state.companiesErrorMessage = action.payload;
        },
        clearCompaniesErrorMessage: (state) => {
            state.companiesErrorMessage = null;
        }
    }
});

export const {
    onCompaniesLoading,
    isCompaniesLoaded,
    setCompanies,
    clearCompanies,

    onCompanyLoading,
    onCompanyCreating,
    isCompanyCreated,
    onCompanySaving,
    isCompanySaved,
    onCompanyDeleting,
    isCompanyDeleted,
    setCompany,
    clearCompany,

    setCompaniesErrorMessage,
    clearCompaniesErrorMessage,
} = companiesSlice.actions;

export default companiesSlice;