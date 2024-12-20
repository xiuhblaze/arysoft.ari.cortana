import { useDispatch, useSelector } from "react-redux";
import { formatISO } from "date-fns";

import {
    onOrganizationsLoading,
    setOrganizations,

    onOrganizationLoading,
    setOrganization,
    onOrganizationsFullListLoading,
    setOrganizationsFullList,

    onOrganizationCreating,
    isOrganizationCreated,
    onOrganizationSaving,
    isOrganizationSaved,
    onOrganizationDeleting,
    isOrganizationDeleted,

    setOrganizationsErrorMessage,
} from "../store/slices/organizationsSlice";

import envVariables from "../helpers/envVariables";
import enums from "../helpers/enums";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includedeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useOrganizationsStore = () => {
    const dispatch = useDispatch();
    const {
        isOrganizationsLoading,
        organizations,
        organizationsMeta,
        isOrganizationsFullListLoading,
        organizationsFullList,

        isOrganizationLoading,
        isOrganizationCreating,
        organizationCreatedOk,
        isOrganizationSaving,
        organizationSavedOk,
        isOrganizationDeleting,
        organizationDeletedOk,
        organization,

        organizationsErrorMessage
    } = useSelector(state => state.organizations)

    const { user } = useSelector(state => state.auth);
    const {
        OrganizationStatusType,
        OrganizationsOrdenType
    } = enums();

    // Methods

    // const setError = (message) => {
    //     if (message.length === 0) return;
    //     dispatch(setOrganizationsErrorMessage(message));
    //     setTimeout(() => {
    //         dispatch(setOrganizationsErrorMessage(null));
    //     }, 10);
    // };
    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setOrganizationsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setOrganizationsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(setOrganizationsErrorMessage(null));
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const organizationsAsync = async (options = {}) => {
        dispatch(onOrganizationsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`/organizations${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setOrganizations({
                organizations: Data,
                organizationsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Obtiene un listado general de todas las áreas activas
     */
    const organizationsFullListAsync = async () => {
        dispatch(onOrganizationsFullListLoading());

        try {
            const query = getSearchQuery({
                pageSize: 0,
                estatus: OrganizationStatusType.active,
                orden: OrganizationsOrdenType.name,
            });

            const resp = await cortanaApi.get(`/organizations${query}`);
            const { Data } = await resp.data;

            dispatch(setOrganizationsFullList({ organizations: Data, }));
        } catch (error) {
            dispatch(setOrganizationsFullList({ organizations: [] }));
        }
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const organizationAsync = async (id) => {
        dispatch(onOrganizationLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`/organizations/${id}`);
            const { Data } = await resp.data;

            dispatch(setOrganization(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {string} username Nombre del usuario que realiza la creación del registro
     */
    const organizationCreateAsync = async () => {
        dispatch(onOrganizationCreating());

        try {
            const params = {
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post('/organizations', params);
            const { Data } = await resp.data;

            dispatch(setOrganization(Data));
            dispatch(isOrganizationCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {OrganizationID, Name, Description, Status, UpdatedUser} item Objeto tipo Organization
     */
    const organizationSaveAsync = async (item) => {
        dispatch(onOrganizationSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`/organizations/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setOrganization(Data));
            dispatch(isOrganizationSaved(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const organizationDeleteAsync = async (id) => {
        dispatch(onOrganizationDeleting());

        const toDelete = {
            OrganizationID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`/organizations/${id}`, { data: toDelete });
            dispatch(isOrganizationDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const organizationClear = () => {
        dispatch(setOrganization(null));
    }

    return {
        // properties
        isOrganizationsLoading,
        organizations,
        organizationsMeta,
        isOrganizationsFullListLoading,
        organizationsFullList,

        isOrganizationLoading,
        isOrganizationCreating,
        organizationCreatedOk,
        isOrganizationSaving,
        organizationSavedOk,
        isOrganizationDeleting,
        organizationDeletedOk,
        organization,

        organizationsErrorMessage,

        // methods
        organizationsAsync,
        organizationsFullListAsync,
        organizationAsync,
        organizationCreateAsync,
        organizationSaveAsync,
        organizationDeleteAsync,
        organizationClear,
    }
};
