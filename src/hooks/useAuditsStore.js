import { useDispatch, useSelector } from "react-redux";
import { formatISO } from "date-fns";

import {
    onAuditsLoading,
    setAudits,

    onAuditLoading,
    setAudit,
    clearAudits,

    onAuditCreating,
    isAuditCreated,
    onAuditSaving,
    isAuditSaved,
    onAuditDeleting,
    isAuditDeleted,

    setAuditsErrorMessage,
    clearAuditsErrorMessage,
    clearAudit,
} from "../store/slices/auditsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDIT_URL = '/audits';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.organizationID ? `&organizationid=${options.organizationID}` : '';
    query += options?.auditCycleID ? `&auditcycleid=${options.auditCycleID}` : '';
    query += options?.auditorID ? `&auditorid=${options.auditorID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.startDate ? `&startdate=${formatISO(new Date(options.startDate), { representation: 'date' })}` : ''; // options.startDate}` : '';
    query += options?.endDate ? `&enddate=${formatISO(new Date(options.endDate), { representation: 'date' })}` : ''; // options.endDate}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';

    return query;
};

export const useAuditsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditsLoading,
        audits,
        auditsMeta,

        isAuditLoading,
        isAuditCreating,
        auditCreatedOk,
        isAuditSaving,
        auditSavedOk,
        isAuditDeleting,
        auditDeletedOk,
        audit,

        auditsErrorMessage
    } = useSelector(state => state.audits)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setAuditsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearAuditsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {OrganizationID, AuditCycleID, AuditorID, StandardID, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditsAsync = async (options = {}) => {
        dispatch(onAuditsLoading());
        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDIT_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAudits({
                audits: Data,
                auditsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditsClear = () => {
        dispatch(clearAudits());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditAsync = async (id) => {
        dispatch(onAuditLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDIT_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setAudit(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {AuditCycleID} identificador del ciclo de auditorias asociada a la compañia
     */
    const auditCreateAsync = async (item) => {
        dispatch(onAuditCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDIT_URL, params);
            const { Data } = await resp.data;

            dispatch(setAudit(Data));
            dispatch(isAuditCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Description, StartDate, EndDate, Status, UpdatedUser} item Objeto tipo Audit
     */
    const auditSaveAsync = async (item) => {
        dispatch(onAuditSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${AUDIT_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setAudit(Data));
            dispatch(isAuditSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditDeleteAsync = async (id) => {
        dispatch(onAuditDeleting());

        const toDelete = {
            AuditID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${AUDIT_URL}/${id}`, { data: toDelete });
            dispatch(isAuditDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const auditClear = () => {
        dispatch(clearAudit());
    }

    return {
        // properties
        isAuditsLoading,
        audits,
        auditsMeta,

        isAuditLoading,
        isAuditCreating,
        auditCreatedOk,
        isAuditSaving,
        auditSavedOk,
        isAuditDeleting,
        auditDeletedOk,
        audit,

        auditsErrorMessage,

        // methods
        auditsAsync,
        auditsClear,
        
        auditAsync,
        auditCreateAsync,
        auditSaveAsync,
        auditDeleteAsync,
        auditClear,
    }
};
