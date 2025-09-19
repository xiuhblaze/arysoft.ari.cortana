import { createContext, useContext, useMemo, useReducer } from "react";

const ArysoftUI = createContext(null);

const reducer = (state, action) => {
    switch (action.type) {
        case "MINI_SIDENAV": {
            return { ...state, miniSidenav: action.value };
        }
        case "TRANSPARENT_SIDENAV": {
            return { ...state, transparentSidenav: action.value };
        }
        case "SIDENAV_COLOR": {
            return { ...state, sidenavColor: action.value };
        }
        case "TRANSPARENT_NAVBAR": {
            return { ...state, transparentNavbar: action.value };
        }
        case "FIXED_NAVBAR": {
            return { ...state, fixedNavbar: action.value };
        }
        case "OPEN_CONFIGURATOR": {
            return { ...state, openConfigurator: action.value };
        }
        case "LAYOUT": {
            return { ...state, layout: action.value };
        }
        case "NAVBAR_TITLE": {
            return { ...state, navbarTitle: action.value };
        }
        case "HELP_CONTENT": {
            return { ...state, helpContent: action.value };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}; // reducer

const ArysoftUIControllerProvider = ({ children }) => {
    const initialState = {
        fixedNavbar: true,
        helpContent: null,
        layout: "dashboard",
        miniSidenav: false,
        navbarTitle: null,
        openConfigurator: false,
        sidenavColor: "primary",
        transparentNavbar: true,
        transparentSidenav: true,
    };

    const [controller, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

    return <ArysoftUI.Provider value={value}>{children}</ArysoftUI.Provider>;
}; // ArysoftUIControllerProvider

const useArysoftUIController = () => {
    const context = useContext(ArysoftUI);

    if (!context) {
        throw new Error('useArysoftUIController solo puede ser usado dentro de ArysoftUIControllerProvider');
    }

    return context;
}; // useArysoftUIController

const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setHelpContent = (dispatch, value) => dispatch({ type: "HELP_CONTENT", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setNavbarTitle = (dispatch, value) => dispatch({ type: "NAVBAR_TITLE", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });

export {
    ArysoftUIControllerProvider,
    useArysoftUIController,
    setFixedNavbar,
    setHelpContent,
    setLayout,
    setMiniSidenav,
    setNavbarTitle,
    setOpenConfigurator,
    setSidenavColor,
    setTransparentNavbar,
    setTransparentSidenav,
};