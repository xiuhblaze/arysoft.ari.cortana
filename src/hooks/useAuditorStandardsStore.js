import { useDispatch, useSelector } from "react-redux";

import {
    onAuditorStandardsLoading,
    setAuditorStandards,

    onAuditorStandardLoading,
    setAuditorStandard,
    clearAuditorStandards,

    onAuditorStandardCreating,
    isAuditorStandardCreated,
    onAuditorStandardSaving,
    isAuditorStandardSaved,
    onAuditorStandardDeleting,
    isAuditorStandardDeleted,

    setAuditorStandardsErrorMessage,
    clearAuditorStandardsErrorMessage,
    clearAuditorStandard,
} from "../store/slices/auditorStandardsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITORSTANDARDS_ROUTE = '/auditorstandards';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.auditorID ? `&auditorid=${options.auditorID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditorStandardsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditorStandardsLoading,
        auditorStandards,
        auditorStandardsMeta,

        isAuditorStandardLoading,
        isAuditorStandardCreating,
        auditorStandardCreatedOk,
        isAuditorStandardSaving,
        auditorStandardSavedOk,
        isAuditorStandardDeleting,
        auditorStandardDeletedOk,
        auditorStandard,

        auditorStandardsErrorMessage
    } = useSelector(state => state.auditorStandards)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {

        if (isString(value)) {
            dispatch(setAuditorStandardsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditorStandardsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearAuditorStandardsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, AuditorID, StandardID, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditorStandardsAsync = async (options = {}) => {
        dispatch(onAuditorStandardsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITORSTANDARDS_ROUTE}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditorStandards({
                auditorStandards: Data,
                auditorStandardsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditorStandardsClear = () => {
        dispatch(clearAuditorStandards());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditorStandardAsync = async (id) => {
        dispatch(onAuditorStandardLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITORSTANDARDS_ROUTE}/${id}`);
            const { Data } = await resp.data;

            dispatch(setAuditorStandard(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {AuditorID} identificador del auditor asociado al standard
     */
    const auditorStandardCreateAsync = async (item) => {
        dispatch(onAuditorStandardCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITORSTANDARDS_ROUTE, params);
            const { Data } = await resp.data;

            dispatch(setAuditorStandard(Data));
            dispatch(isAuditorStandardCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * 
     * @param {auditorID, standardID, comments, status} item Objeto que contiene los valores a registrar del Standard asociado al Auditor
     */
    const auditorStandardSaveAsync = async (item) => {
        dispatch(onAuditorStandardSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.put(`${AUDITORSTANDARDS_ROUTE}/${item.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setAuditorStandard(Data));
            dispatch(isAuditorStandardSaved());

        } catch(error) {
            const infoError = getError(error);
            setError(infoError);
        }
    }; // auditorStandardSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditorStandardDeleteAsync = async (id) => {
        dispatch(onAuditorStandardDeleting());

        const toDelete = {
            AuditorStandardID: id,
            UpdatedUser: user.username,
        }

        try {            
            await cortanaApi.delete(`${AUDITORSTANDARDS_ROUTE}/${id}`, { data: toDelete });
            dispatch(isAuditorStandardDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // auditorStandardDeleteAsync

    const auditorStandardClear = () => {
        dispatch(clearAuditorStandard());
    }

    return {
        // properties
        isAuditorStandardsLoading,
        auditorStandards,
        auditorStandardsMeta,

        isAuditorStandardLoading,
        isAuditorStandardCreating,
        auditorStandardCreatedOk,
        isAuditorStandardSaving,
        auditorStandardSavedOk,
        isAuditorStandardDeleting,
        auditorStandardDeletedOk,
        auditorStandard,

        auditorStandardsErrorMessage,

        // methods
        auditorStandardsAsync,
        auditorStandardsClear,
        
        auditorStandardAsync,
        auditorStandardCreateAsync,
        auditorStandardSaveAsync,
        auditorStandardDeleteAsync,
        auditorStandardClear,
    }
};
