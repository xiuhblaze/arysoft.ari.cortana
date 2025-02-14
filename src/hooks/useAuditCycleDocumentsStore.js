import { useDispatch, useSelector } from "react-redux";

import {
    onAuditCycleDocumentsLoading,
    setAuditCycleDocuments,

    onAuditCycleDocumentLoading,
    setAuditCycleDocument,
    clearAuditCycleDocuments,

    onAuditCycleDocumentCreating,
    isAuditCycleDocumentCreated,
    onAuditCycleDocumentSaving,
    isAuditCycleDocumentSaved,
    onAuditCycleDocumentDeleting,
    isAuditCycleDocumentDeleted,

    setAuditCycleDocumentsErrorMessage,
    clearAuditCycleDocumentsErrorMessage,
    clearAuditCycleDocument,
} from "../store/slices/auditCycleDocumentsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITCYCLEDOCUMENT_URL = '/auditcycledocuments';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.auditCycleID ? `&auditcycleid=${options.auditCycleID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.documentType ? `&documenttype=${options.documentType}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditCycleDocumentsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditCycleDocumentsLoading,
        auditCycleDocuments,
        auditCycleDocumentsMeta,

        isAuditCycleDocumentLoading,
        isAuditCycleDocumentCreating,
        auditCycleDocumentCreatedOk,
        isAuditCycleDocumentSaving,
        auditCycleDocumentSavedOk,
        isAuditCycleDocumentDeleting,
        auditCycleDocumentDeletedOk,
        auditCycleDocument,

        auditCycleDocumentsErrorMessage
    } = useSelector(state => state.auditCycleDocuments)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {
        if (isString(value)) {
            dispatch(setAuditCycleDocumentsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditCycleDocumentsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearAuditCycleDocumentsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, AuditCycleID, StandardID, DocumentType, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditCycleDocumentsAsync = async (options = {}) => {
        dispatch(onAuditCycleDocumentsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITCYCLEDOCUMENT_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditCycleDocuments({
                auditCycleDocuments: Data,
                auditCycleDocumentsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditCycleDocumentsClear = () => {
        dispatch(clearAuditCycleDocuments());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditCycleDocumentAsync = async (id) => {
        dispatch(onAuditCycleDocumentLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITCYCLEDOCUMENT_URL}/${id}`);
            const { Data } = await resp.data;

            dispatch(setAuditCycleDocument(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {AuditCycleID} identificador del ciclo de auditoria asociada al documento
     */
    const auditCycleDocumentCreateAsync = async (item) => {
        dispatch(onAuditCycleDocumentCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITCYCLEDOCUMENT_URL, params);
            const { Data } = await resp.data;

            dispatch(setAuditCycleDocument(Data));
            dispatch(isAuditCycleDocumentCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, StandardID, Version, Comments, DocumentType, OtherDescription, Status, UpdatedUser} item Objeto tipo AuditCycleDocument
     */    
    const auditCycleDocumentSaveAsync = async (item, file) => {
        dispatch(onAuditCycleDocumentSaving());

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

            const resp = await cortanaApi.put(`${AUDITCYCLEDOCUMENT_URL}`, formData, { headers });
            const { Data } = await resp.data;

            dispatch(setAuditCycleDocument(Data));
            dispatch(isAuditCycleDocumentSaved());

        } catch(error) {
            const infoError = getError(error);
            setError(infoError);
        }
    }; // auditCycleDocumentSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditCycleDocumentDeleteAsync = async (id) => {
        dispatch(onAuditCycleDocumentDeleting());

        const toDelete = {
            AuditCycleDocumentID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${AUDITCYCLEDOCUMENT_URL}/${id}`, { data: toDelete });

            console.log('auditCycleDocumentDeleteAsync.resp', resp);

            dispatch(isAuditCycleDocumentDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    // const auditCycleDocumentDeleteFileAsync = async (id) => {

    //     const toDeleteFile = {
    //         ID: id,
    //         UpdatedUser: user.username,
    //     };

    //     try {
    //         const resp = await cortanaApi.delete(`${AUDITCYCLEDOCUMENT_URL}/${id}/photofile`, { data: toDeleteFile });
    //         const { Data } = await resp.data;

    //         console.log('auditCycleDocumentDeleteFileAsync.Data', Data)

    //         if (!!Data) {
    //             setAuditCycleDocument({
    //                 ...auditCycleDocument,
    //                 PhotoFilename: null,
    //             })
    //         }
            
    //         return Data;
    //     } catch (error) {
    //         const infoError = getError(error);
    //         setError(infoError);
    //     }

    //     return null;
    // }; // auditCycleDocumentDeleteFileAsync

    const auditCycleDocumentClear = () => {
        dispatch(clearAuditCycleDocument());
    }

    return {
        // properties
        isAuditCycleDocumentsLoading,
        auditCycleDocuments,
        auditCycleDocumentsMeta,

        isAuditCycleDocumentLoading,
        isAuditCycleDocumentCreating,
        auditCycleDocumentCreatedOk,
        isAuditCycleDocumentSaving,
        auditCycleDocumentSavedOk,
        isAuditCycleDocumentDeleting,
        auditCycleDocumentDeletedOk,
        auditCycleDocument,

        auditCycleDocumentsErrorMessage,

        // methods
        auditCycleDocumentsAsync,
        auditCycleDocumentsClear,
        
        auditCycleDocumentAsync,
        auditCycleDocumentCreateAsync,
        auditCycleDocumentSaveAsync,
        // auditCycleDocumentSaveWithFileAsync,
        auditCycleDocumentDeleteAsync,
        auditCycleDocumentDeleteFileAsync,
        auditCycleDocumentClear,
    }
};
