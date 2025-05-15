import { useDispatch, useSelector } from "react-redux";

import {
    onUsersLoading,
    setUsers,

    onUserLoading,
    setUser,
    clearUsers,

    onUserCreating,
    isUserCreated,
    onUserSaving,
    isUserSaved,
    onUserDeleting,
    isUserDeleted,

    setUsersErrorMessage,
    clearUsersErrorMessage,
    clearUser,
} from "../store/slices/usersSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const USER_URL = '/users';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.ownerID ? `&ownerid=${options.ownerID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.type ? `&type=${options.type}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
}; // getSearchQuery

export const useUsersStore = () => {
    const dispatch = useDispatch();
    const {
        isUsersLoading,
        users,
        usersMeta,

        isUserLoading,
        isUserCreating,
        userCreatedOk,
        isUserSaving,
        userSavedOk,
        isUserDeleting,
        userDeletedOk,
        user,

        usersErrorMessage
    } = useSelector(state => state.users)

    const { user: userAuth } = useSelector(state => state.auth)

    // Methods

    const setError = (value) => {    
            if (isString(value)) {
                dispatch(setUsersErrorMessage(value));    
            } else if (isString(value.message)) {
                dispatch(setUsersErrorMessage(value.message));
            } else {
                console.error('Unknow error data: ', value);
                return null;
            }            
            setTimeout(() => {
                dispatch(clearUsersErrorMessage());
            }, 10);
        }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, DocumentType, SubCategory, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const usersAsync = async (options = {}) => {
        dispatch(onUsersLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${USER_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setUsers({
                users: Data,
                usersMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // usersAsync

    const usersClear = () => {
        dispatch(clearUsers());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const userAsync = async (id) => {
        dispatch(onUserLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${USER_URL}/${id}`);
            const { Data } = await resp.data;

            dispatch(setUser(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // userAsync

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {Text} identificador de la organizacion asociada al usero
     */
    const userCreateAsync = async () => {
        dispatch(onUserCreating());

        try {
            const params = {
                UpdatedUser: userAuth.username,
            };
            const resp = await cortanaApi.post(USER_URL, params);
            const { Data } = await resp.data;

            dispatch(setUser(Data));
            dispatch(isUserCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // userCreateAsync

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, OwnerID, Username, Password, Email, FirstName, LastName, Type, Status } item Objeto tipo User
     */
    const userSaveAsync = async (item) => {
        dispatch(onUserSaving());

        const toSave = {
            ...item,
            UpdatedUser: userAuth.username,
        }
        try {
            const resp = await cortanaApi.put(`${USER_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setUser(Data));
            dispatch(isUserSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // userSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const userDeleteAsync = async (id) => {
        dispatch(onUserDeleting());

        const toDelete = {
            UserID: id,
            UpdatedUser: userAuth.username,
        }

        try {
            await cortanaApi.delete(`${USER_URL}/${id}`, { data: toDelete });
            dispatch(isUserDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    } // userDeleteAsync

    const userClear = () => {
        dispatch(clearUser());
    } // userClear

    // ROLES

    const userRoleAddAsync = async (roleID) => {
        
        if (!user) {
            setError('The user must be loaded first');
            return;
        }

        const toAdd = {
            ID: user.ID,
            RoleID: roleID,
        };

        try {
            const resp = await cortanaApi.post(`${USER_URL}/${user.ID}/role`, toAdd);
            const { Data } = await resp.data;

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // userRoleAddAsync

    const userRoleDeleteAsync = async (roleID) => {
        
        if (!user) {
            setError('The user must be loaded first');
            return;
        }

        const toDelete = {
            ID: user.ID,
            RoleID: roleID,
        }

        try {
            const resp = await cortanaApi.delete(`${USER_URL}/${user.ID}/role`, { data: toDelete });
            const { Data } = await resp.data;

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    };
        
    return {
        // properties
        isUsersLoading,
        users,
        usersMeta,

        isUserLoading,
        isUserCreating,
        userCreatedOk,
        isUserSaving,
        userSavedOk,
        isUserDeleting,
        userDeletedOk,
        user,

        usersErrorMessage,

        // methods
        usersAsync,
        usersClear,
        
        userAsync,
        userCreateAsync,
        userSaveAsync,
        userDeleteAsync,
        userClear,
        // - roles
        userRoleAddAsync,
        userRoleDeleteAsync,
    }
};
