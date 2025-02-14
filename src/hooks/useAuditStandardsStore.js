import { useDispatch, useSelector } from "react-redux";

import {
    onAuditStandardsLoading,
    setAuditStandards,

    onAuditStandardLoading,
    setAuditStandard,
    clearAuditStandards,

    onAuditStandardCreating,
    isAuditStandardCreated,
    onAuditStandardSaving,
    isAuditStandardSaved,
    onAuditStandardDeleting,
    isAuditStandardDeleted,

    setAuditStandardsErrorMessage,
    clearAuditStandardsErrorMessage,
    clearAuditStandard,
} from "../store/slices/auditStandardsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITSTANDARD_URL = '/auditStandards';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.auditID ? `&auditid=${options.auditID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.step ? `&step=${options.step}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditStandardsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditStandardsLoading,
        auditStandards,
        auditStandardsMeta,

        isAuditStandardLoading,
        isAuditStandardCreating,
        auditStandardCreatedOk,
        isAuditStandardSaving,
        auditStandardSavedOk,
        isAuditStandardDeleting,
        auditStandardDeletedOk,
        auditStandard,

        auditStandardsErrorMessage
    } = useSelector(state => state.auditStandards)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setAuditStandardsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditStandardsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearAuditStandardsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {AuditID, StandardID, Step, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditStandardsAsync = async (options = {}) => {
        dispatch(onAuditStandardsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITSTANDARD_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditStandards({
                auditStandards: Data,
                auditStandardsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditStandardsClear = () => {
        dispatch(clearAuditStandards());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditStandardAsync = async (id) => {
        dispatch(onAuditStandardLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITSTANDARD_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setAuditStandard(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {AuditID} identificador de la organizacion asociada a la compañia
     */
    const auditStandardCreateAsync = async (item) => {
        dispatch(onAuditStandardCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITSTANDARD_URL, params);
            const { Data } = await resp.data;

            dispatch(setAuditStandard(Data));
            dispatch(isAuditStandardCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, StandardID, Step, ExtraInfo, Status, UpdatedUser} item Objeto tipo AuditStandard
     */
    const auditStandardSaveAsync = async (item) => {
        dispatch(onAuditStandardSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${AUDITSTANDARD_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setAuditStandard(Data));
            dispatch(isAuditStandardSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditStandardDeleteAsync = async (id) => {
        dispatch(onAuditStandardDeleting());

        const toDelete = {
            AuditStandardID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${AUDITSTANDARD_URL}/${id}`, { data: toDelete });
            dispatch(isAuditStandardDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const auditStandardClear = () => {
        dispatch(clearAuditStandard());
    }

    return {
        // properties
        isAuditStandardsLoading,
        auditStandards,
        auditStandardsMeta,

        isAuditStandardLoading,
        isAuditStandardCreating,
        auditStandardCreatedOk,
        isAuditStandardSaving,
        auditStandardSavedOk,
        isAuditStandardDeleting,
        auditStandardDeletedOk,
        auditStandard,

        auditStandardsErrorMessage,

        // methods
        auditStandardsAsync,
        auditStandardsClear,
        
        auditStandardAsync,
        auditStandardCreateAsync,
        auditStandardSaveAsync,
        auditStandardDeleteAsync,
        auditStandardClear,
    }
};
