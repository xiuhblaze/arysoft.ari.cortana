import { useDispatch, useSelector } from "react-redux";
import { formatISO } from "date-fns";

import {
    onAuditorDocumentsLoading,
    setAuditorDocuments,

    onAuditorDocumentLoading,
    setAuditorDocument,
    clearAuditorDocuments,

    onAuditorDocumentCreating,
    isAuditorDocumentCreated,
    onAuditorDocumentSaving,
    isAuditorDocumentSaved,
    onAuditorDocumentDeleting,
    isAuditorDocumentDeleted,

    setAuditorDocumentsErrorMessage,
    clearAuditorDocumentsErrorMessage,
    clearAuditorDocument,
} from "../store/slices/auditorDocumentsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITORDOCUMENTS_URI = '/auditordocuments';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.auditorID ? `&auditorid=${options.auditorID}` : '';
    query += options?.catAuditorDocumentID ? `&catauditordocumentid=${options.catAuditorDocumentID}` : '';
    query += options?.dueDateStart ? `&duedatestart=${formatISO(new Date(options.fechaInicio), { representation: 'date' })}` : '';
    query += options?.dueDateEnd ? `&duedateend=${formatISO(new Date(options.fechaTermino), { representation: 'date' })}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditorDocumentsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditorDocumentsLoading,
        auditorDocuments,
        auditorDocumentsMeta,

        isAuditorDocumentLoading,
        isAuditorDocumentCreating,
        auditorDocumentCreatedOk,
        isAuditorDocumentSaving,
        auditorDocumentSavedOk,
        isAuditorDocumentDeleting,
        auditorDocumentDeletedOk,
        auditorDocument,

        auditorDocumentsErrorMessage
    } = useSelector(state => state.auditorDocuments)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {

        if (isString(value)) {
            dispatch(setAuditorDocumentsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditorDocumentsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearAuditorDocumentsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditorDocumentsAsync = async (options = {}) => {
        dispatch(onAuditorDocumentsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITORDOCUMENTS_URI}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditorDocuments({
                auditorDocuments: Data,
                auditorDocumentsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditorDocumentsClear = () => {
        dispatch(clearAuditorDocuments());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditorDocumentAsync = async (id) => {
        dispatch(onAuditorDocumentLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITORDOCUMENTS_URI}/${id}`);
            const { Data } = await resp.data;

            dispatch(setAuditorDocument(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada al auditorDocumento
     */
    const auditorDocumentCreateAsync = async (item) => {
        dispatch(onAuditorDocumentCreating());

        try {
            const params = {
                //OrganizationID: item.OrganizationID,
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITORDOCUMENTS_URI, params);
            const { Data } = await resp.data;

            dispatch(setAuditorDocument(Data));
            dispatch(isAuditorDocumentCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditorDocumentSaveAsync = async (item, file) => {
        dispatch(onAuditorDocumentSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        };

        try {
            const formData = new FormData();
            const headers = {
                'Content-Type': 'multipart/form-data'
            };  
            const data = JSON.stringify(toSave);

            formData.append('data', data);
            formData.append('file', file);

            const resp = await cortanaApi.put(`${AUDITORDOCUMENTS_URI}`, formData, { headers });
            const { Data } = await resp.data;

            dispatch(setAuditorDocument(Data));
            dispatch(isAuditorDocumentSaved());

        } catch(error) {
            const infoError = getError(error);
            setError(infoError);
        }
    }; // auditorDocumentSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditorDocumentDeleteAsync = async (id) => {
        dispatch(onAuditorDocumentDeleting());

        const toDelete = {
            AuditorDocumentID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${AUDITORDOCUMENTS_URI}/${id}`, { data: toDelete });

            console.log('auditorDocumentDeleteAsync.resp', resp);

            dispatch(isAuditorDocumentDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const auditorDocumentDeleteFileAsync = async (id) => {

        const toDeleteFile = {
            ID: id,
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.delete(`${AUDITORDOCUMENTS_URI}/${id}/documentfile`, { data: toDeleteFile });
            const { Data } = await resp.data;

            console.log('auditorDocumentDeleteFileAsync.Data', Data)

            if (!!Data) {
                setAuditorDocument({
                    ...auditorDocument,
                    PhotoFilename: null,
                })
            }
            
            return Data;
        } catch (error) {
            const infoError = getError(error);
            setError(infoError);
        }

        return null;
    }; // auditorDocumentDeleteFileAsync

    const auditorDocumentClear = () => {
        dispatch(clearAuditorDocument());
    }

    return {
        // properties
        isAuditorDocumentsLoading,
        auditorDocuments,
        auditorDocumentsMeta,

        isAuditorDocumentLoading,
        isAuditorDocumentCreating,
        auditorDocumentCreatedOk,
        isAuditorDocumentSaving,
        auditorDocumentSavedOk,
        isAuditorDocumentDeleting,
        auditorDocumentDeletedOk,
        auditorDocument,

        auditorDocumentsErrorMessage,

        // methods
        auditorDocumentsAsync,
        auditorDocumentsClear,
        
        auditorDocumentAsync,
        auditorDocumentCreateAsync,
        auditorDocumentSaveAsync,
        // auditorDocumentSaveWithFileAsync,
        auditorDocumentDeleteAsync,
        auditorDocumentDeleteFileAsync,
        auditorDocumentClear,
    }
};
