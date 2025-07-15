import { createContext, useContext, useMemo, useReducer } from 'react';
import enums from '../../../helpers/enums';

const ADCContext = createContext(null);

const ADCControllerProvider = ({ children }) => {

    const {
        ADCConceptUnitType
    } = enums();

    const initialState = {
        adcData: null,
        adcSitesList: [],
        adcConceptsList: [],
    } // initialState

    const updateADCConceptValue = (state, value) => {
        const {adcConceptValueID, checkValue, newValue } = value;
        const newADCSitesList = state.adcSitesList.map(adcSite => {
            let totalInitial = adcSite.InitialMD5;

            if (adcSite.ADCConceptValues.length > 0) {                
                const newADCConceptValuesList = adcSite.ADCConceptValues.map(adccvItem => {
                    
                    if (adccvItem.ID == adcConceptValueID) {
                        return {
                            ...adccvItem,
                            CheckValue: checkValue ?? false,
                            Value: newValue ?? 0,
                        };
                    }
                    return adccvItem
                });

                const surveillance = Math.floor((totalInitial / 3) * 10) / 10;

                return {
                    ...adcSite,
                    TotalInitial: totalInitial,
                    Surveillance: surveillance,
                    ADCConceptValues: newADCConceptValuesList,
                };
            }
            return adcSite;
        });

        return newADCSitesList;
    }; // updateADCConceptValue

    const updateTotals = (state) => {
        // Procesar todos los valores del ADC y calcular los totales

        const { acdData, adcSitesList } = state;
        let totalInitial = 0;
        let totalEmployees = 0;
        let totalMD11 = 0;
        let totalSurveillance = 0;
        let totalRR = 0;
        
        const newADCSitesList = adcSitesList.map(adcSite => {
            let totalDays = adcSite.InitialMD5;

            adcSite.ADCConceptValues.forEach(adccvItem => { // Procesar para hacer Decrementos
                const myConcept = state.adcConceptsList.find(ac => ac.ID == adccvItem.ADCConceptID);

                if ((myConcept.WhenTrue && !adccvItem.CheckValue && !!myConcept.Decrease) 
                    || (!myConcept.WhenTrue && adccvItem.CheckValue && !!myConcept.Decrease)) {

                    if (adccvItem.ValueUnit == ADCConceptUnitType.percentage) {
                        totalDays = totalDays - (totalDays * (adccvItem.Value / 100));
                    } else if (adccvItem.ValueUnit == ADCConceptUnitType.days) {
                        totalDays = totalDays - adccvItem.Value;
                    }
                }
                
            }); //! PROBAR ESTO. aquí me quedé... (ah falta cargar los datos de los conceptos)
            
            // aqui va a continuar con los incrementos...

            totalInitial += totalDays;

            return {
                ...adcSite,
                TotalInitial: totalDays,
            };
        });

        const newADCData = {
            ...acdData,
            TotalEmployees: totalEmployees,
            TotalMD11: totalMD11,
            TotalSurveillance: totalSurveillance,
            TotalRR: totalRR,
        }

        return {
            adcData: newADCData,
            adcSitesList: newADCSitesList,
        };
    }; // updateTotals

    // REDUCER

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_ADC_DATA': {
                return { ...state, adcData: action.value };
            }
            case 'SET_ADC_SITES_LIST': {
                return { ...state, adcSitesList: action.value };
            }
            case 'UPDATE_ADC_CONCEPT_VALUE': {
                const newState = updateTotals({
                    ...state, 
                    adcSitesList: updateADCConceptValue(state, action.value)
                })
                return { ...newState };
            }
            case 'UPDATE_TOTALS': {
                const newState = updateTotals(state);
                return { ...newState };
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
const clearADCController = (dispatch) => dispatch({ type: "CLEAR_CONTROLLER" });

const updateADCConceptValue = (dispatch, value) => dispatch({ type: "UPDATE_ADC_CONCEPT_VALUE", value });
const updateTotals = (dispatch) => dispatch({ type: "UPDATE_TOTALS" });

export { 
    ADCControllerProvider, 
    useADCController,
    setADCData,
    setADCSitesList,
    clearADCController,

    updateADCConceptValue,
    updateTotals,
};