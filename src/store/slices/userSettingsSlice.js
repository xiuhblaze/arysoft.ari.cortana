import { createSlice } from "@reduxjs/toolkit";

export const userSettingsSlice = createSlice({
    name: 'userSettingsSlice',
    initialState: {
        // Collection
        isUserSettingsLoading: false,
        userSettings: [],
        userSettingsMeta: null,
        // Element
        isUserSettingLoading: false,
        isUserSettingCreating: false,
        userSettingCreatedOk: false,
        isUserSettingSaving: false,
        userSettingSavedOk: false,
        isUserSettingDeleting: false,
        userSettingDeletedOk: false,
        userSetting: null,

        userSettingsErrorMessage: null,
    },
    reducers: {
        // Collection
        onUserSettingsLoading: (state) => {
            state.isUserSettingsLoading = true;
        },
        isUserSettingsLoaded: (state) => {
            state.isUserSettingsLoading = false;
        },
        setUserSettings: (state, action) => {
            state.isUserSettingsLoading = false;
            state.userSettings = action.payload.userSettings;
            state.userSettingsMeta = action.payload.userSettingsMeta;
        },
        clearUserSettings: (state) => {
            state.isUserSettingsLoading = false;
            state.userSettings = [];
            state.userSettingsMeta = null;
        },
        // Element
        onUserSettingLoading: (state) => {
            state.isUserSettingLoading = true;
            state.userSetting = null;
        },
        onUserSettingCreating: (state) => {
            state.isUserSettingCreating = true;
            state.userSettingCreatedOk = false;
            state.userSetting = null;
        },
        isUserSettingCreated: (state) => {
            state.isUserSettingCreating = false;
            state.userSettingCreatedOk = true;
        },
        onUserSettingSaving: (state) => {
            state.isUserSettingSaving = true;
            state.userSettingSavedOk = false;
        },
        isUserSettingSaved: (state) => {
            state.isUserSettingSaving = false;
            state.userSettingSavedOk = true;
        },
        onUserSettingDeleting: (state) => {
            state.isUserSettingDeleting = true;
            state.userSettingDeletedOk = false;
        },
        isUserSettingDeleted: (state) => {
            state.isUserSettingDeleting = false;
            state.userSettingDeletedOk = true;
        },
        setUserSetting: (state, action) => {
            state.isUserSettingLoading = false;
            state.isUserSettingCreating = false;
            state.userSettingCreatedOk = false;
            state.isUserSettingSaving = false;
            state.userSettingSavedOk = false;
            state.isUserSettingDeleting = false;
            state.userSettingDeletedOk = false;
            state.userSetting = action.payload;
        },
        clearUserSetting: (state) => {
            state.isUserSettingLoading = false;
            state.isUserSettingCreating = false;
            state.userSettingCreatedOk = false;
            state.isUserSettingSaving = false;
            state.userSettingSavedOk = false;
            state.isUserSettingDeleting = false;
            state.userSettingDeletedOk = false;
            state.userSetting = null;
        },
        // Misc
        setUserSettingsErrorMessage: (state, action) => {
            state.isUserSettingsLoading = false;
            state.isUserSettingLoading = false;
            state.isUserSettingCreating = false;
            state.userSettingCreatedOk = false;
            state.isUserSettingSaving = false;
            state.userSettingSavedOk = false;
            state.isUserSettingDeleting = false;
            state.userSettingDeletedOk = false;
            state.userSettingsErrorMessage = action.payload;
        },
        clearUserSettingsErrorMessage: (state) => {
            state.userSettingsErrorMessage = null;
        }
    }
});

export const {
    onUserSettingsLoading,
    isUserSettingsLoaded,
    setUserSettings,
    clearUserSettings,

    onUserSettingLoading,
    onUserSettingCreating,
    isUserSettingCreated,
    onUserSettingSaving,
    isUserSettingSaved,
    onUserSettingDeleting,
    isUserSettingDeleted,
    setUserSetting,
    clearUserSetting,

    setUserSettingsErrorMessage,
    clearUserSettingsErrorMessage,
} = userSettingsSlice.actions;

export default userSettingsSlice;