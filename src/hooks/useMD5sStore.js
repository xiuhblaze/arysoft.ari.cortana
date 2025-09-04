import { useDispatch, useSelector } from "react-redux";

import {
    onMD5sLoading,
    setMD5s,

    onMD5Loading,
    setMD5,
    clearMD5s,

    onMD5Creating,
    isMD5Created,
    onMD5Saving,
    isMD5Saved,
    onMD5Deleting,
    isMD5Deleted,

    setMD5sErrorMessage,
    clearMD5sErrorMessage,
    clearMD5,
} from "../store/slices/md5sSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const MD5_URL = '/md5s'; 
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.NumEmployees ? `&numemployees=${options.NumEmployees}` : '';
    query += options?.Days ? `&days=${options.Days}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useMD5sStore = () => {
    const dispatch = useDispatch();
    const {
        isMD5sLoading,
        md5s,
        md5sMeta,

        isMD5Loading,
        isMD5Creating,
        md5CreatedOk,
        isMD5Saving,
        md5SavedOk,
        isMD5Deleting,
        md5DeletedOk,
        md5,

        md5sErrorMessage
    } = useSelector(state => state.md5s)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setMD5sErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setMD5sErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearMD5sErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {NumEmployees, Days, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const md5sAsync = async (options = {}) => {
        dispatch(onMD5sLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${MD5_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setMD5s({
                md5s: Data,
                md5sMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const md5sClear = () => {
        dispatch(clearMD5s());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const md5Async = async (id) => {
        dispatch(onMD5Loading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${MD5_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setMD5(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada a la compañia
     */
    const md5CreateAsync = async (item) => {
        dispatch(onMD5Creating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(MD5_URL, params);
            const { Data } = await resp.data;

            dispatch(setMD5(Data));
            dispatch(isMD5Created());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, LegalEntity, COID, Status, UpdatedUser} item Objeto tipo MD5
     */
    const md5SaveAsync = async (item) => {
        dispatch(onMD5Saving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${MD5_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setMD5(Data));
            dispatch(isMD5Saved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const md5DeleteAsync = async (id) => {
        dispatch(onMD5Deleting());

        const toDelete = {
            MD5ID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${MD5_URL}/${id}`, { data: toDelete });
            dispatch(isMD5Deleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const md5Clear = () => {
        dispatch(clearMD5());
    }

    return {
        // properties
        isMD5sLoading,
        md5s,
        md5sMeta,

        isMD5Loading,
        isMD5Creating,
        md5CreatedOk,
        isMD5Saving,
        md5SavedOk,
        isMD5Deleting,
        md5DeletedOk,
        md5,

        md5sErrorMessage,

        // methods
        md5sAsync,
        md5sClear,
        
        md5Async,
        md5CreateAsync,
        md5SaveAsync,
        md5DeleteAsync,
        md5Clear,
    }
};
