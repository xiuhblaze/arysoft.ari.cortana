//* Aqui va el slice para abrir de forma global los modales como Audit, AppForm y ADC, etc.
//? Aun veo complejo su uso, creo que lo wa dejar por aquí pero no le veo tanta utilidad 
//? para lo que necesito llamar

import { createSlice } from "@reduxjs/toolkit";

export const modalsSlice = createSlice({
    name: "modals",
    initialState: {
        isOpen: false,
        type: "",
        data: {},
    },
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
            state.type = action.payload.type;
            state.data = action.payload.data;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.type = "";
            state.data = {};
        },
    },
});

export const {
    openModal,
    closeModal
} = modalsSlice.actions;

export default modalsSlice;