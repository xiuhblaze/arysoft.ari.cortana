import { useDispatch, useSelector } from "react-redux";

import {
    onCatAuditorDocumentsLoading,
    setCatAuditorDocuments,

    onCatAuditorDocumentLoading,
    setCatAuditorDocument,
    clearCatAuditorDocuments,

    onCatAuditorDocumentCreating,
    isCatAuditorDocumentCreated,
    onCatAuditorDocumentSaving,
    isCatAuditorDocumentSaved,
    onCatAuditorDocumentDeleting,
    isCatAuditorDocumentDeleted,

    setCatAuditorDocumentsErrorMessage,
    clearCatAuditorDocumentsErrorMessage,
    clearCatAuditorDocument,
} from "../store/slices/catAuditorDocumentsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";

const CATAUDITORDOCUMENT_URI = '/catAuditorDocuments';
const { VITE_DEFAULT_PAGESIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_DEFAULT_PAGESIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.documentType ? `&documenttype=${options.documentType}` : '';
    query += options?.subCategory ? `&subcategory=${options.subCategory}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useCatAuditorDocumentsStore = () => {
    const dispatch = useDispatch();
    const {
        isCatAuditorDocumentsLoading,
        catAuditorDocuments,
        catAuditorDocumentsMeta,

        isCatAuditorDocumentLoading,
        isCatAuditorDocumentCreating,
        catAuditorDocumentCreatedOk,
        isCatAuditorDocumentSaving,
        catAuditorDocumentSavedOk,
        isCatAuditorDocumentDeleting,
        catAuditorDocumentDeletedOk,
        catAuditorDocument,

        catAuditorDocumentsErrorMessage
    } = useSelector(state => state.catAuditorDocuments)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (message) => {

        if (message.length === 0) return;

        dispatch(setCatAuditorDocumentsErrorMessage(message));
        setTimeout(() => {
            dispatch(clearCatAuditorDocumentsErrorMessage());
        }, 10);
    };

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Text, DocumentType, SubCategory, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const catAuditorDocumentsAsync = async (options = {}) => {
        dispatch(onCatAuditorDocumentsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${CATAUDITORDOCUMENT_URI}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setCatAuditorDocuments({
                catAuditorDocuments: Data,
                catAuditorDocumentsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const catAuditorDocumentsClear = () => {
        dispatch(clearCatAuditorDocuments());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const catAuditorDocumentAsync = async (id) => {
        dispatch(onCatAuditorDocumentLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${CATAUDITORDOCUMENT_URI}/${id}`);
            const { Data } = await resp.data;

            dispatch(setCatAuditorDocument(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada al catAuditorDocumento
     */
    const catAuditorDocumentCreateAsync = async () => {
        dispatch(onCatAuditorDocumentCreating());

        try {
            const params = {
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(CATAUDITORDOCUMENT_URI, params);
            const { Data } = await resp.data;

            dispatch(setCatAuditorDocument(Data));
            dispatch(isCatAuditorDocumentCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Description, LegalDescription, DocumentType, SubCategory, UpdateEvery, UpdatePeriodicity, WarningEvery, WarningPeriodicity, IsRequired, Order, Status} item Objeto tipo CatAuditorDocument
     */
    const catAuditorDocumentSaveAsync = async (item) => {
        dispatch(onCatAuditorDocumentSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${CATAUDITORDOCUMENT_URI}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setCatAuditorDocument(Data));
            dispatch(isCatAuditorDocumentSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const catAuditorDocumentDeleteAsync = async (id) => {
        dispatch(onCatAuditorDocumentDeleting());

        const toDelete = {
            CatAuditorDocumentID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${CATAUDITORDOCUMENT_URI}/${id}`, { data: toDelete });
            dispatch(isCatAuditorDocumentDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const catAuditorDocumentClear = () => {
        dispatch(clearCatAuditorDocument());
    }

    return {
        // properties
        isCatAuditorDocumentsLoading,
        catAuditorDocuments,
        catAuditorDocumentsMeta,

        isCatAuditorDocumentLoading,
        isCatAuditorDocumentCreating,
        catAuditorDocumentCreatedOk,
        isCatAuditorDocumentSaving,
        catAuditorDocumentSavedOk,
        isCatAuditorDocumentDeleting,
        catAuditorDocumentDeletedOk,
        catAuditorDocument,

        catAuditorDocumentsErrorMessage,

        // methods
        catAuditorDocumentsAsync,
        catAuditorDocumentsClear,
        
        catAuditorDocumentAsync,
        catAuditorDocumentCreateAsync,
        catAuditorDocumentSaveAsync,
        catAuditorDocumentDeleteAsync,
        catAuditorDocumentClear,
    }
};
