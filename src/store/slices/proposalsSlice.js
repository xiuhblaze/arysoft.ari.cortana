import { createSlice } from "@reduxjs/toolkit";

export const proposalsSlice = createSlice({
    name: 'proposalsSlice',
    initialState: {
        // Collection
        isProposalsLoading: false,
        proposals: [],
        proposalsMeta: null,
        // Element
        isProposalLoading: false,
        isProposalCreating: false,
        proposalCreatedOk: false,
        isProposalSaving: false,
        proposalSavedOk: false,
        isProposalDeleting: false,
        proposalDeletedOk: false,
        proposal: null,

        proposalsErrorMessage: null,
    },
    reducers: {
        // Collection
        onProposalsLoading: (state) => {
            state.isProposalsLoading = true;
        },
        isProposalsLoaded: (state) => {
            state.isProposalsLoading = false;
        },
        setProposals: (state, action) => {
            state.isProposalsLoading = false;
            state.proposals = action.payload.proposals;
            state.proposalsMeta = action.payload.proposalsMeta;
        },
        clearProposals: (state) => {
            state.isProposalsLoading = false;
            state.proposals = [];
            state.proposalsMeta = null;
        },
        // Element
        onProposalLoading: (state) => {
            state.isProposalLoading = true;
            state.proposal = null;
        },
        onProposalCreating: (state) => {
            state.isProposalCreating = true;
            state.proposalCreatedOk = false;
            state.proposal = null;
        },
        isProposalCreated: (state) => {
            state.isProposalCreating = false;
            state.proposalCreatedOk = true;
        },
        onProposalSaving: (state) => {
            state.isProposalSaving = true;
            state.proposalSavedOk = false;
        },
        isProposalSaved: (state) => {
            state.isProposalSaving = false;
            state.proposalSavedOk = true;
        },
        onProposalDeleting: (state) => {
            state.isProposalDeleting = true;
            state.proposalDeletedOk = false;
        },
        isProposalDeleted: (state) => {
            state.isProposalDeleting = false;
            state.proposalDeletedOk = true;
        },
        setProposal: (state, action) => {
            state.isProposalLoading = false;
            state.isProposalCreating = false;
            state.proposalCreatedOk = false;
            state.isProposalSaving = false;
            state.proposalSavedOk = false;
            state.isProposalDeleting = false;
            state.proposalDeletedOk = false;
            state.proposal = action.payload;
        },
        clearProposal: (state) => {
            state.isProposalLoading = false;
            state.isProposalCreating = false;
            state.proposalCreatedOk = false;
            state.isProposalSaving = false;
            state.proposalSavedOk = false;
            state.isProposalDeleting = false;
            state.proposalDeletedOk = false;
            state.proposal = null;
        },
        // Misc
        setProposalsErrorMessage: (state, action) => {
            state.isProposalsLoading = false;
            state.isProposalLoading = false;
            state.isProposalCreating = false;
            state.proposalCreatedOk = false;
            state.isProposalSaving = false;
            state.proposalSavedOk = false;
            state.isProposalDeleting = false;
            state.proposalDeletedOk = false;
            state.proposalsErrorMessage = action.payload;
        },
        clearProposalsErrorMessage: (state) => {
            state.proposalsErrorMessage = null;
        }
    }
});

export const {
    onProposalsLoading,
    isProposalsLoaded,
    setProposals,
    clearProposals,

    onProposalLoading,
    onProposalCreating,
    isProposalCreated,
    onProposalSaving,
    isProposalSaved,
    onProposalDeleting,
    isProposalDeleted,
    setProposal,
    clearProposal,

    setProposalsErrorMessage,
    clearProposalsErrorMessage,
} = proposalsSlice.actions;

export default proposalsSlice; 