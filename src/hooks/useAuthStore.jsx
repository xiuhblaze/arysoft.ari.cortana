import { useDispatch, useSelector } from "react-redux";
import envVariables from "../helpers/envVariables";
import { clearAuthErrorMessage, onChecking, onLogin, onLogout, setAuthErrorMessage } from "../store/slices/authslice";

const { USER_TOKEN } = envVariables();

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const {
    status,
    user,
    userErrorMessage,
  } = useSelector(state => state.auth);


  // Methods

  const setError = (message) => {
    if (message.length === 0) return;
    dispatch(setAuthErrorMessage(message));
    setTimeout(() => {
      dispatch(clearAuthErrorMessage())
    }, 10);
  };

  const setUserInfo = (token) => {

    const user = {
      id: Date.now(),
      username: token.username,
      givename: token.username,
      role: 'admin',
    };

    return user;
  };


  const checkAuthToken = () => {
    const token = JSON.parse(localStorage.getItem(USER_TOKEN)) || null;

    if (!token) return dispatch(onLogout());
    //* Falta la real validación del token y hacia la API para comprobar su vigencia
    dispatch(onLogin(token));
  };

  const loginASync = async ({ username, password }) => {
    dispatch(onChecking());

    try {
      //* Aqui va la consulta a la Api
      if (username === 'adrian.castillo' && password === '123') {
        const user = setUserInfo({ username });
        localStorage.setItem(USER_TOKEN, JSON.stringify(user));
        dispatch(onLogin(user));
      } else {
        throw new Error('El usuario y/o su contraseña no existen');
      }
    } catch (error) {
      //console.error(`${error.name}: ${error.message}`);
      setError(error.message);
      dispatch(onLogout());
    }
  };

  const logout = () => {
    localStorage.clear();
    //setError('Sesión finalizada');
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