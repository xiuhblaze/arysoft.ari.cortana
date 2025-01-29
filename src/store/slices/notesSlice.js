import { createSlice } from "@reduxjs/toolkit";

export const notesSlice = createSlice({
    name: 'notesSlice',
    initialState: {
        // Collection
        isNotesLoading: false,
        notes: [],
        notesMeta: null,
        // Element
        isNoteLoading: false,
        isNoteCreating: false,
        noteCreatedOk: false,
        isNoteSaving: false,
        noteSavedOk: false,
        isNoteDeleting: false,
        noteDeletedOk: false,
        note: null,

        notesErrorMessage: null,
    },
    reducers: {
        // Collection
        onNotesLoading: (state) => {
            state.isNotesLoading = true;
        },
        isNotesLoaded: (state) => {
            state.isNotesLoading = false;
        },
        setNotes: (state, action) => {
            state.isNotesLoading = false;
            state.notes = action.payload.notes;
            state.notesMeta = action.payload.notesMeta;
        },
        clearNotes: (state) => {
            state.isNotesLoading = false;
            state.notes = [];
            state.notesMeta = null;
        },
        // Element
        onNoteLoading: (state) => {
            state.isNoteLoading = true;
            state.note = null;
        },
        onNoteCreating: (state) => {
            state.isNoteCreating = true;
            state.noteCreatedOk = false;
            state.note = null;
        },
        isNoteCreated: (state) => {
            state.isNoteCreating = false;
            state.noteCreatedOk = true;
        },
        onNoteSaving: (state) => {
            state.isNoteSaving = true;
            state.noteSavedOk = false;
        },
        isNoteSaved: (state) => {
            state.isNoteSaving = false;
            state.noteSavedOk = true;
        },
        onNoteDeleting: (state) => {
            state.isNoteDeleting = true;
            state.noteDeletedOk = false;
        },
        isNoteDeleted: (state) => {
            state.isNoteDeleting = false;
            state.noteDeletedOk = true;
        },
        setNote: (state, action) => {
            state.isNoteLoading = false;
            state.isNoteCreating = false;
            state.noteCreatedOk = false;
            state.isNoteSaving = false;
            state.noteSavedOk = false;
            state.isNoteDeleting = false;
            state.noteDeletedOk = false;
            state.note = action.payload;
        },
        clearNote: (state) => {
            state.isNoteLoading = false;
            state.isNoteCreating = false;
            state.noteCreatedOk = false;
            state.isNoteSaving = false;
            state.noteSavedOk = false;
            state.isNoteDeleting = false;
            state.noteDeletedOk = false;
            state.note = null;
        },
        // Misc
        setNotesErrorMessage: (state, action) => {
            state.isNotesLoading = false;
            state.isNoteLoading = false;
            state.isNoteCreating = false;
            state.noteCreatedOk = false;
            state.isNoteSaving = false;
            state.noteSavedOk = false;
            state.isNoteDeleting = false;
            state.noteDeletedOk = false;
            state.notesErrorMessage = action.payload;
        },
        clearNotesErrorMessage: (state) => {
            state.notesErrorMessage = null;
        }
    }
});

export const {
    onNotesLoading,
    isNotesLoaded,
    setNotes,
    clearNotes,

    onNoteLoading,
    onNoteCreating,
    isNoteCreated,
    onNoteSaving,
    isNoteSaved,
    onNoteDeleting,
    isNoteDeleted,
    setNote,
    clearNote,

    setNotesErrorMessage,
    clearNotesErrorMessage,
} = notesSlice.actions;

export default notesSlice;