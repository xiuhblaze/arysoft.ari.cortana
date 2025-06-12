import { useDispatch, useSelector } from "react-redux";

import {
    onADCsLoading,
    setADCs,

    onADCLoading,
    setADC,
    clearADCs,

    onADCCreating,
    isADCCreated,
    onADCSaving,
    isADCSaved,
    onADCDeleting,
    isADCDeleted,

    setADCsErrorMessage,
    clearADCsErrorMessage,
    clearADC,
} from "../store/slices/adcsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const ADC_URL = '/adcs';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.appFormID ? `&appformid=${options.appFormID}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useADCsStore = () => {
    const dispatch = useDispatch();
    const {
        isADCsLoading,
        adcs,
        adcsMeta,

        isADCLoading,
        isADCCreating,
        adcCreatedOk,
        isADCSaving,
        adcSavedOk,
        isADCDeleting,
        adcDeletedOk,
        adc,

        adcsErrorMessage
    } = useSelector(state => state.adcs)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {
        if (isString(value)) {
            dispatch(setADCsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setADCsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearADCsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {AppFormID, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const adcsAsync = async (options = {}) => {
        dispatch(onADCsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${ADC_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setADCs({
                adcs: Data,
                adcsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const adcsClear = () => {
        dispatch(clearADCs());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const adcAsync = async (id) => {
        dispatch(onADCLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${ADC_URL}/${id}`);
            const { Data } = await resp.data;

            dispatch(setADC(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {appFormID} identificador del Application Form asociada al adc
     */
    const adcCreateAsync = async (item) => {
        dispatch(onADCCreating());

        try {
            const params = {
                //AppFormID: item.AppFormID,
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(ADC_URL, params);
            const { Data } = await resp.data;

            dispatch(setADC(Data));
            dispatch(isADCCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    // /**
    //  * Llama al endpoint para actualizar la información de un registro existente en la base de datos
    //  * @param {ID, Name, Description, Status, UpdatedUser} item Objeto tipo ADC
    //  */
    const adcSaveAsync = async (item) => {
        dispatch(onADCSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${ADC_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setADC(Data));
            dispatch(isADCSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const adcDeleteAsync = async (id) => {
        dispatch(onADCDeleting());

        const toDelete = {
            ADCID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${ADC_URL}/${id}`, { data: toDelete });

            console.log('adcDeleteAsync.resp', resp);

            dispatch(isADCDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const adcClear = () => {
        dispatch(clearADC());
    }

    return {
        // properties
        isADCsLoading,
        adcs,
        adcsMeta,

        isADCLoading,
        isADCCreating,
        adcCreatedOk,
        isADCSaving,
        adcSavedOk,
        isADCDeleting,
        adcDeletedOk,
        adc,

        adcsErrorMessage,

        // methods
        adcsAsync,      // plural
        adcsClear,
        
        adcAsync,       // singular
        adcCreateAsync,
        adcSaveAsync,
        adcDeleteAsync,
        adcClear,
    }
};
