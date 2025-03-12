import { useDispatch, useSelector } from "react-redux";
import { formatISO } from "date-fns";

import {
    onAuditDocumentsLoading,
    setAuditDocuments,

    onAuditDocumentLoading,
    setAuditDocument,
    clearAuditDocuments,

    onAuditDocumentCreating,
    isAuditDocumentCreated,
    onAuditDocumentSaving,
    isAuditDocumentSaved,
    onAuditDocumentDeleting,
    isAuditDocumentDeleted,

    setAuditDocumentsErrorMessage,
    clearAuditDocumentsErrorMessage,
    clearAuditDocument,
} from "../store/slices/auditDocumentsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const AUDITDOCUMENT_URL = '/auditDocuments';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.auditID ? `&auditid=${options.auditID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.documentType ? `&documenttype=${options.documentType}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useAuditDocumentsStore = () => {
    const dispatch = useDispatch();
    const {
        isAuditDocumentsLoading,
        auditDocuments,
        auditDocumentsMeta,

        isAuditDocumentLoading,
        isAuditDocumentCreating,
        auditDocumentCreatedOk,
        isAuditDocumentSaving,
        auditDocumentSavedOk,
        isAuditDocumentDeleting,
        auditDocumentDeletedOk,
        auditDocument,

        auditDocumentsErrorMessage
    } = useSelector(state => state.auditDocuments)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {
        if (isString(value)) {
            dispatch(setAuditDocumentsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuditDocumentsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearAuditDocumentsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {AuditID, StandardID, Text, DocumentType, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const auditDocumentsAsync = async (options = {}) => {
        dispatch(onAuditDocumentsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${AUDITDOCUMENT_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAuditDocuments({
                auditDocuments: Data,
                auditDocumentsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const auditDocumentsClear = () => {
        dispatch(clearAuditDocuments());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const auditDocumentAsync = async (id) => {
        dispatch(onAuditDocumentLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${AUDITDOCUMENT_URL}/${id}`);
            const { Data } = await resp.data;

            dispatch(setAuditDocument(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {AuditID} identificador de la auditoria asociada al documento
     */
    const auditDocumentCreateAsync = async (item) => {
        dispatch(onAuditDocumentCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(AUDITDOCUMENT_URL, params);
            const { Data } = await resp.data;

            dispatch(setAuditDocument(Data));
            dispatch(isAuditDocumentCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, StandardID, Comments, DocumentType, OtherDescription, IsWitnessIncluded, Status, UpdatedUser} item Objeto tipo AuditDocument
     */
    const auditDocumentSaveAsync = async (item, file) => {
        dispatch(onAuditDocumentSaving());

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

            const resp = await cortanaApi.put(`${AUDITDOCUMENT_URL}`, formData, { headers });
            const { Data } = await resp.data;

            dispatch(setAuditDocument(Data));
            dispatch(isAuditDocumentSaved());

        } catch(error) {
            const infoError = getError(error);
            setError(infoError);
        }
    }; // auditDocumentSaveAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const auditDocumentDeleteAsync = async (id) => {
        dispatch(onAuditDocumentDeleting());

        const toDelete = {
            AuditDocumentID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${AUDITDOCUMENT_URL}/${id}`, { data: toDelete });

            // console.log('auditDocumentDeleteAsync.resp', resp);

            dispatch(isAuditDocumentDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    // const auditDocumentDeleteFileAsync = async (id) => {

    //     const toDeleteFile = {
    //         ID: id,
    //         UpdatedUser: user.username,
    //     };

    //     try {
    //         const resp = await cortanaApi.delete(`${AUDITDOCUMENT_URL}/${id}/photofile`, { data: toDeleteFile });
    //         const { Data } = await resp.data;

    //         console.log('auditDocumentDeleteFileAsync.Data', Data)

    //         if (!!Data) {
    //             setAuditDocument({
    //                 ...auditDocument,
    //                 PhotoFilename: null,
    //             })
    //         }
            
    //         return Data;
    //     } catch (error) {
    //         const infoError = getError(error);
    //         setError(infoError);
    //     }

    //     return null;
    // }; // auditDocumentDeleteFileAsync

    const auditDocumentClear = () => {
        dispatch(clearAuditDocument());
    }

    // AUDIT STANDARDS

    const auditStandardAddAsync = async (id) => {

        if (!auditDocument) { 
            setError('The audit document is not loaded');
            return;
        }

        const toAdd = {
            AuditDocumentID: auditDocument.ID,
            AuditStandardID: id,
        };

        // console.log(`${AUDITDOCUMENT_URL}/${auditDocument.ID}/audit-standard`, toAdd);

        try {
            const resp = await cortanaApi.post(`${AUDITDOCUMENT_URL}/${auditDocument.ID}/audit-standard`, toAdd);
            const { Data } = await resp.data;

            // console.log('auditStandardAddAsync.Data', Data);

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // auditStandardAddAsync

    const auditStandardDelAsync = async (auditStandardID) => {

        if (!auditDocument) { 
            setError('The audit document is not loaded');
            return;
        }

        const toRemove = {
            AuditDocumentID: auditDocument.ID,
            AuditStandardID: auditStandardID,
        };

        // console.log(`${AUDITDOCUMENT_URL}/${auditDocument.ID}/audit-standard`, toRemove);

        try {
            const resp = await cortanaApi.delete(`${AUDITDOCUMENT_URL}/${auditDocument.ID}/audit-standard`, { data: toRemove });
            const { Data } = await resp.data;

            //console.log('auditStandardDelAsync.Data', Data);

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // auditStandardDelAsync

    return {
        // properties
        isAuditDocumentsLoading,
        auditDocuments,
        auditDocumentsMeta,

        isAuditDocumentLoading,
        isAuditDocumentCreating,
        auditDocumentCreatedOk,
        isAuditDocumentSaving,
        auditDocumentSavedOk,
        isAuditDocumentDeleting,
        auditDocumentDeletedOk,
        auditDocument,

        auditDocumentsErrorMessage,

        // methods
        auditDocumentsAsync,
        auditDocumentsClear,
        
        auditDocumentAsync,
        auditDocumentCreateAsync,
        auditDocumentSaveAsync,
        auditStandardAddAsync,
        // auditDocumentSaveWithFileAsync,
        auditDocumentDeleteAsync,
        //auditDocumentDeleteFileAsync,
        auditDocumentClear,        
        // audit standards - add or remove from audit document
        auditStandardAddAsync,
        auditStandardDelAsync,
    }
};
