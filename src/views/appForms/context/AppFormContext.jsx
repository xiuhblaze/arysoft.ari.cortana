import { createContext, useContext, useMemo, useReducer } from 'react';

const AppFormContext = createContext(null);

const AppFormControllerProvider = ({ children }) => {

    const initialState = {
        organizationData: null,
        standardData: null,
        contactsList: [],        
        nacecodesList: [],
        sitesList: [],
    }

    // REDUCER

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_ORGANIZATION_DATA': {
                return { ...state, organizationData: action.value };
            }
            case 'SET_STANDARD_DATA': {
                return { ...state, standardData: action.value };
            }
            case 'SET_CONTACTS_LIST': {
                return { ...state, contactsList: action.value };
            }
            case 'SET_NACECODES_LIST': {
                return { ...state, nacecodesList: action.value };
            }
            case 'SET_SITES_LIST': {
                return { ...state, sitesList: action.value };
            }
            case 'CLEAR_CONTROLLER': {
                return { ...initialState };
            }
            default: {
                throw new Error(`Unhandled action type: ${action.type}`);
            }
        }
    };

    const [appFormController, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [appFormController, dispatch], [appFormController, dispatch]);

    return <AppFormContext.Provider value={ value }>{ children }</AppFormContext.Provider>;
}; // AppFormControllerProvider

const useAppFormController = () => {
    const context = useContext(AppFormContext);

    if (!context) {
        throw new Error('useAppFormController must be used within a AppFormControllerProvider');
    }

    return context;
}; // useAppFormController

const setOrganizationData = (dispatch, value) => dispatch({ type: "SET_ORGANIZATION_DATA", value });
const setStandardData = (dispatch, value) => dispatch({ type: "SET_STANDARD_DATA", value });
const setContactsList = (dispatch, value) => dispatch({ type: "SET_CONTACTS_LIST", value });
const setNacecodesList = (dispatch, value) => dispatch({ type: "SET_NACECODES_LIST", value });
const setSitesList = (dispatch, value) => dispatch({ type: "SET_SITES_LIST", value });
const clearAppFormController = (dispatch) => dispatch({ type: "CLEAR_CONTROLLER" });

export { 
    AppFormControllerProvider, 
    useAppFormController,
    setOrganizationData,
    setStandardData,
    setContactsList,
    setNacecodesList,
    setSitesList,
    clearAppFormController,
};