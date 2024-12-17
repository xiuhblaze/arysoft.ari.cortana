import { useDispatch, useSelector } from "react-redux";
import { formatISO } from "date-fns";

import {
    onApplicationFormsLoading,
    setApplicationForms,

    setApplicationForm,
    onApplicationFormLoading,
    onApplicationFormCreating,
    isApplicationFormCreated,
    onApplicationFormSaving,
    isApplicationFormSaved,
    onApplicationFormDeleting,
    isApplicationFormDeleted,

    setApplicationFormsErrorMessage,
    clearApplicationFormsErrorMessage,
    clearApplicationForm,
} from "../store/slices/applicationFormsSlice";

import envVariables from "../helpers/envVariables";
import enums from "../helpers/enums";
import cortanaApi from "../api/cortanaApi";
import isString from "../helpers/isString";
import getError from "../helpers/getError";

const { 
    VITE_PAGE_SIZE,
    URI_APPLICATIONFORMS
} = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.text ? `&text=${options.text}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.nacecodeID ? `&nacecodeid=${options.nacecodeID}` : '';
    query += options?.riskLevelID ? `&risklevelid=${options.riskLevelID}` : '';
    query += options?.auditLanguage ? `&auditlanguage=${options.auditLanguage}` : '';
    query += options?.totalEmployesStart ? `&totalemployesstart=${options.totalEmployesStart}` : '';
    query += options?.totalEmployesEnd ? `&totalemployesend=${options.totalEmployesEnd}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includedeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useApplicationFormsStore = () => {
    const dispatch = useDispatch();
    const {
        isApplicationFormsLoading,
        applicationForms,
        applicationFormsMeta,
        isApplicationFormsFullListLoading,
        applicationFormsFullList,

        isApplicationFormLoading,
        isApplicationFormCreating,
        applicationFormCreatedOk,
        isApplicationFormSaving,
        applicationFormSavedOk,
        isApplicationFormDeleting,
        applicationFormDeletedOk,
        applicationForm,

        applicationFormsErrorMessage
    } = useSelector(state => state.applicationForms)

    const { user } = useSelector(state => state.auth);
    const {
        EstatusType,
        ApplicationFormsOrdenType
    } = enums();

    // Methods

    // const setError = (message) => {

    //     if (message.length === 0) return;

    //     dispatch(setApplicationFormsErrorMessage(message));
    //     setTimeout(() => {
    //         dispatch(clearApplicationFormsErrorMessage());
    //     }, 10);
    // };
    const setError = (value) => {
    
            if (isString(value)) {
                dispatch(setApplicationFormsErrorMessage(value));    
            } else if (isString(value.message)) {
                dispatch(setApplicationFormsErrorMessage(value.message));
            } else {
                console.error('Unknow error data: ', value);
                return null;
            }
            
            setTimeout(() => {
                dispatch(clearApplicationFormsErrorMessage());
            }, 10);
        }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, 
     * devuelve todos los registros.
     * @param {Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const applicationFormsAsync = async (options = {}) => {
        dispatch(onApplicationFormsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${ URI_APPLICATIONFORMS }${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setApplicationForms({
                applicationForms: Data,
                applicationFormsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const applicationFormAsync = async (id) => {
        dispatch(onApplicationFormLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${ URI_APPLICATIONFORMS }/${id}`);
            const { Data } = await resp.data;

            dispatch(setApplicationForm(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {string} username Nombre del usuario que realiza la creación del registro
     */
    const applicationFormCreateAsync = async () => {
        dispatch(onApplicationFormCreating());

        try {
            const params = {
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(URI_APPLICATIONFORMS, params);
            const { Data } = await resp.data;

            dispatch(setApplicationForm(Data));
            dispatch(isApplicationFormCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {applicationForm} item Objeto tipo ApplicationForm
     */
    const applicationFormSaveAsync = async (item) => {
        dispatch(onApplicationFormSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${ URI_APPLICATIONFORMS }/${toSave.id}`, toSave);
            const { Data } = await resp.data;

            dispatch(setApplicationForm(Data));
            dispatch(isApplicationFormSaved(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const applicationFormDeleteAsync = async (id) => {
        dispatch(onApplicationFormDeleting());

        const toDelete = {
            ApplicationFormID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${ URI_APPLICATIONFORMS }/${id}`, { data: toDelete });
            dispatch(isApplicationFormDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const applicationFormClear = () => {
        dispatch(clearApplicationForm());
    }

    return {
        // properties
        isApplicationFormsLoading,
        applicationForms,
        applicationFormsMeta,
        isApplicationFormsFullListLoading,
        applicationFormsFullList,

        isApplicationFormLoading,
        isApplicationFormCreating,
        applicationFormCreatedOk,
        isApplicationFormSaving,
        applicationFormSavedOk,
        isApplicationFormDeleting,
        applicationFormDeletedOk,
        applicationForm,

        applicationFormsErrorMessage,

        // methods
        applicationFormsAsync,
        applicationFormAsync,
        applicationFormCreateAsync,
        applicationFormSaveAsync,
        applicationFormDeleteAsync,
        applicationFormClear,
    }
};
