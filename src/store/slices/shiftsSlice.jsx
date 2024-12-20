import { createSlice } from "@reduxjs/toolkit";

export const shiftsSlice = createSlice({
    name: 'shiftsSlice',
    initialState: {
        // Collection
        isShiftsLoading: false,
        shifts: [],
        shiftsMeta: null,
        // Element
        isShiftLoading: false,
        isShiftCreating: false,
        shiftCreatedOk: false,
        isShiftSaving: false,
        shiftSavedOk: false,
        isShiftDeleting: false,
        shiftDeletedOk: false,
        shift: null,

        shiftsErrorMessage: null,
    },
    reducers: {
        // Collection
        onShiftsLoading: (state) => {
            state.isShiftsLoading = true;
        },
        isShiftsLoaded: (state) => {
            state.isShiftsLoading = false;
        },
        setShifts: (state, action) => {
            state.isShiftsLoading = false;
            state.shifts = action.payload.shifts;
            state.shiftsMeta = action.payload.shiftsMeta;
        },
        clearShifts: (state) => {
            state.isShiftsLoading = false;
            state.shifts = [];
            state.shiftsMeta = null;
        },
        // Element
        onShiftLoading: (state) => {
            state.isShiftLoading = true;
            state.shift = null;
        },
        onShiftCreating: (state) => {
            state.isShiftCreating = true;
            state.shiftCreatedOk = false;
            state.shift = null;
        },
        isShiftCreated: (state) => {
            state.isShiftCreating = false;
            state.shiftCreatedOk = true;
        },
        onShiftSaving: (state) => {
            state.isShiftSaving = true;
            state.shiftSavedOk = false;
        },
        isShiftSaved: (state) => {
            state.isShiftSaving = false;
            state.shiftSavedOk = true;
        },
        onShiftDeleting: (state) => {
            state.isShiftDeleting = true;
            state.shiftDeletedOk = false;
        },
        isShiftDeleted: (state) => {
            state.isShiftDeleting = false;
            state.shiftDeletedOk = true;
        },
        setShift: (state, action) => {
            state.isShiftLoading = false;
            state.isShiftCreating = false;
            state.shiftCreatedOk = false;
            state.isShiftSaving = false;
            state.shiftSavedOk = false;
            state.isShiftDeleting = false;
            state.shiftDeletedOk = false;
            state.shift = action.payload;
        },
        clearShift: (state) => {
            state.isShiftLoading = false;
            state.isShiftCreating = false;
            state.shiftCreatedOk = false;
            state.isShiftSaving = false;
            state.shiftSavedOk = false;
            state.isShiftDeleting = false;
            state.shiftDeletedOk = false;
            state.shift = null;
        },
        // Misc
        setShiftsErrorMessage: (state, action) => {
            state.isShiftsLoading = false;
            state.isShiftLoading = false;
            state.isShiftCreating = false;
            state.shiftCreatedOk = false;
            state.isShiftSaving = false;
            state.shiftSavedOk = false;
            state.isShiftDeleting = false;
            state.shiftDeletedOk = false;
            state.shiftsErrorMessage = action.payload;
        },
        clearShiftsErrorMessage: (state) => {
            state.shiftsErrorMessage = null;
        }
    }
});

export const {
    onShiftsLoading,
    isShiftsLoaded,
    setShifts,
    clearShifts,

    onShiftLoading,
    onShiftCreating,
    isShiftCreated,
    onShiftSaving,
    isShiftSaved,
    onShiftDeleting,
    isShiftDeleted,
    setShift,
    clearShift,

    setShiftsErrorMessage,
    clearShiftsErrorMessage
} = shiftsSlice.actions;

export default shiftsSlice;