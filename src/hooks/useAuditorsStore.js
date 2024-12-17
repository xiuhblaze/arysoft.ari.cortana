import { useDispatch, useSelector } from "react-redux";

import {
    onAuditorsLoading,
    setAuditors,

    onAuditorLoading,
    setAuditor,
    clearAuditors,

    onAuditorCreating,
    isAuditorCreated,
    onAuditorSaving,
    isAuditorSaved,
    onAuditorDeleting,
    isAuditorDeleted,

    setAuditorsErrorMessage,
    clearAuditorsErrorMessage,
    clearAuditor,
} from "../store/slices/auditorsSlice";

import envVariables from "../helpers/envVariables";
// import enums from "../helpers/enums";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITOR_URI = '/auditors';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.isLeader ? `&isleader=${options.isLeader}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditorsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditorsLoading,
        auditors,
        auditorsMeta,

        isAuditorLoading,
        isAuditorCreating,
        auditorCreatedOk,
        isAuditorSaving,
        auditorSavedOk,
        isAuditorDeleting,
        auditorDeletedOk,
        auditor,

        auditorsErrorMessage
    } = useSelector(state => state.auditors)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {

        if (isString(value)) {
            dispatch(setAuditorsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditorsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        
        setTimeout(() => {
            dispatch(clearAuditorsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, IsLeader, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditorsAsync = async (options = {}) => {
        dispatch(onAuditorsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITOR_URI}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditors({
                auditors: Data,
                auditorsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditorsClear = () => {
        dispatch(clearAuditors());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditorAsync = async (id) => {
        dispatch(onAuditorLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITOR_URI}/${id}`);
            const { Data } = await resp.data;

            dispatch(setAuditor(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     */
    const auditorCreateAsync = async () => {
        dispatch(onAuditorCreating());

        try {
            const params = {
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITOR_URI, params);
            const { Data } = await resp.data;

            dispatch(setAuditor(Data));
            dispatch(isAuditorCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    // /**
    //  * Llama al endpoint para actualizar la información de un registro existente en la base de datos
    //  * @param {ID, FirstName, MiddleName, LastName, Email, Phone, Address, Status, UpdatedUser} item Objeto tipo Auditor
    //  */
    // const auditorSaveAsync = async (item) => {
    //     dispatch(onAuditorSaving());

    //     const toSave = {
    //         ...item,
    //         UpdatedUser: user.username,
    //     }
    //     try {
    //         const resp = await cortanaApi.put(`${AUDITOR_URI}/${toSave.ID}`, toSave);
    //         const { Data } = await resp.data;

    //         dispatch(setAuditor(Data));
    //         dispatch(isAuditorSaved());
    //     } catch (error) {
    //         const message = getError(error);
    //         setError(message);
    //     }
    // };

    const auditorSaveAsync = async (item, file) => {
        dispatch(onAuditorSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        };

        // console.log(file);

        try {
            const formData = new FormData();
            const headers = {
                'Content-Type': 'multipart/form-data'
            };  
            const data = JSON.stringify(toSave);

            formData.append('data', data);
            formData.append('file', file);

            const resp = await cortanaApi.put(`${AUDITOR_URI}`, formData, { headers });
            const { Data } = await resp.data;

            dispatch(setAuditor(Data));
            dispatch(isAuditorSaved());

        } catch(error) {
            const infoError = getError(error);
            setError(infoError);
        }
    }; // auditorSaveWithFileAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditorDeleteAsync = async (id) => {
        dispatch(onAuditorDeleting());

        const toDelete = {
            AuditorID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${AUDITOR_URI}/${id}`, { data: toDelete });

            console.log('auditorDeleteAsync.resp', resp);
            dispatch(isAuditorDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const auditorDeleteFileAsync = async (id) => {

        const toDeleteFile = {
            ID: id,
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.delete(`${AUDITOR_URI}/${id}/photofile`, { data: toDeleteFile });
            const { Data } = await resp.data;

            console.log('auditorDeleteFileAsync.Data', Data)

            if (!!Data) {
                setAuditor({
                    ...auditor,
                    PhotoFilename: null,
                })
            }
            
            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // auditorDeleteFileAsync

    const auditorClear = () => {
        dispatch(clearAuditor());
    }

    return {
        // properties
        isAuditorsLoading,
        auditors,
        auditorsMeta,

        isAuditorLoading,
        isAuditorCreating,
        auditorCreatedOk,
        isAuditorSaving,
        auditorSavedOk,
        isAuditorDeleting,
        auditorDeletedOk,
        auditor,

        auditorsErrorMessage,

        // methods
        auditorsAsync,
        auditorsClear,
        
        auditorAsync,
        auditorCreateAsync,
        auditorSaveAsync,
        // auditorSaveWithFileAsync,
        auditorDeleteAsync,
        auditorDeleteFileAsync,
        auditorClear,
    }
};
