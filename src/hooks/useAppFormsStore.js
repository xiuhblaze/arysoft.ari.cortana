import { useDispatch, useSelector } from "react-redux";
import { formatISO } from "date-fns";

import {
    onAppFormsLoading,
    setAppForms,

    onAppFormLoading,
    setAppForm,
    clearAppForms,

    onAppFormCreating,
    isAppFormCreated,
    onAppFormSaving,
    isAppFormSaved,
    onAppFormDeleting,
    isAppFormDeleted,

    setAppFormsErrorMessage,
    clearAppFormsErrorMessage,
    clearAppForm,
} from "../store/slices/appFormsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const APPFORM_URL = '/appForms';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.organizationID ? `&organizationid=${options.organizationID}` : '';
    query += options?.auditCycleID ? `&auditcycleid=${options.auditCycleID}` : '';
    query += options?.standardID ? `&standardid=${options.standardID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';

    return query;
}; // getSearchQuery

export const useAppFormsStore = () => {
    const dispatch = useDispatch();
    const {
        isAppFormsLoading,
        appForms,
        appFormsMeta,

        isAppFormLoading,
        isAppFormCreating,
        appFormCreatedOk,
        isAppFormSaving,
        appFormSavedOk,
        isAppFormDeleting,
        appFormDeletedOk,
        appForm,

        appFormsErrorMessage
    } = useSelector(state => state.appForms)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setAppFormsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAppFormsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearAppFormsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {OrganizationID, AppFormCycleID, AppFormorID, StandardID, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const appFormsAsync = async (options = {}) => {
        dispatch(onAppFormsLoading());
        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${APPFORM_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setAppForms({
                appForms: Data,
                appFormsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const appFormsClear = () => {
        dispatch(clearAppForms());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const appFormAsync = async (id) => {
        dispatch(onAppFormLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${APPFORM_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setAppForm(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {AppFormCycleID} identificador del ciclo de appFormorias asociada a la compañia
     */
    const appFormCreateAsync = async (item) => {
        dispatch(onAppFormCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(APPFORM_URL, params);
            const { Data } = await resp.data;

            dispatch(setAppForm(Data));
            dispatch(isAppFormCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Description, StartDate, EndDate, Status, UpdatedUser} item Objeto tipo AppForm
     */
    const appFormSaveAsync = async (item) => {
        dispatch(onAppFormSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${APPFORM_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setAppForm(Data));
            dispatch(isAppFormSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const appFormDeleteAsync = async (id) => {
        dispatch(onAppFormDeleting());

        const toDelete = {
            AppFormID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${APPFORM_URL}/${id}`, { data: toDelete });
            dispatch(isAppFormDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const appFormClear = () => {
        dispatch(clearAppForm());
    }

    // APP FORM NACE CODES

    const naceCodeAddAsync = async (naceCodeID) => { //! Cambiar la devolucion del error en un objeto personalizado 
        if (!appForm) {
            // setError('The app form is not loaded');
            // return;
            throw new Error('The app form is not loaded');
        }
        
        const toAdd = {
            AppFormID: appForm.ID,
            NaceCodeID: naceCodeID,
        };

        try {
            const resp = await cortanaApi.post(`${APPFORM_URL}/${appForm.ID}/nace-code`, toAdd);
            const { Data } = await resp.data;

            return Data;
        } catch (error) {   
            const errData = getError(error);
            // setError(errData);
            console.log(errData);
            throw new Error(errData.message);
        }

        return null;
    }; // naceCodeAddAsync

    const naceCodeDelAsync = async (naceCodeID) => {
        if (!appForm) {
            setError('The app form is not loaded');
            return;
        }
     
        const toRemove = {
            AppFormID: appForm.ID,
            NaceCodeID: naceCodeID,
        };

        try {   
            const resp = await cortanaApi.delete(`${APPFORM_URL}/${appForm.ID}/nace-code`, { data: toRemove });
            const { Data } = await resp.data;

            //console.log('naceCodeDelAsync.Data', Data);

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // naceCodeDelAsync

    // APP FORM CONTACTS

    const contactAddAsync = async (contactID) => {
        if (!appForm) {
            setError('The app form is not loaded');
            return;
        }
        
        const toAdd = {
            AppFormID: appForm.ID,
            ContactID: contactID,
        };
        
        try {
            const resp = await cortanaApi.post(`${APPFORM_URL}/${appForm.ID}/contact`, toAdd);
            const { Data } = await resp.data;

            console.log('contactAddAsync.Data', Data);

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // contactAddAsync

    const contactDelAsync = async (contactID) => {
        if (!appForm) {
            setError('The app form is not loaded');
            return;
        }
        
        const toRemove = {
            AppFormID: appForm.ID,
            ContactID: contactID,
        };

        try {
            const resp = await cortanaApi.delete(`${APPFORM_URL}/${appForm.ID}/contact`, { data: toRemove });
            const { Data } = await resp.data;

            console.log('contactDelAsync.Data', Data);
            
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // contactDelAsync

    // APP FORM SITES

    const siteAddAsync = async (siteID) => {
        if (!appForm) {
            setError('The app form is not loaded');
            return;
        }
        
        const toAdd = {
            AppFormID: appForm.ID,
            SiteID: siteID,
        };      

        try {
            const resp = await cortanaApi.post(`${APPFORM_URL}/${appForm.ID}/site`, toAdd);
            const { Data } = await resp.data;

            console.log('siteAddAsync.Data', Data);

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // siteAddAsync
    
    const siteDelAsync = async (siteID) => {
        if (!appForm) {
            setError('The app form is not loaded');
            return;
        }
        
        const toRemove = {
            AppFormID: appForm.ID,
            SiteID: siteID,
        };

        try {
            const resp = await cortanaApi.delete(`${APPFORM_URL}/${appForm.ID}/site`, { data: toRemove });
            const { Data } = await resp.data;

            console.log('siteDelAsync.Data', Data);
            
            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // siteDelAsync
    
    return {
        // properties
        isAppFormsLoading,
        appForms,
        appFormsMeta,

        isAppFormLoading,
        isAppFormCreating,
        appFormCreatedOk,
        isAppFormSaving,
        appFormSavedOk,
        isAppFormDeleting,
        appFormDeletedOk,
        appForm,

        appFormsErrorMessage,

        // methods
        appFormsAsync,
        appFormsClear,
        
        appFormAsync,
        appFormCreateAsync,
        appFormSaveAsync,
        appFormDeleteAsync,
        appFormClear,

        // app form nace codes
        naceCodeAddAsync,
        naceCodeDelAsync,

        // app form contacts
        contactAddAsync,
        contactDelAsync,

        // app form sites
        siteAddAsync,
        siteDelAsync,
    }
};
