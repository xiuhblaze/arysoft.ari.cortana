import { useDispatch, useSelector } from "react-redux";

import {
    onAuditCycleStandardsLoading,
    setAuditCycleStandards,

    onAuditCycleStandardLoading,
    setAuditCycleStandard,
    clearAuditCycleStandards,

    onAuditCycleStandardCreating,
    isAuditCycleStandardCreated,
    onAuditCycleStandardSaving,
    isAuditCycleStandardSaved,
    onAuditCycleStandardDeleting,
    isAuditCycleStandardDeleted,

    setAuditCycleStandardsErrorMessage,
    clearAuditCycleStandardsErrorMessage,
    clearAuditCycleStandard,
} from "../store/slices/auditCycleStandardsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITCYCLESTANDARD_URL = '/auditcyclestandards';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.auditCycleID ? `&auditcycleid=${options.auditCycleID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.initialStep ? `&initialstep=${options.initialStep}` : '';
    query += options?.cycleType ? `&cycletype=${options.cycleType}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditCycleStandardsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditCycleStandardsLoading,
        auditCycleStandards,
        auditCycleStandardsMeta,

        isAuditCycleStandardLoading,
        isAuditCycleStandardCreating,
        auditCycleStandardCreatedOk,
        isAuditCycleStandardSaving,
        auditCycleStandardSavedOk,
        isAuditCycleStandardDeleting,
        auditCycleStandardDeletedOk,
        auditCycleStandard,

        auditCycleStandardsErrorMessage
    } = useSelector(state => state.auditCycleStandards)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setAuditCycleStandardsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditCycleStandardsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearAuditCycleStandardsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {AuditCycleID, StandardID, InitialStep, CycleType, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditCycleStandardsAsync = async (options = {}) => {
        dispatch(onAuditCycleStandardsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITCYCLESTANDARD_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditCycleStandards({
                auditCycleStandards: Data,
                auditCycleStandardsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditCycleStandardsClear = () => {
        dispatch(clearAuditCycleStandards());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditCycleStandardAsync = async (id) => {
        dispatch(onAuditCycleStandardLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITCYCLESTANDARD_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setAuditCycleStandard(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada a la compañia
     */
    const auditCycleStandardCreateAsync = async (item) => {
        dispatch(onAuditCycleStandardCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITCYCLESTANDARD_URL, params);
            const { Data } = await resp.data;

            dispatch(setAuditCycleStandard(Data));
            dispatch(isAuditCycleStandardCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, LegalEntity, COID, Status, UpdatedUser} item Objeto tipo AuditCycleStandard
     */
    const auditCycleStandardSaveAsync = async (item) => {
        dispatch(onAuditCycleStandardSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${AUDITCYCLESTANDARD_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setAuditCycleStandard(Data));
            dispatch(isAuditCycleStandardSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditCycleStandardDeleteAsync = async (id) => {
        dispatch(onAuditCycleStandardDeleting());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        const toDelete = {
            ID: id,
            UpdatedUser: user.username,
        }

        try {
            await cortanaApi.delete(`${AUDITCYCLESTANDARD_URL}/${id}`, { data: toDelete });
            //const resp = await cortanaApi.delete(`${AUDITCYCLESTANDARD_URL}/${id}`, { data: toDelete });
            //console.log(resp);
            dispatch(isAuditCycleStandardDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // auditCycleStandardDeleteAsync

    const auditCycleStandardClear = () => {
        dispatch(clearAuditCycleStandard());
    }; // auditCycleStandardClear

    return {
        // properties
        isAuditCycleStandardsLoading,
        auditCycleStandards,
        auditCycleStandardsMeta,

        isAuditCycleStandardLoading,
        isAuditCycleStandardCreating,
        auditCycleStandardCreatedOk,
        isAuditCycleStandardSaving,
        auditCycleStandardSavedOk,
        isAuditCycleStandardDeleting,
        auditCycleStandardDeletedOk,
        auditCycleStandard,

        auditCycleStandardsErrorMessage,

        // methods
        auditCycleStandardsAsync,
        auditCycleStandardsClear,
        
        auditCycleStandardAsync,
        auditCycleStandardCreateAsync,
        auditCycleStandardSaveAsync,
        auditCycleStandardDeleteAsync,
        auditCycleStandardClear,
    }
};
