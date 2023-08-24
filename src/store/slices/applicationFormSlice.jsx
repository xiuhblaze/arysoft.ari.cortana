import { createSlice } from "@reduxjs/toolkit";

export const applicationFormSlice = createSlice({
  name: "applicationForm",
  initialState: {
    isSending: false, // Cuando se está enviando el formulario
    status: null, // empty, new, send, confirm, approved, rejected, error
    step: null, // organizationStep, contactStep, userStep, confirmStep
    userData: {},
    organizationData: {},
    contactData: {},
    ISOData: {},
    sitesData: [],
    errorMessage: undefined,
  },
  reducers: {
    onCreate: (state) => { // Cuando un usuario inicia su registro
      state.status = "new";
      state.step = "organizationStep";
    },
    onSaveStep: (state, action) => {  // Guardar los datos antes en un paso
      switch (action.payload.step) {
        case "organizationStep": state.organizationData = action.payload.data; break;
        case "contactStep": state.contactData = action.payload.data; break;
        // Aquí faltan pasos
        case "userStep": state.userData = action.payload.data; break;
      }
    },
    setCurrentStep: (state, action) => { // Cambiar de paso actual
      state.step = action.payload;
    },
    onSendAppForm: (state) => {
      state.isSending = true;
    },
    setSendingAppForm: (state) => { // Indica que se envió el formulario y cambia el estatus a enviado
      state.isSending = false;
      state.status = 'send';
    },
    setErrorMessage: (state, action) => { // Mostrar mensaje de error
      state.status = "error";
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => { // Limpiar mensaje de error
      state.errorMessage = undefined;
    },
    setStatus: (state, action) => { // Cambiar el estatus del ApplicationForm
      state.status = action.payload;
    }
  }
});

export const { 
  onCreate, 
  setCurrentStep,
  onSaveStep,
  onSendAppForm,
  setSendingAppForm,
  setErrorMessage,
  clearErrorMessage,
  setStatus
} = applicationFormSlice.actions;

export default applicationFormSlice;