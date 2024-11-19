import { createSlice } from "@reduxjs/toolkit";

export const contactsSlice = createSlice({
  name: 'contactsSlice',
  initialState: {
    // Collection
    isContactsLoading: false,
    contacts: [],
    contactsMeta: null,    
    // Element
    isContactLoading: false,
    isContactCreating: false,
    contactCreatedOk: false,
    isContactSaving: false,
    contactSavedOk: false,
    isContactDeleting: false,
    contactDeletedOk: false,
    contact: null,

    contactErrorMessage: null,
  },
  reducers: {
    // Collection
    onContactsLoading: (state) => {
      state.isContactsLoading = true;
    },
    isContactsLoaded: (state) => {
      state.isContactsLoading = false;
    },
    setContacts: (state, action) => {
      state.isContactsLoading = false;
      state.contacts = action.payload.contacts;
      state.contactsMeta = action.payload.contactsMeta;
    },
    clearContacts: (state) => {
      state.isContactsLoading = false;
      state.contacts = [];
      state.contactsMeta = null;
    },
    // Element
    onContactLoading: (state) => {
      state.isContactLoading = true;
      state.contact = null;
    },
    onContactCreating: (state) => {
      state.isContactCreating = true;
      state.contactCreatedOk = false;
      state.contact = null;
    },
    isContactCreated: (state) => {
      state.isContactCreating = false;
      state.contactCreatedOk = true;
    },
    onContactSaving: (state) => {
      state.isContactSaving = true;
      state.contactSavedOk = false;
    },
    isContactSaved: (state) => {
      state.isContactSaving = false;
      state.contactSavedOk = true;
    },
    onContactDeleting: (state) => {
      state.isContactDeleting = true;
      state.contactDeletedOk = false;
    },
    isContactDeleted: (state) => {
      state.isContactDeleting = false;
      state.contactDeletedOk = true;
    },
    setContact: (state, action) => {
      state.isContactLoading = false;
      state.isContactCreating = false;
      state.contactCreatedOk = false;
      state.isContactSaving = false;
      state.contactSavedOk = false;
      state.isContactDeleting = false;
      state.contactDeletedOk = false;
      state.contact = action.payload;
    },
    clearContact: (state) => {
      state.isContactLoading = false;
      state.isContactCreating = false;
      state.contactCreatedOk = false;
      state.isContactSaving = false;
      state.contactSavedOk = false;
      state.isContactDeleting = false;
      state.contactDeletedOk = false;
      state.contact = null;
    },
    // Misc
    setContactsErrorMessage: (state, action) => {
      state.isContactsLoading = false;
      state.isContactLoading = false;
      state.isContactCreating = false;
      state.contactCreatedOk = false;
      state.isContactSaving = false;
      state.contactSavedOk = false;
      state.isContactDeleting = false;
      state.contactDeletedOk = false;
      state.contactErrorMessage = action.payload;
    },
    clearContactsErrorMessage: (state) => {
      state.contactErrorMessage = null;
    }
  }
});

export const {
  onContactsLoading,
  isContactsLoaded,
  setContacts,
  clearContacts,

  onContactLoading,
  onContactCreating,
  isContactCreated,
  onContactSaving,
  isContactSaved,
  onContactDeleting,
  isContactDeleted,
  setContact,
  clearContact,

  setContactsErrorMessage,  
  clearContactsErrorMessage,
} = contactsSlice.actions;

export default contactsSlice;