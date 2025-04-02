import { createContext, useContext, useMemo, useReducer } from 'react';

const AppFormContext = createContext(null);

const AppFormControllerProvider = ({ children }) => {

    const initialState = {
        standardData: null,
        contactsList: [],        
        nacecodesList: [],
        sitesList: [],
    }

    // REDUCER

    const reducer = (state, action) => {
        switch (action.type) {
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

const setStandardData = (dispatch, value) => dispatch({ type: "SET_STANDARD_DATA", value });
const setContactsList = (dispatch, value) => dispatch({ type: "SET_CONTACTS_LIST", value });
const setNacecodesList = (dispatch, value) => dispatch({ type: "SET_NACECODES_LIST", value });
const setSitesList = (dispatch, value) => dispatch({ type: "SET_SITES_LIST", value });


export { 
    AppFormControllerProvider, 
    useAppFormController,
    setStandardData,
    setContactsList,
    setNacecodesList,
    setSitesList,
};