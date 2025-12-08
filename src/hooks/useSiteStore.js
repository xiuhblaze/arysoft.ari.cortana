import { useDispatch, useSelector } from "react-redux";

import {
    onSitesLoading,
    setSites,

    onSiteLoading,
    setSite,
    clearSites,

    onSiteCreating,
    isSiteCreated,
    onSiteSaving,
    isSiteSaved,
    onSiteDeleting,
    isSiteDeleted,

    setSitesErrorMessage,
    clearSitesErrorMessage,
    clearSite,
} from "../store/slices/sitesSlice";

import envVariables from "../helpers/envVariables";
import enums from "../helpers/enums";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";
import RequestDeduplicator from "../helpers/requestDeduplication";

const SITE_URI = '/sites';
const { VITE_PAGE_SIZE } = envVariables();

// Instancia del deduplicador para este hook
const sitesDeduplicator = new RequestDeduplicator();
const siteDeduplicator = new RequestDeduplicator();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.organizationID ? `&organizationid=${options.organizationID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useSitesStore = () => {
    const dispatch = useDispatch();
    const {
        isSitesLoading,
        sites,
        sitesMeta,

        isSiteLoading,
        isSiteCreating,
        siteCreatedOk,
        isSiteSaving,
        siteSavedOk,
        isSiteDeleting,
        siteDeletedOk,
        site,

        sitesErrorMessage
    } = useSelector(state => state.sites)

    const { user } = useSelector(state => state.auth);
    const {
        EstatusType,
        SitesOrdenType
    } = enums();

    // Methods

    const setError = (value) => {
        if (isString(value)) {
            dispatch(setSitesErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setSitesErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearSitesErrorMessage());
        }, 10);
    };

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * Implementa deduplication para evitar llamadas duplicadas.
     * @param {Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const sitesAsync = async (options = {}) => {
        const deduplicationKey = sitesDeduplicator.generateKey(SITE_URI, options);
        
        return sitesDeduplicator.execute(deduplicationKey, async () => {
            dispatch(onSitesLoading());
            try {
                const query = getSearchQuery(options);
                const resp = await cortanaApi.get(`${SITE_URI}${query}`);
                const { Data, Meta } = await resp.data;

                dispatch(setSites({
                    sites: Data,
                    sitesMeta: Meta
                }));
            } catch (error) {
                const message = getError(error);
                setError(message);
                throw error;
            }
        });
    };

    const sitesClear = () => {
        dispatch(clearSites());
        sitesDeduplicator.clearAll();
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * Implementa deduplication para evitar llamadas duplicadas.
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const siteAsync = async (id) => {
        if (!id) {
            setError('You must specify the ID');
            return;
        }

        const deduplicationKey = siteDeduplicator.generateKey(`${SITE_URI}/${id}`, {});
        
        return siteDeduplicator.execute(deduplicationKey, async () => {
            dispatch(onSiteLoading());
            try {
                const resp = await cortanaApi.get(`${SITE_URI}/${id}`);
                const { Data } = await resp.data;

                dispatch(setSite(Data));
            } catch (error) {
                const message = getError(error);
                setError(message);
                throw error;
            }
        });
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada al siteo
     */
    const siteCreateAsync = async (item) => {
        dispatch(onSiteCreating());

        try {
            const params = {
                //OrganizationID: item.OrganizationID,
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(SITE_URI, params);
            const { Data } = await resp.data;

            dispatch(setSite(Data));
            dispatch(isSiteCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, Description, Status, UpdatedUser} item Objeto tipo Site
     */
    const siteSaveAsync = async (item) => {
        dispatch(onSiteSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${SITE_URI}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setSite(Data));
            dispatch(isSiteSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const siteDeleteAsync = async (id) => {
        dispatch(onSiteDeleting());

        const toDelete = {
            SiteID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${SITE_URI}/${id}`, { data: toDelete });
            dispatch(isSiteDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const siteClear = () => {
        dispatch(clearSite());
        siteDeduplicator.clearAll();
    }

    return {
        // properties
        isSitesLoading,
        sites,
        sitesMeta,

        isSiteLoading,
        isSiteCreating,
        siteCreatedOk,
        isSiteSaving,
        siteSavedOk,
        isSiteDeleting,
        siteDeletedOk,
        site,

        sitesErrorMessage,

        // methods
        sitesAsync,
        sitesClear,
        
        siteAsync,
        siteCreateAsync,
        siteSaveAsync,
        siteDeleteAsync,
        siteClear,
    }
};
