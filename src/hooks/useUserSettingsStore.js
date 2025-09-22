import { useDispatch, useSelector } from "react-redux";

import {
    onUserSettingsLoading,
    setUserSettings,

    onUserSettingLoading,
    setUserSetting,
    clearUserSettings,

    onUserSettingCreating,
    isUserSettingCreated,
    onUserSettingSaving,
    isUserSettingSaved,
    onUserSettingDeleting,
    isUserSettingDeleted,

    setUserSettingsErrorMessage,
    clearUserSettingsErrorMessage,
    clearUserSetting,
} from "../store/slices/userSettingsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const USER_SETTINGS_URL = '/userSettings'; 
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.UserID ? `&userid=${options.UserID}` : '';
    query += options?.Text ? `&text=${options.Text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
};

export const useUserSettingsStore = () => {
    const dispatch = useDispatch();
    const {
        isUserSettingsLoading,
        userSettings,
        userSettingsMeta,

        isUserSettingLoading,
        isUserSettingCreating,
        userSettingCreatedOk,
        isUserSettingSaving,
        userSettingSavedOk,
        isUserSettingDeleting,
        userSettingDeletedOk,
        userSetting,

        userSettingsErrorMessage
    } = useSelector(state => state.userSettings)

    const { user } = useSelector(state => state.auth);

    // Methods

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setUserSettingsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setUserSettingsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearUserSettingsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {ADCSiteID, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const userSettingsAsync = async (options = {}) => {
        dispatch(onUserSettingsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${USER_SETTINGS_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setUserSettings({
                userSettings: Data,
                userSettingsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const userSettingsClear = () => {
        dispatch(clearUserSettings());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const userSettingAsync = async (id) => {
        dispatch(onUserSettingLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${USER_SETTINGS_URL}/${id}`);
            const { Data } = await resp.data;
            
            dispatch(setUserSetting(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {ADCSiteID} identificador del sitio en el ADC asociado
     */
    const userSettingCreateAsync = async (item) => {
        dispatch(onUserSettingCreating());

        try {
            const toCreate = {
                ...item,
                UpdatedUser: user.username,
            };
//console.log('userSettingCreateAsync.toCreate', toCreate);
            const resp = await cortanaApi.post(USER_SETTINGS_URL, toCreate);
            const { Data } = await resp.data;

            dispatch(setUserSetting(Data));
            dispatch(isUserSettingCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Llama al endpoint para actualizar la información de un registro existente en la base de datos
     * @param {ID, Value, AuditStep, Status, UpdatedUser} item Objeto tipo UserSetting
     */
    const userSettingSaveAsync = async (item) => {
        dispatch(onUserSettingSaving());

        try {
            const toSave = {
                ...item,
                UpdatedUser: user.username,
            }
//console.log('userSettingSaveAsync.toSave', toSave);
            const resp = await cortanaApi.put(`${USER_SETTINGS_URL}/${toSave.ID}`, toSave);
            const { Data } = await resp.data;

            dispatch(setUserSetting(Data));
            dispatch(isUserSettingSaved());
        } catch (error) {
            const message = getError(error);
            console.log('userSettingSaveAsync.error', message);
            setError(message);
        }
    }; // userSettingSaveAsync

    /**
     * Llama al endpoint para actualizar una lista de registros existentes en la base de datos
     * @param {array of UserSettingItemUpdateDto} list 
     */
    const userSettingSaveListAsync = async (list) => {
        dispatch(onUserSettingSaving());

        const toSaveList = {
            Items: list.map(item => {
                return {
                    ...item,
                    UpdatedUser: user.username,
                }
            }),
        }

        try {
            const resp = await cortanaApi.put(`${USER_SETTINGS_URL}/list`, toSaveList);
            await resp.data;
            
            // const { Data } = await resp.data;
            // console.log('Data', Data);

            dispatch(isUserSettingSaved());
        } catch (error) {
            const message = getError(error);
            console.log('userSettingSaveListAsync.error', message);
            setError(message);
        }
    }; // userSettingSaveListAsync

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const userSettingDeleteAsync = async (id) => {
        dispatch(onUserSettingDeleting());

        const toDelete = {
            UserSettingID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${USER_SETTINGS_URL}/${id}`, { data: toDelete });
            dispatch(isUserSettingDeleted());
        } catch (error) {
            //console.log(error);
            const message = getError(error);
            setError(message);
        }
    }

    const userSettingClear = () => {
        dispatch(clearUserSetting());
    }

    return {
        // properties
        isUserSettingsLoading,
        userSettings,
        userSettingsMeta,

        isUserSettingLoading,
        isUserSettingCreating,
        userSettingCreatedOk,
        isUserSettingSaving,
        userSettingSavedOk,
        isUserSettingDeleting,
        userSettingDeletedOk,
        userSetting,

        userSettingsErrorMessage,

        // methods
        userSettingsAsync,
        userSettingsClear,
        
        userSettingAsync,
        userSettingCreateAsync,
        userSettingSaveAsync,
        userSettingSaveListAsync,
        userSettingDeleteAsync,
        userSettingClear,
    }
};
