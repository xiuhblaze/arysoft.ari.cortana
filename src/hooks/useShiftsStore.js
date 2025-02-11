import { useDispatch, useSelector } from "react-redux";

import {
    onShiftsLoading,
    setShifts,

    onShiftLoading,
    setShift,
    clearShifts,

    onShiftCreating,
    isShiftCreated,
    onShiftSaving,
    isShiftSaved,
    onShiftDeleting,
    isShiftDeleted,

    setShiftsErrorMessage,
    clearShiftsErrorMessage,
    clearShift,
} from "../store/slices/shiftsSlice";

import envVariables from "../helpers/envVariables";
//import enums from "../helpers/enums";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const SHIFT_URI = '/shifts';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.siteID ? `&siteid=${options.siteID}` : '';
    query += options?.type ? `&type=${options.type}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useShiftsStore = () => {
    const dispatch = useDispatch();
    const {
        isShiftsLoading,
        shifts,
        shiftsMeta,

        isShiftLoading,
        isShiftCreating,
        shiftCreatedOk,
        isShiftSaving,
        shiftSavedOk,
        isShiftDeleting,
        shiftDeletedOk,
        shift,

        shiftsErrorMessage
    } = useSelector(state => state.shifts)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setShiftsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setShiftsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearShiftsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {Type, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const shiftsAsync = async (options = {}) => {
        dispatch(onShiftsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${SHIFT_URI}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setShifts({
                shifts: Data,
                shiftsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const shiftsClear = () => {
        dispatch(clearShifts());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const shiftAsync = async (id) => {
        dispatch(onShiftLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${SHIFT_URI}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setShift(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {OrganizationID} identificador de la organizacion asociada al shifto
     */
    const shiftCreateAsync = async (item) => {
        dispatch(onShiftCreating());

        try {
            const params = {
                //OrganizationID: item.OrganizationID,
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(SHIFT_URI, params);
            const { Data } = await resp.data;

            dispatch(setShift(Data));
            dispatch(isShiftCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Name, Description, Status, UpdatedUser} item Objeto tipo Shift
     */
    const shiftSaveAsync = async (item) => {
        dispatch(onShiftSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }
        try {
            const resp = await cortanaApi.put(`${SHIFT_URI}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setShift(Data));
            dispatch(isShiftSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const shiftDeleteAsync = async (id) => {
        dispatch(onShiftDeleting());

        const toDelete = {
            ShiftID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${SHIFT_URI}/${id}`, { data: toDelete });
            dispatch(isShiftDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const shiftClear = () => {
        dispatch(clearShift());
    }

    return {
        // properties
        isShiftsLoading,
        shifts,
        shiftsMeta,

        isShiftLoading,
        isShiftCreating,
        shiftCreatedOk,
        isShiftSaving,
        shiftSavedOk,
        isShiftDeleting,
        shiftDeletedOk,
        shift,

        shiftsErrorMessage,

        // methods
        shiftsAsync,
        shiftsClear,
        
        shiftAsync,
        shiftCreateAsync,
        shiftSaveAsync,
        shiftDeleteAsync,
        shiftClear,
    }
};
