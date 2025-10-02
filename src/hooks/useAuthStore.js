import { useDispatch, useSelector } from "react-redux";
import envVariables from "../helpers/envVariables";
import { 
    clearAuthErrorMessage, 
    clearUserSettings, 
    onChecking, 
    onLogin,
    onLogout, 
    setAuthErrorMessage, 
    setUserSettings,
} from "../store/slices/authslice";
import cortanaApi from '../api/cortanaApi';
import { jwtDecode } from "jwt-decode";
import getError from "../helpers/getError";
import { compareAsc } from "date-fns";
import isString from "../helpers/isString";
import isNullOrEmpty from "../helpers/isNullOrEmpty";
import enums from "../helpers/enums";

const AUTH_URL = '/auth';
const USER_SETTINGS_URL = '/userSettings';
const { UserSettingSearchModeType } = enums();
const { 
    VITE_TOKEN, 
    VITE_USER_SETTINGS 
} = envVariables();

export const useAuthStore = () => {

    const ROLES = Object.freeze({
        admin: 'admin',
        editor: 'editor',
        auditor: 'auditor',
        readonly: 'readonly',
        sales: 'sales',
    });

    // HOOKS 

    const dispatch = useDispatch();
    const {
        status,
        user,
        userSettings,
        userErrorMessage,
    } = useSelector(state => state.auth);

    // METHODS

    const setError = (value) => {    
        if (isString(value)) {
            dispatch(setAuthErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setAuthErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }            
        setTimeout(() => {
            dispatch(clearAuthErrorMessage());
        }, 10);
    }; // setError

    const setUserInfo = (token) => {
        const userInfo = jwtDecode(token);        
        const user = {
            id: userInfo.nameid,
            username: userInfo.unique_name,
            givename: userInfo.given_name,
            useremail: userInfo.email,
            roles: userInfo.role,
            exp: new Date(userInfo.exp * 1000).getTime(),
        };

        return user;
    }; // setUserInfo

    const getUserSettingsAsync = async (id) => {
        try {
            const resp = await cortanaApi.get(`${USER_SETTINGS_URL}?userid=${id}`);
            const { Data } = await resp.data;

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }; // getUserSettingsAsync

    //* Export Methods

    const checkAuthToken = () => {
        const token = localStorage.getItem(VITE_TOKEN) || null;
        const userSettings = localStorage.getItem(VITE_USER_SETTINGS) || null;

        if (!token) {
            dispatch(clearUserSettings());
            dispatch(onLogout());
            return ;
        } 

        try {
            const user = setUserInfo(token);

            if (compareAsc(user.exp, new Date().getTime()) < 0) {
                throw new Error('La sesión ha expirado, ingrese nuevamente sus credenciales');
            }

            // TODO: Falta refrescar el token
            if (!user) { // Creo que aquí nunca entra
                localStorage.removeItem(VITE_TOKEN);
                localStorage.removeItem(VITE_USER_SETTINGS);
                console.log('Session was expired - creo que aquí nunca entra');
                throw new Error('Session was expired');
            }
            localStorage.setItem(VITE_TOKEN, token);            
            dispatch(setUserSettings(JSON.parse(userSettings)));
            dispatch(onLogin(user));

        } catch (error) {
            // console.log(error); // Oculto temporalmente, creo que no lo wa dejar aquí
            const message = getError(error);
            setError(message);
            dispatch(clearUserSettings());
            dispatch(onLogout());
        }
    }; // checkAuthToken

    const loginASync = async (values) => {
        dispatch(onChecking());

        try {
            const result = await cortanaApi.post(AUTH_URL, values);
            const token = result.data.Data;
            const user = setUserInfo(token);
            const userSettings = await getUserSettingsAsync(user.id);

            //localStorage.setItem(VITE_TOKEN, token) // Lo envié hacia abajo para que primero se limpie el localStorage

            if (!!userSettings && Array.isArray(userSettings) && userSettings.length > 0) {
                const settings = JSON.parse(userSettings[0].Settings);
                const allSettings = {
                    ...settings,
                    ID: userSettings[0].ID,
                }
                setUserSettingsLocalStorage(allSettings); // Esta linea susituye las dos siguientes
                // localStorage.setItem(VITE_USER_SETTINGS, JSON.stringify(allSettings));
                // dispatch(setUserSettings(allSettings));
                switch (settings.searchMode) {
                    case UserSettingSearchModeType.onScreen:
                        //console.log('onScreen - borrar localStorage y no guardar en localStorage');
                        localStorage.clear();
                        break;
                    case UserSettingSearchModeType.onSession:                        
                        //console.log('onSession - borrar localStorage');
                        localStorage.clear();
                        break;
                    case UserSettingSearchModeType.indefinitely:
                        //console.log('indefinitely - utilizar como está actualmente');
                        break;
                }
            } else {
                localStorage.removeItem(VITE_USER_SETTINGS);
                dispatch(clearUserSettings());
            }
            
            localStorage.setItem(VITE_TOKEN, token);
            dispatch(onLogin(user));
        } catch (error) {
            const message = getError(error);
            setError(message);
            dispatch(clearUserSettings());
            dispatch(onLogout());
        }
    }; // loginASync

    const logout = () => {
        localStorage.clear();
        dispatch(clearUserSettings());
        setError('Session ended');
        dispatch(onLogout());
    }; // logout

    const changePasswordAsync = async (values) => {

        if (!user) {
            setError('The user must be loaded first');
            return;
        }

        const toChangePwd = {
            ...values,
            ID: user.id,
        }

        try {
            const resp = await cortanaApi.put(`${AUTH_URL}/change-password`, toChangePwd);
            const { Data } = await resp.data;

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // changePasswordAsync

    const validatePasswordAsync = async (password) => {

        if (!user) {
            setError('The user must be loaded first');
            return;
        }

        const toValidate = {
            ID: user.id,
            Password: password,
        }

        try {
            const resp = await cortanaApi.post(`${AUTH_URL}/${user.id}/validate`, toValidate);
            const { Data } = await resp.data;

            return Data;
        } catch (error) {
            const message = getError(error);
            setError(message);
        }

        return null;
    }; // validatePasswordAsync

    /**
     * Si existe un usuario con el rol especificado
     * @param {string} role
     * @returns true if the user has the specified role
     */
    const hasRole = (role) => {

        if (!user) return false;

        if (user.roles != null) {
            if (Array.isArray(user.roles)) {
                return user.roles.some(r => r.toLowerCase() == role.toLowerCase());
            } else if (!isNullOrEmpty(user.roles)) {
                return user.roles.toLowerCase() == role.toLowerCase();
            } 
        }

        return false;
    }; // hasRole

    const setUserSettingsLocalStorage = (settings) => {

        localStorage.setItem(VITE_USER_SETTINGS, JSON.stringify(settings));
        dispatch(setUserSettings(settings));
    }; // setUserSettingsLocalStorage

    return {
        ROLES,
        
        status,
        user,
        userSettings,
        userErrorMessage,

        changePasswordAsync,
        checkAuthToken,
        hasRole,
        loginASync,
        logout,
        validatePasswordAsync,
        setUserSettingsLocalStorage,
    }
};