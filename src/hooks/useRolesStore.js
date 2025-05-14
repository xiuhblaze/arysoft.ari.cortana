import { useDispatch, useSelector } from "react-redux";

import cortanaApi from "../api/cortanaApi";

import {
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
} from "../store/slices/rolesSlice";

// import enums from "../helpers/enums";
import envVariables from "../helpers/envVariables";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const ROLES_URI = '/roles';
const { VITE_PAGE_SIZE } = envVariables();

const getSearhQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';

    return query;
};

export const useRolesStore = () => {
    const dispatch = useDispatch();
    const {
        isRolesLoading,
        roles,
        rolesMeta,

        isRoleLoading,
        isRoleCreating,
        roleCreatedOk,
        isRoleSaving,
        roleSavedOk,
        isRoleDeleting,
        roleDeletedOk,
        role,

        roleErrorMessage,
    } = useSelector(state => state.roles);
    const { user } = useSelector(state => state.auth);
    // const { DefaultStatusType } = enums();

    // METHODS

    const setError = (value) => {    
            if (isString(value)) {
                dispatch(setRolesErrorMessage(value));    
            } else if (isString(value.message)) {
                dispatch(setRolesErrorMessage(value.message));
            } else {
                console.error('Unknow error data: ', value);
                return null;
            }            
            setTimeout(() => {
                dispatch(setRolesErrorMessage(null));
            }, 10);
        }; // setError

    //* Export Methods

    /**
     * Llama al endpoint que obtiene un listado de roles de acuerdo
     * a los filtros enviados
     * @param {
     *   text: string,
     *   status: [nothing, active, inactive, deleted], order: [nothing, name, updated, nameDesc, updatedDesc]} options valores por los cuales filtrar los roles 
     * @returns void - guarda en el store un listado de roles obtenidos
     */
    const rolesAsync = async (options = {}) => {
        dispatch(onRolesLoading());

        const query = getSearhQuery(options);

        try {
            const resp = await cortanaApi.get(`${ROLES_URI}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setRoles({
                roles: Data,
                rolesMeta: Meta,
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para obtener un registro por medio del ID
     * @param {Guid} id Identificador del registro a consultar
     * @returns void - se carga en el Store
     */
    const roleAsync = async (id) => {
        dispatch(onRoleLoading());

        if (!id) { setError('You must specify the ID'); return; }

        try {
            const resp = await cortanaApi.get(`${ROLES_URI}/${id}`);
            const { Data } = await resp.data;

            dispatch(setRole(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para crear un registro vacio en la BDD para ser
     * llenado, devuelve el registro en el Store
     */
    const roleCreateAsync = async () => {
        dispatch(onRoleCreating());

        const emptyRole = {
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.post(`${ROLES_URI}`, emptyRole);
            const { Data } = await resp.data;

            dispatch(setRole(Data));
            dispatch(isRoleCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar los datos de un registro, si es uno nuevo
     * lo marca con su primer estado
     * @param {ID, Name, Description, Status, UpdatedUser} item role a actualizar en la BDD
     */
    const roleSaveAsync = async (item) => {
        dispatch(onRoleSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.put(`${ROLES_URI}/${item.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setRole(Data));
            dispatch(isRoleSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para eliminar el registro indicado por el ID
     * @param {Guid} id Identificador del registro a eliminar
     */
    const roleDeleteAsync = async (id) => {
        dispatch(onRoleDeleting());

        const toDelete = {
            ID: id,
            UpdatedUser: user.username,
        }

        try {
            await cortanaApi.delete(`${ROLES_URI}/${id}`, { data: toDelete });
            dispatch(isRoleDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const roleClear = () => {
        dispatch(setRole(null));
    };

    return {
        //* Properties
        // Collection
        isRolesLoading,
        roles,
        rolesMeta,
        // Element
        isRoleLoading,
        isRoleCreating,
        roleCreatedOk,
        isRoleSaving,
        roleSavedOk,
        isRoleDeleting,
        roleDeletedOk,
        role,
        // Error
        roleErrorMessage,

        //* Methods
        rolesAsync,
        roleAsync,
        roleCreateAsync,
        roleSaveAsync,
        roleDeleteAsync,
        roleClear,
    };
};

export default useRolesStore;