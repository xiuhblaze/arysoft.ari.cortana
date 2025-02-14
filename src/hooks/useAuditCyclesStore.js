import { useDispatch, useSelector } from "react-redux";

import {
    onAuditCyclesLoading,
    setAuditCycles,

    onAuditCycleLoading,
    setAuditCycle,
    clearAuditCycles,

    onAuditCycleCreating,
    isAuditCycleCreated,
    onAuditCycleSaving,
    isAuditCycleSaved,
    onAuditCycleDeleting,
    isAuditCycleDeleted,

    setAuditCyclesErrorMessage,
    clearAuditCyclesErrorMessage,
    clearAuditCycle,
} from "../store/slices/auditCyclesSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITCYCLE_URL = '/auditCycles';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.organizationID ? `&organizationid=${options.organizationID}` : '';
    query += options?.startDate ? `&startdate=${options.startDate}` : '';
    query += options?.endDate ? `&enddate=${options.endDate}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditCyclesStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditCyclesLoading,
        auditCycles,
        auditCyclesMeta,

        isAuditCycleLoading,
        isAuditCycleCreating,
        auditCycleCreatedOk,
        isAuditCycleSaving,
        auditCycleSavedOk,
        isAuditCycleDeleting,
        auditCycleDeletedOk,
        auditCycle,

        auditCyclesErrorMessage
    } = useSelector(state => state.auditCycles)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setAuditCyclesErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditCyclesErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearAuditCyclesErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {OrganizationID, StartDate, EndDate, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditCyclesAsync = async (options = {}) => {
        dispatch(onAuditCyclesLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITCYCLE_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditCycles({
                auditCycles: Data,
                auditCyclesMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditCyclesClear = () => {
        dispatch(clearAuditCycles());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditCycleAsync = async (id) => {
        dispatch(onAuditCycleLoading());

        if (!id) {
            setError('Must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITCYCLE_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setAuditCycle(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada al ciclo de auditorias
     */
    const auditCycleCreateAsync = async (item) => {
        dispatch(onAuditCycleCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITCYCLE_URL, params);
            const { Data } = await resp.data;

            dispatch(setAuditCycle(Data));
            dispatch(isAuditCycleCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, LegalEntity, COID, Status, UpdatedUser} item Objeto tipo AuditCycle
     */
    const auditCycleSaveAsync = async (item) => {
        dispatch(onAuditCycleSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${AUDITCYCLE_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setAuditCycle(Data));
            dispatch(isAuditCycleSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditCycleDeleteAsync = async (id) => {
        dispatch(onAuditCycleDeleting());

        const toDelete = {
            AuditCycleID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${AUDITCYCLE_URL}/${id}`, { data: toDelete });
            dispatch(isAuditCycleDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const auditCycleClear = () => {
        dispatch(clearAuditCycle());
    }

    return {
        // properties
        isAuditCyclesLoading,
        auditCycles,
        auditCyclesMeta,

        isAuditCycleLoading,
        isAuditCycleCreating,
        auditCycleCreatedOk,
        isAuditCycleSaving,
        auditCycleSavedOk,
        isAuditCycleDeleting,
        auditCycleDeletedOk,
        auditCycle,

        auditCyclesErrorMessage,

        // methods
        auditCyclesAsync,
        auditCyclesClear,
        
        auditCycleAsync,
        auditCycleCreateAsync,
        auditCycleSaveAsync,
        auditCycleDeleteAsync,
        auditCycleClear,
    }
};
