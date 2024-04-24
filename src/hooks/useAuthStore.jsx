import { useDispatch, useSelector } from "react-redux";
import envVariables from "../helpers/envVariables";
import { clearAuthErrorMessage, onChecking, onLogin, onLogout, setAuthErrorMessage } from "../store/slices/authslice";
import cortanaApi from '../api/cortanaApi';
import { jwtDecode } from "jwt-decode";
import getErrorMessages from "../helpers/getErrorMessages";


const { VITE_TOKEN } = envVariables();

export const useAuthStore = () => {

    // HOOKS 

    const dispatch = useDispatch();
    const {
        status,
        user,
        userErrorMessage,
    } = useSelector(state => state.auth);

    // METHODS

    const setError = (message) => {
        if (message.length === 0) return;
        dispatch(setAuthErrorMessage(message));
        setTimeout(() => {
            dispatch(clearAuthErrorMessage())
        }, 10);
    };

    const setUserInfo = (token) => {
        const userInfo = jwtDecode(token);
        const user = {
            id: userInfo.userid,
            username: userInfo.username,
            givename: userInfo.username,
            role: 'admin',
        };

        return user;
    };

    const checkAuthToken = () => {
        const token = localStorage.getItem(VITE_TOKEN) || null;

        if (!token) return dispatch(onLogout());

        try {
            const user = setUserInfo(token);

            // TODO: Falta refrescar el token
            if (!user) {
                localStorage.removeItem(VITE_TOKEN);
                throw new Error('Session was expired');
            }
            localStorage.setItem(VITE_TOKEN, token);
            dispatch(onLogin(user));

        } catch (error) {
            console.log(error);
            const message = getErrorMessages(error);
            setError(message);
            dispatch(onLogout());
        }
    };

    const loginASync = async (values) => {
        dispatch(onChecking());

        try {
            const result = await cortanaApi.post('/auth', values);
            const token = result.data.Data;
            const user = setUserInfo(token);
            localStorage.setItem(VITE_TOKEN, JSON.stringify(token));
            dispatch(onLogin(user));
        } catch (error) {
            const message = getErrorMessages(error);
            setError(message);
            dispatch(onLogout());
        }
    };

    const logout = () => {
        localStorage.clear();
        setError('Sesión finalizada');
        dispatch(onLogout());
    };

    return {
        status,
        user,
        userErrorMessage,

        checkAuthToken,
        loginASync,
        logout,
    }
};