import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name: 'usersSlice',
    initialState: {
        // Collection
        isUsersLoading: false,
        users: [],
        usersMeta: null,
        // Element
        isUserLoading: false,
        isUserCreating: false,
        userCreatedOk: false,
        isUserSaving: false,
        userSavedOk: false,
        isUserDeleting: false,
        userDeletedOk: false,
        user: null,

        usersErrorMessage: null,
    },
    reducers: {
        // Collection
        onUsersLoading: (state) => {
            state.isUsersLoading = true;
        },
        isUsersLoaded: (state) => {
            state.isUsersLoading = false;
        },
        setUsers: (state, action) => {
            state.isUsersLoading = false;
            state.users = action.payload.users;
            state.usersMeta = action.payload.usersMeta;
        },
        clearUsers: (state) => {
            state.isUsersLoading = false;
            state.users = [];
            state.usersMeta = null;
        },
        // Element
        onUserLoading: (state) => {
            state.isUserLoading = true;
            state.user = null;
        },
        onUserCreating: (state) => {
            state.isUserCreating = true;
            state.userCreatedOk = false;
            state.user = null;
        },
        isUserCreated: (state) => {
            state.isUserCreating = false;
            state.userCreatedOk = true;
        },
        onUserSaving: (state) => {
            state.isUserSaving = true;
            state.userSavedOk = false;
        },
        isUserSaved: (state) => {
            state.isUserSaving = false;
            state.userSavedOk = true;
        },
        onUserDeleting: (state) => {
            state.isUserDeleting = true;
            state.userDeletedOk = false;
        },
        isUserDeleted: (state) => {
            state.isUserDeleting = false;
            state.userDeletedOk = true;
        },
        setUser: (state, action) => {
            state.isUserLoading = false;
            state.isUserCreating = false;
            state.userCreatedOk = false;
            state.isUserSaving = false;
            state.userSavedOk = false;
            state.isUserDeleting = false;
            state.userDeletedOk = false;
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.isUserLoading = false;
            state.isUserCreating = false;
            state.userCreatedOk = false;
            state.isUserSaving = false;
            state.userSavedOk = false;
            state.isUserDeleting = false;
            state.userDeletedOk = false;
            state.user = null;
        },
        // Misc
        setUsersErrorMessage: (state, action) => {
            state.isUsersLoading = false;
            state.isUserLoading = false;
            state.isUserCreating = false;
            state.userCreatedOk = false;
            state.isUserSaving = false;
            state.userSavedOk = false;
            state.isUserDeleting = false;
            state.userDeletedOk = false;
            state.usersErrorMessage = action.payload;
        },
        clearUsersErrorMessage: (state) => {
            state.usersErrorMessage = null;
        }
    }
});

export const {
    onUsersLoading,
    isUsersLoaded,
    setUsers,
    clearUsers,

    onUserLoading,
    onUserCreating,
    isUserCreated,
    onUserSaving,
    isUserSaved,
    onUserDeleting,
    isUserDeleted,
    setUser,
    clearUser,

    setUsersErrorMessage,
    clearUsersErrorMessage,
} = usersSlice.actions;

export default usersSlice;