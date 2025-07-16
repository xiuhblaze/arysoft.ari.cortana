import { createContext, useContext, useMemo, useReducer } from 'react';
import enums from '../../../helpers/enums';
import aryMathTools from '../../../helpers/aryMathTools';

const ADCContext = createContext(null);

const ADCControllerProvider = ({ children }) => {

    const {
        ADCConceptUnitType
    } = enums();

    const { round } = aryMathTools();

    const initialState = {
        adcData: null,
        adcSiteList: [],
        adcConceptList: [],
    } // initialState

    const updateADCConceptValue = (state, value) => {
        const {adcConceptValueID, checkValue, newValue, unit, justification } = value;

        const newADCSiteList = state.adcSiteList.map(adcSite => {
            let hasChanges = false;

            const newADCConceptValueList = adcSite.ADCConceptValues.map(adccvItem => {
                
                if (adccvItem.ID == adcConceptValueID) {
                    hasChanges = true;
                    return {
                        ...adccvItem,
                        CheckValue: checkValue ?? adccvItem.CheckValue,
                        Value: newValue ?? adccvItem.Value,
                        ValueUnit: unit ?? adccvItem.ValueUnit,
                        Justification: justification ?? adccvItem.Justification,
                    };
                }
                return adccvItem
            });

            if (hasChanges) {   
                return {
                    ...adcSite,
                    ADCConceptValues: newADCConceptValueList,
                };
            }

            return adcSite;
        }); // newADCSiteList

        return newADCSiteList;
    }; // updateADCConceptValue

    const updateTotals = (state) => {
        // Procesar todos los valores del ADC y calcular los totales
        console.log('updateTotals()');

        const { acdData, adcSiteList } = state;
        let totalInitial = 0;       // equivalente a ST1 y ST2
        let totalEmployees = 0;     // suma de los empleados de todos los Sites
        let totalMD11 = 0;
        let totalSurveillance = 0;
        let totalRR = 0;
        
        const newADCSiteList = adcSiteList.map(adcSite => {
            let totalDays = adcSite.InitialMD5;

            // Decrementos
            adcSite.ADCConceptValues.forEach(adccvItem => { // Procesar para hacer Decrementos
                const myConcept = state.adcConceptList.find(ac => ac.ID == adccvItem.ADCConceptID);

                if ((myConcept.WhenTrue && !adccvItem.CheckValue && !!myConcept.Decrease) 
                    || (!myConcept.WhenTrue && adccvItem.CheckValue && !!myConcept.Decrease)) {

                    if (myConcept.DecreaseUnit == ADCConceptUnitType.percentage) {
                        totalDays = totalDays - (adcSite.InitialMD5 * (adccvItem.Value / 100)); //! Verificar si e sobre Inital MD5 o sobre el restante de totalDays
                    } else if (myConcept.DecreaseUnit == ADCConceptUnitType.days) {
                        totalDays = totalDays - adccvItem.Value;
                    }
                }
            });

            const decreaseTotal = totalDays;
            
            // Incrementos
            adcSite.ADCConceptValues.forEach(adccvItem => {
                const myConcept = state.adcConceptList.find(ac => ac.ID == adccvItem.ADCConceptID);

                if ((myConcept.WhenTrue && adccvItem.CheckValue && !!myConcept.Increase)
                    || (!myConcept.WhenTrue && !adccvItem.CheckValue && !!myConcept.Increase)) {

                    if (myConcept.IncreaseUnit == ADCConceptUnitType.percentage) {
                        totalDays = totalDays + (decreaseTotal * (adccvItem.Value / 100));
                    } else if (myConcept.IncreaseUnit == ADCConceptUnitType.days) {
                        totalDays = totalDays + adccvItem.Value;
                    }
                }
            }); 
            
            // Totales por sitio
            totalInitial += totalDays;
            totalEmployees += adcSite.Employees;
            
            // Surveillance
            const survPercentBase = 30; // 30% de TotalInitial del site
            const survResult = totalInitial * (survPercentBase / 100);
            //const surveillance = Math.floor((totalInitial * (survPercent / 100)) * 10) / 10; // Redondea a un digito
            const surveillance = Math.round(survResult * 10) / 10; // Redondea a un digito
            totalSurveillance += surveillance; // Sumar el resultado al total del ADC
            
            // Recertification
            const rr = Math.floor((totalInitial / 3) * 10) / 10; //! Esta formula no está bien. No se puede reducir menos del 50% del totalInicial
            totalRR += rr;

            return {
                ...adcSite,
                TotalInitial: totalDays,
                Surveillance: surveillance,
            };
        }); // newADCSiteList

        const newADCData = {
            ...acdData,
            TotalInitial: round(totalInitial, 2, 'up'),
            TotalEmployees: round(totalEmployees, 2, 'up'),
            TotalMD11: round(totalMD11, 2, 'up'),
            TotalSurveillance: round(totalSurveillance, 2, 'up'),
            TotalRR: round(totalRR, 2, 'up'),
        }

        return {
            ...state,
            adcData: newADCData,
            adcSiteList: newADCSiteList,
        };
    }; // updateTotals

    // REDUCER

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_ADC_DATA': {
                return { ...state, adcData: action.value };
            }
            case 'SET_ADC_SITES_LIST': {
                return { ...state, adcSiteList: action.value };
            }
            case 'SET_ADC_CONCEPTS': {
                return { ...state, adcConceptList: action.value };
            }
            case 'UPDATE_ADC_CONCEPT_VALUE': {
                const newState = updateTotals({
                    ...state, 
                    adcSiteList: updateADCConceptValue(state, action.value)
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
const setADCSiteList = (dispatch, value) => dispatch({ type: "SET_ADC_SITES_LIST", value });
const setADCConceptList = (dispatch, value) => dispatch({ type: "SET_ADC_CONCEPTS", value });
const updateADCConceptValue = (dispatch, value) => dispatch({ type: "UPDATE_ADC_CONCEPT_VALUE", value });
const updateTotals = (dispatch) => dispatch({ type: "UPDATE_TOTALS" });
const clearADCController = (dispatch) => dispatch({ type: "CLEAR_CONTROLLER" });

export { 
    ADCControllerProvider, 
    useADCController,

    setADCData,
    setADCSiteList,
    setADCConceptList,
    
    updateADCConceptValue,
    updateTotals,

    clearADCController,
};