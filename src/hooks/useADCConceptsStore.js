import { useDispatch, useSelector } from "react-redux";

import {
    onADCConceptsLoading,
    setADCConcepts,

    onADCConceptLoading,
    setADCConcept,
    clearADCConcepts,

    onADCConceptCreating,
    isADCConceptCreated,
    onADCConceptSaving,
    isADCConceptSaved,
    onADCConceptDeleting,
    isADCConceptDeleted,

    setADCConceptsErrorMessage,
    clearADCConceptsErrorMessage,
    clearADCConcept,
} from "../store/slices/adcConceptsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const ADC_CONCEPT_URL = '/adcConcepts'; 
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.StandardID ? `&standardid=${options.StandardID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useADCConceptsStore = () => {
    const dispatch = useDispatch();
    const {
        isADCConceptsLoading,
        adcConcepts,
        adcConceptsMeta,

        isADCConceptLoading,
        isADCConceptCreating,
        adcConceptCreatedOk,
        isADCConceptSaving,
        adcConceptSavedOk,
        isADCConceptDeleting,
        adcConceptDeletedOk,
        adcConcept,

        adcConceptsErrorMessage
    } = useSelector(state => state.adcConcepts)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setADCConceptsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setADCConceptsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearADCConceptsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {StandardID, Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const adcConceptsAsync = async (options = {}) => {
        dispatch(onADCConceptsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${ADC_CONCEPT_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setADCConcepts({
                adcConcepts: Data,
                adcConceptsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const adcConceptsClear = () => {
        dispatch(clearADCConcepts());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const adcConceptAsync = async (id) => {
        dispatch(onADCConceptLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${ADC_CONCEPT_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setADCConcept(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada a la compañia
     */
    const adcConceptCreateAsync = async (item) => {
        dispatch(onADCConceptCreating());

        try {
            const params = {
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(ADC_CONCEPT_URL, params);
            const { Data } = await resp.data;

            dispatch(setADCConcept(Data));
            dispatch(isADCConceptCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, LegalEntity, COID, Status, UpdatedUser} item Objeto tipo ADCConcept
     */
    const adcConceptSaveAsync = async (item) => {
        dispatch(onADCConceptSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${ADC_CONCEPT_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setADCConcept(Data));
            dispatch(isADCConceptSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const adcConceptDeleteAsync = async (id) => {
        dispatch(onADCConceptDeleting());

        const toDelete = {
            ADCConceptID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${ADC_CONCEPT_URL}/${id}`, { data: toDelete });
            dispatch(isADCConceptDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const adcConceptClear = () => {
        dispatch(clearADCConcept());
    }

    return {
        // properties
        isADCConceptsLoading,
        adcConcepts,
        adcConceptsMeta,

        isADCConceptLoading,
        isADCConceptCreating,
        adcConceptCreatedOk,
        isADCConceptSaving,
        adcConceptSavedOk,
        isADCConceptDeleting,
        adcConceptDeletedOk,
        adcConcept,

        adcConceptsErrorMessage,

        // methods
        adcConceptsAsync,
        adcConceptsClear,
        
        adcConceptAsync,
        adcConceptCreateAsync,
        adcConceptSaveAsync,
        adcConceptDeleteAsync,
        adcConceptClear,
    }
};
