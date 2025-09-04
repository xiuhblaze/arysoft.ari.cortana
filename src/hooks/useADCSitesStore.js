import { useDispatch, useSelector } from "react-redux";

import {
    onADCSitesLoading,
    setADCSites,

    onADCSiteLoading,
    setADCSite,
    clearADCSites,

    onADCSiteCreating,
    isADCSiteCreated,
    onADCSiteSaving,
    isADCSiteSaved,
    onADCSiteDeleting,
    isADCSiteDeleted,

    setADCSitesErrorMessage,
    clearADCSitesErrorMessage,
    clearADCSite,
} from "../store/slices/adcSitesSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const ADC_SITE_URL = '/adcSites'; 
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.ADCID ? `&adcid=${options.ADCID}` : '';
    query += options?.SiteID ? `&siteid=${options.SiteID}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useADCSitesStore = () => {
    const dispatch = useDispatch();
    const {
        isADCSitesLoading,
        adcSites,
        adcSitesMeta,

        isADCSiteLoading,
        isADCSiteCreating,
        adcSiteCreatedOk,
        isADCSiteSaving,
        adcSiteSavedOk,
        isADCSiteDeleting,
        adcSiteDeletedOk,
        adcSite,

        adcSitesErrorMessage
    } = useSelector(state => state.adcSites)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setADCSitesErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setADCSitesErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearADCSitesErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {ADCID, SiteID, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const adcSitesAsync = async (options = {}) => {
        dispatch(onADCSitesLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${ADC_SITE_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setADCSites({
                adcSites: Data,
                adcSitesMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // adcSitesAsync

    const adcSitesClear = () => {
        dispatch(clearADCSites());
    }; // adcSitesClear

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const adcSiteAsync = async (id) => {
        dispatch(onADCSiteLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${ADC_SITE_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setADCSite(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // adcSiteAsync

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada a la compañia
     */
    const adcSiteCreateAsync = async (item) => {
        dispatch(onADCSiteCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(ADC_SITE_URL, params);
            const { Data } = await resp.data;

            dispatch(setADCSite(Data));
            dispatch(isADCSiteCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // adcSiteCreateAsync

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, LegalEntity, COID, Status, UpdatedUser} item Objeto tipo ADCSite
     */
    const adcSiteSaveAsync = async (item, md11file) => {
        dispatch(onADCSiteSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        // console.log('adcSiteSaveAsync.toSave', toSave);
        try {

            const formData = new FormData();
            const headers = {
                'Content-Type': 'multipart/form-data'
            };  
            const data = JSON.stringify(toSave);

            formData.append('data', data);
            if (!!md11file) {
                formData.append('file', md11file);
            }
            
            const resp = await cortanaApi.put(`${ADC_SITE_URL}`, formData, { headers });
            //const resp = await cortanaApi.put(`${ADC_SITE_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setADCSite(Data));
            dispatch(isADCSiteSaved());
        } catch (error) {
            const message = getError(error);
            console.log('adcSiteSaveAsync.error', message);
            setError(message);
        }
    }; // adcSiteSaveAsync

    const adcSiteSaveListAsync = async (list, files) => {
        dispatch(onADCSiteSaving());

        const toSaveList = {
            Items: list.map(item => {
                return {
                    ...item,
                    UpdatedUser: user.username,
                }
            }),
        }

        try {
            const formData = new FormData();
            const headers = {
                'Content-Type': 'multipart/form-data'
            };  
            const data = JSON.stringify(toSaveList);

            formData.append('data', data);
            if (!!files && files.length > 0) {
                // Enviar en un ciclo por cada archivo
                for (let i = 0; i < files.length; i++) {
                    formData.append(`files[${i}]`, files[i]);
                }
            }

            const resp = await cortanaApi.put(`${ADC_SITE_URL}/list`, formData, { headers });
            // const { Data } = await resp.data;

            dispatch(isADCSiteSaved());
        } catch (error) {
            const message = getError(error);
            console.log('adcSiteSaveListAsync.error', message);
            setError(message);
        }
    }; // adcSiteSaveListAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const adcSiteDeleteAsync = async (id) => {
        dispatch(onADCSiteDeleting());

        const toDelete = {
            ADCSiteID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${ADC_SITE_URL}/${id}`, { data: toDelete });
            dispatch(isADCSiteDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const adcSiteClear = () => {
        dispatch(clearADCSite());
    }

    return {
        // properties
        isADCSitesLoading,
        adcSites,
        adcSitesMeta,

        isADCSiteLoading,
        isADCSiteCreating,
        adcSiteCreatedOk,
        isADCSiteSaving,
        adcSiteSavedOk,
        isADCSiteDeleting,
        adcSiteDeletedOk,
        adcSite,

        adcSitesErrorMessage,

        // methods
        adcSitesAsync,
        adcSitesClear,
        
        adcSiteAsync,
        adcSiteCreateAsync,
        adcSiteSaveAsync,
        adcSiteSaveListAsync,
        adcSiteDeleteAsync,
        adcSiteClear,
    }
};
