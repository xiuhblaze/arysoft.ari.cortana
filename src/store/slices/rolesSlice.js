import { createSlice } from "@reduxjs/toolkit";

export const rolesSlice = createSlice({
  name: 'rolesSlice',
  initialState: {
    // Collection
    isRolesLoading: false,
    roles: [],
    rolesMeta: null,    
    // Element
    isRoleLoading: false,
    isRoleCreating: false,
    roleCreatedOk: false,
    isRoleSaving: false,
    roleSavedOk: false,
    isRoleDeleting: false,
    roleDeletedOk: false,
    role: null,

    roleErrorMessage: null,
  },
  reducers: {
    // Collection
    onRolesLoading: (state) => {
      state.isRolesLoading = true;
    },
    setRoles: (state, action) => {
      state.isRolesLoading = false;
      state.roles = action.payload.roles;
      state.rolesMeta = action.payload.rolesMeta;
    },

    // Element
    onRoleLoading: (state) => {
      state.isRoleLoading = true;
      state.role = null;
    },
    setRole: (state, action) => {
      state.isRoleLoading = false;
      state.isRoleCreating = false;
      state.roleCreatedOk = false;
      state.isRoleSaving = false;
      state.roleSavedOk = false;
      state.isRoleDeleting = false;
      state.roleDeletedOk = false;
      state.role = action.payload;
    },
    // element - creating
    onRoleCreating: (state) => {
      state.isRoleCreating = true;
      state.roleCreatedOk = false;
      state.role = null;      
    },
    isRoleCreated: (state) => {
      state.isRoleCreating = false;
      state.roleCreatedOk = true;
    },
    // element - saving
    onRoleSaving: (state) => {
      state.isRoleSaving = true;
      state.roleSavedOk = false;
    },
    isRoleSaved: (state) => {
      state.isRoleSaving = false;
      state.roleSavedOk = true;
    },
    // element - deleting
    onRoleDeleting: (state) => {
      state.isRoleDeleting = true;
      state.roleDeletedOk = false;
    },
    isRoleDeleted: (state) => {
      state.isRoleDeleting = false;
      state.roleDeletedOk = true;
    },
    
    // Misc
    setRolesErrorMessage: (state, action) => {
      state.isRolesLoading = false;
      state.isRoleLoading = false;
      state.isRoleCreating = false;
      state.roleCreatedOk = false;
      state.isRoleSaving = false;
      state.roleSavedOk = false;
      state.isRoleDeleting = false;
      state.roleDeletedOk = false;
      state.roleErrorMessage = action.payload;
    }
  }
});

export const {
  onRolesLoading,
  setRoles,

  onRoleLoading,
  onRoleCreating,
  isRoleCreated,
  onRoleSaving,
  isRoleSaved,
  onRoleDeleting,
  isRoleDeleted,
  setRole,

  setRolesErrorMessage,  
} = rolesSlice.actions;

export default rolesSlice;
