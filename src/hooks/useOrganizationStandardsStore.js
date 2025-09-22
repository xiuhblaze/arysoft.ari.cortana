import { useDispatch, useSelector } from "react-redux";

import {
    onOrganizationStandardsLoading,
    setOrganizationStandards,

    onOrganizationStandardLoading,
    setOrganizationStandard,
    clearOrganizationStandards,

    onOrganizationStandardCreating,
    isOrganizationStandardCreated,
    onOrganizationStandardSaving,
    isOrganizationStandardSaved,
    onOrganizationStandardDeleting,
    isOrganizationStandardDeleted,

    setOrganizationStandardsErrorMessage,
    clearOrganizationStandardsErrorMessage,
    clearOrganizationStandard,
} from "../store/slices/organizationStandardsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const ORGANIZATIONSTANDARDS_ROUTE = '/organizationstandards';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.organizationID ? `&organizationid=${options.organizationID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useOrganizationStandardsStore = () => {
    const dispatch = useDispatch();
    const {
        isOrganizationStandardsLoading,
        organizationStandards,
        organizationStandardsMeta,

        isOrganizationStandardLoading,
        isOrganizationStandardCreating,
        organizationStandardCreatedOk,
        isOrganizationStandardSaving,
        organizationStandardSavedOk,
        isOrganizationStandardDeleting,
        organizationStandardDeletedOk,
        organizationStandard,

        organizationStandardsErrorMessage
    } = useSelector(state => state.organizationStandards)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {

        if (isString(value)) {
            dispatch(setOrganizationStandardsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setOrganizationStandardsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearOrganizationStandardsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, OrganizationID, StandardID, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const organizationStandardsAsync = async (options = {}) => {        
        dispatch(onOrganizationStandardsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${ORGANIZATIONSTANDARDS_ROUTE}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setOrganizationStandards({
                organizationStandards: Data,
                organizationStandardsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const organizationStandardsClear = () => {
        dispatch(clearOrganizationStandards());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const organizationStandardAsync = async (id) => {
        // console.log('organizationStandardAsync', id);
        dispatch(onOrganizationStandardLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${ORGANIZATIONSTANDARDS_ROUTE}/${id}`);
            const { Data } = await resp.data;

            dispatch(setOrganizationStandard(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {AuditorID} identificador del auditor asociado al standard
     */
    const organizationStandardCreateAsync = async (item) => {
        dispatch(onOrganizationStandardCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(ORGANIZATIONSTANDARDS_ROUTE, params);
            const { Data } = await resp.data;

            dispatch(setOrganizationStandard(Data));
            dispatch(isOrganizationStandardCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * 
     * @param {organizationID, standardID, CRN, status} item Objeto que contiene los valores a registrar del Standard asociado al Auditor
     */
    const organizationStandardSaveAsync = async (item) => {
        dispatch(onOrganizationStandardSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.put(`${ORGANIZATIONSTANDARDS_ROUTE}/${item.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setOrganizationStandard(Data));
            dispatch(isOrganizationStandardSaved());

        } catch(error) {
            const infoError = getError(error);
            setError(infoError);
        }
    }; // organizationStandardSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const organizationStandardDeleteAsync = async (id) => {
        dispatch(onOrganizationStandardDeleting());

        const toDelete = {
            OrganizationStandardID: id,
            UpdatedUser: user.username,
        }

        try {            
            await cortanaApi.delete(`${ORGANIZATIONSTANDARDS_ROUTE}/${id}`, { data: toDelete });
            dispatch(isOrganizationStandardDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // organizationStandardDeleteAsync

    const organizationStandardClear = () => {
        dispatch(clearOrganizationStandard());
    }

    return {
        // properties
        isOrganizationStandardsLoading,
        organizationStandards,
        organizationStandardsMeta,

        isOrganizationStandardLoading,
        isOrganizationStandardCreating,
        organizationStandardCreatedOk,
        isOrganizationStandardSaving,
        organizationStandardSavedOk,
        isOrganizationStandardDeleting,
        organizationStandardDeletedOk,
        organizationStandard,

        organizationStandardsErrorMessage,

        // methods
        organizationStandardsAsync,
        organizationStandardsClear,
        
        organizationStandardAsync,
        organizationStandardCreateAsync,
        organizationStandardSaveAsync,
        organizationStandardDeleteAsync,
        organizationStandardClear,
    }
};
