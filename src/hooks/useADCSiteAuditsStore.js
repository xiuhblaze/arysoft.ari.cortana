import { useDispatch, useSelector } from "react-redux";

import {
    onADCSiteAuditsLoading,
    setADCSiteAudits,

    onADCSiteAuditLoading,
    setADCSiteAudit,
    clearADCSiteAudits,

    onADCSiteAuditCreating,
    isADCSiteAuditCreated,
    onADCSiteAuditSaving,
    isADCSiteAuditSaved,
    onADCSiteAuditDeleting,
    isADCSiteAuditDeleted,

    setADCSiteAuditsErrorMessage,
    clearADCSiteAuditsErrorMessage,
    clearADCSiteAudit,
} from "../store/slices/adcSiteAuditsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const ADC_SITE_AUDIT_URL = '/adcSiteAudits'; 
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.ADCSiteID ? `&adcsiteid=${options.ADCSiteID}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useADCSiteAuditsStore = () => {
    const dispatch = useDispatch();
    const {
        isADCSiteAuditsLoading,
        adcSiteAudits,
        adcSiteAuditsMeta,

        isADCSiteAuditLoading,
        isADCSiteAuditCreating,
        adcSiteAuditCreatedOk,
        isADCSiteAuditSaving,
        adcSiteAuditSavedOk,
        isADCSiteAuditDeleting,
        adcSiteAuditDeletedOk,
        adcSiteAudit,

        adcSiteAuditsErrorMessage
    } = useSelector(state => state.adcSiteAudits)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setADCSiteAuditsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setADCSiteAuditsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearADCSiteAuditsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {ADCSiteID, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const adcSiteAuditsAsync = async (options = {}) => {
        dispatch(onADCSiteAuditsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${ADC_SITE_AUDIT_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setADCSiteAudits({
                adcSiteAudits: Data,
                adcSiteAuditsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const adcSiteAuditsClear = () => {
        dispatch(clearADCSiteAudits());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const adcSiteAuditAsync = async (id) => {
        dispatch(onADCSiteAuditLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${ADC_SITE_AUDIT_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setADCSiteAudit(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {ADCSiteID} identificador del sitio en el ADC asociado
     */
    const adcSiteAuditCreateAsync = async (item) => {
        dispatch(onADCSiteAuditCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(ADC_SITE_AUDIT_URL, params);
            const { Data } = await resp.data;

            dispatch(setADCSiteAudit(Data));
            dispatch(isADCSiteAuditCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Value, AuditStep, Status, UpdatedUser} item Objeto tipo ADCSiteAudit
     */
    const adcSiteAuditSaveAsync = async (item) => {
        dispatch(onADCSiteAuditSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.put(`${ADC_SITE_AUDIT_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setADCSiteAudit(Data));
            dispatch(isADCSiteAuditSaved());
        } catch (error) {
            const message = getError(error);
            console.log('adcSiteAuditSaveAsync.error', message);
            setError(message);
        }
    }; // adcSiteAuditSaveAsync

    /**
     * Llama al endpoint para actualizar una lista de registros existentes en la base de datos
     * @param {array of ADCSiteAuditItemUpdateDto} list 
     */
    const adcSiteAuditSaveListAsync = async (list) => {
        dispatch(onADCSiteAuditSaving());

        const toSaveList = {
            Items: list.map(item => {
                return {
                    ...item,
                    UpdatedUser: user.username,
                }
            }),
        }

        try {
            const resp = await cortanaApi.put(`${ADC_SITE_AUDIT_URL}/list`, toSaveList);
            await resp.data;
            
            // const { Data } = await resp.data;
            // console.log('Data', Data);

            dispatch(isADCSiteAuditSaved());
        } catch (error) {
            const message = getError(error);
            console.log('adcSiteAuditSaveListAsync.error', message);
            setError(message);
        }
    }; // adcSiteAuditSaveListAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const adcSiteAuditDeleteAsync = async (id) => {
        dispatch(onADCSiteAuditDeleting());

        const toDelete = {
            ADCSiteAuditID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${ADC_SITE_AUDIT_URL}/${id}`, { data: toDelete });
            dispatch(isADCSiteAuditDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const adcSiteAuditClear = () => {
        dispatch(clearADCSiteAudit());
    }

    return {
        // properties
        isADCSiteAuditsLoading,
        adcSiteAudits,
        adcSiteAuditsMeta,

        isADCSiteAuditLoading,
        isADCSiteAuditCreating,
        adcSiteAuditCreatedOk,
        isADCSiteAuditSaving,
        adcSiteAuditSavedOk,
        isADCSiteAuditDeleting,
        adcSiteAuditDeletedOk,
        adcSiteAudit,

        adcSiteAuditsErrorMessage,

        // methods
        adcSiteAuditsAsync,
        adcSiteAuditsClear,
        
        adcSiteAuditAsync,
        adcSiteAuditCreateAsync,
        adcSiteAuditSaveAsync,
        adcSiteAuditSaveListAsync,
        adcSiteAuditDeleteAsync,
        adcSiteAuditClear,
    }
};
