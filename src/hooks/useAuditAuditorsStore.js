import { useDispatch, useSelector } from "react-redux";

import {
    onAuditAuditorsLoading,
    setAuditAuditors,

    onAuditAuditorLoading,
    setAuditAuditor,
    clearAuditAuditors,

    onAuditAuditorCreating,
    isAuditAuditorCreated,
    onAuditAuditorSaving,
    isAuditAuditorSaved,
    onAuditAuditorDeleting,
    isAuditAuditorDeleted,

    setAuditAuditorsErrorMessage,
    clearAuditAuditorsErrorMessage,
    clearAuditAuditor,
} from "../store/slices/auditAuditorsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITAUDITOR_URL = '/auditAuditors';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.auditID ? `&auditid=${options.auditID}` : '';
    query += options?.isLeader ? `&isleader=${options.isLeader}` : '';
    query += options?.isWitness ? `&iswitness=${options.isWitness}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditAuditorsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditAuditorsLoading,
        auditAuditors,
        auditAuditorsMeta,

        isAuditAuditorLoading,
        isAuditAuditorCreating,
        auditAuditorCreatedOk,
        isAuditAuditorSaving,
        auditAuditorSavedOk,
        isAuditAuditorDeleting,
        auditAuditorDeletedOk,
        auditAuditor,

        auditAuditorsErrorMessage
    } = useSelector(state => state.auditAuditors)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setAuditAuditorsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditAuditorsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearAuditAuditorsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {AuditID, IsLeader, IsWitness, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditAuditorsAsync = async (options = {}) => {
        dispatch(onAuditAuditorsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITAUDITOR_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditAuditors({
                auditAuditors: Data,
                auditAuditorsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditAuditorsClear = () => {
        dispatch(clearAuditAuditors());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditAuditorAsync = async (id) => {
        dispatch(onAuditAuditorLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITAUDITOR_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setAuditAuditor(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {AuditID} identificador de la auditoria asociada al ciclo de auditoria
     */
    const auditAuditorCreateAsync = async (item) => {
        dispatch(onAuditAuditorCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITAUDITOR_URL, params);
            const { Data } = await resp.data;

            dispatch(setAuditAuditor(Data));
            dispatch(isAuditAuditorCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, AuditorID, IsLeader, IsWitness, Comments, Status, UpdatedUser} item Objeto tipo AuditAuditor
     */
    const auditAuditorSaveAsync = async (item) => {
        dispatch(onAuditAuditorSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${AUDITAUDITOR_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setAuditAuditor(Data));
            dispatch(isAuditAuditorSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditAuditorDeleteAsync = async (id) => {
        dispatch(onAuditAuditorDeleting());

        const toDelete = {
            AuditAuditorID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${AUDITAUDITOR_URL}/${id}`, { data: toDelete });
            dispatch(isAuditAuditorDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const auditAuditorClear = () => {
        dispatch(clearAuditAuditor());
    }

    return {
        // properties
        isAuditAuditorsLoading,
        auditAuditors,
        auditAuditorsMeta,

        isAuditAuditorLoading,
        isAuditAuditorCreating,
        auditAuditorCreatedOk,
        isAuditAuditorSaving,
        auditAuditorSavedOk,
        isAuditAuditorDeleting,
        auditAuditorDeletedOk,
        auditAuditor,

        auditAuditorsErrorMessage,

        // methods
        auditAuditorsAsync,
        auditAuditorsClear,
        
        auditAuditorAsync,
        auditAuditorCreateAsync,
        auditAuditorSaveAsync,
        auditAuditorDeleteAsync,
        auditAuditorClear,
    }
};
