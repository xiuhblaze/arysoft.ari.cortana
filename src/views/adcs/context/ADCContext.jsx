import { createContext, useContext, useMemo, useReducer } from 'react';

const ADCContext = createContext(null);

const ADCControllerProvider = ({ children }) => {

    const initialState = {
        adcData: null,
        adcSitesList: [],
        adcConceptValuesList: [],
    }

    // REDUCER

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_ADC_DATA': {
                return { ...state, adcData: action.value };
            }
            case 'SET_ADC_SITES_LIST': {
                return { ...state, adcSitesList: action.value };
            }
            case 'SET_ADC_CONCEPT_VALUES_LIST': {
                return { ...state, adcConceptValuesList: action.value };
            }
            case 'CLEAR_CONTROLLER': {
                return { ...initialState };
            }
            default: {
                throw new Error(`Unhandled action type: ${action.type}`);
            }
        }
    };

    const [adcController, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [adcController, dispatch], [adcController, dispatch]);

    return <ADCContext.Provider value={ value }>{ children }</ADCContext.Provider>;
}; // ADCControllerProvider

const useADCController = () => {
    const context = useContext(ADCContext);

    if (!context) {
        throw new Error('useADCController must be used within a ADCControllerProvider');
    }

    return context;
}; // useADCController

const setADCData = (dispatch, value) => dispatch({ type: "SET_ADC_DATA", value });
const setADCSitesList = (dispatch, value) => dispatch({ type: "SET_ADC_SITES_LIST", value });
const setADCConceptValuesList = (dispatch, value) => dispatch({ type: "SET_ADC_CONCEPT_VALUES_LIST", value });
const clearADCController = (dispatch) => dispatch({ type: "CLEAR_CONTROLLER" });

export { 
    ADCControllerProvider, 
    useADCController,
    setADCData,
    setADCSitesList,
    setADCConceptValuesList,
    clearADCController,
};