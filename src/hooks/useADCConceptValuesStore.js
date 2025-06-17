import { useDispatch, useSelector } from "react-redux";

import {
    onADCConceptValuesLoading,
    setADCConceptValues,

    onADCConceptValueLoading,
    setADCConceptValue,
    clearADCConceptValues,

    onADCConceptValueCreating,
    isADCConceptValueCreated,
    onADCConceptValueSaving,
    isADCConceptValueSaved,
    onADCConceptValueDeleting,
    isADCConceptValueDeleted,

    setADCConceptValuesErrorMessage,
    clearADCConceptValuesErrorMessage,
    clearADCConceptValue,
} from "../store/slices/adcConceptValuesSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const ADC_SITE_URL = '/adcConceptValues'; 
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.ADCConceptID ? `&adcconceptid=${options.ADCConceptID}` : '';
    query += options?.ADCSiteID ? `&adcsiteid=${options.ADCSiteID}` : '';
    query += options?.Text ? `&text=${options.Text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useADCConceptValuesStore = () => {
    const dispatch = useDispatch();
    const {
        isADCConceptValuesLoading,
        adcConceptValues,
        adcConceptValuesMeta,

        isADCConceptValueLoading,
        isADCConceptValueCreating,
        adcConceptValueCreatedOk,
        isADCConceptValueSaving,
        adcConceptValueSavedOk,
        isADCConceptValueDeleting,
        adcConceptValueDeletedOk,
        adcConceptValue,

        adcConceptValuesErrorMessage
    } = useSelector(state => state.adcConceptValues)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setADCConceptValuesErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setADCConceptValuesErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearADCConceptValuesErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {StandardID, Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const adcConceptValuesAsync = async (options = {}) => {
        dispatch(onADCConceptValuesLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${ADC_SITE_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setADCConceptValues({
                adcConceptValues: Data,
                adcConceptValuesMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const adcConceptValuesClear = () => {
        dispatch(clearADCConceptValues());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const adcConceptValueAsync = async (id) => {
        dispatch(onADCConceptValueLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${ADC_SITE_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setADCConceptValue(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada a la compañia
     */
    const adcConceptValueCreateAsync = async (item) => {
        dispatch(onADCConceptValueCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(ADC_SITE_URL, params);
            const { Data } = await resp.data;

            dispatch(setADCConceptValue(Data));
            dispatch(isADCConceptValueCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, LegalEntity, COID, Status, UpdatedUser} item Objeto tipo ADCConceptValue
     */
    const adcConceptValueSaveAsync = async (item) => {
        dispatch(onADCConceptValueSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${ADC_SITE_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setADCConceptValue(Data));
            dispatch(isADCConceptValueSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const adcConceptValueDeleteAsync = async (id) => {
        dispatch(onADCConceptValueDeleting());

        const toDelete = {
            ADCConceptValueID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${ADC_SITE_URL}/${id}`, { data: toDelete });
            dispatch(isADCConceptValueDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const adcConceptValueClear = () => {
        dispatch(clearADCConceptValue());
    }

    return {
        // properties
        isADCConceptValuesLoading,
        adcConceptValues,
        adcConceptValuesMeta,

        isADCConceptValueLoading,
        isADCConceptValueCreating,
        adcConceptValueCreatedOk,
        isADCConceptValueSaving,
        adcConceptValueSavedOk,
        isADCConceptValueDeleting,
        adcConceptValueDeletedOk,
        adcConceptValue,

        adcConceptValuesErrorMessage,

        // methods
        adcConceptValuesAsync,
        adcConceptValuesClear,
        
        adcConceptValueAsync,
        adcConceptValueCreateAsync,
        adcConceptValueSaveAsync,
        adcConceptValueDeleteAsync,
        adcConceptValueClear,
    }
};
