import { createContext, useContext, useMemo, useReducer } from 'react';
import enums from '../../../helpers/enums';
import aryMathTools from '../../../helpers/aryMathTools';

const ADCContext = createContext(null);

const ADCControllerProvider = ({ children }) => {

    const {
        ADCConceptUnitType
    } = enums();

    const { round, roundDays } = aryMathTools();

    const initialState = {
        adcData: null,
        adcSiteList: [],
        adcConceptList: [],
        misc: {
            total:0,                // No se si se necesite
            isMultistandard: false, // Para saber si aplicar o no MD11
        }
    } // initialState

    const updateADCSite = (state, value) => { //! Todavia no jala
        //const { ID, TotalInitial, MD11, Surveillance, RR, ExtraInfo, Status } = value;
        console.log('updateADCSite()', value);

        const newADCSiteList = state.adcSiteList.map(adcSite => {
            if (adcSite.ID == value.ID) {
                return {
                    ...adcSite,
                    ...value,
                };
            }
            return adcSite;
        }); // newADCSiteList

        return newADCSiteList;
    }; // updateADCSite

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
        //console.log('updateTotals()', state);
        const TOTAL_INITIAL_MIN_DAYS = 2;
        const TOTAL_INITIAL_MAX_PERCENT_REDUCTION = 30;

        const { acdData, adcSiteList } = state;
        let totalInitial = 0;       // equivalente a ST1 y ST2
        let totalEmployees = 0;     // suma de los empleados de todos los Sites
        let totalMD11 = 0;
        let totalSurveillance = 0;
        let total = 0;
        
        const newADCSiteList = adcSiteList.map(adcSite => {
            let totalDays = adcSite.InitialMD5;

            if (state.adcConceptList.length > 0) {
                
                // Decrementos
                adcSite.ADCConceptValues.forEach(adccvItem => { // Procesar para hacer Decrementos
                    const myConcept = state.adcConceptList.find(ac => ac.ID == adccvItem.ADCConceptID);

                    if (!!myConcept) {
                        if ((myConcept.WhenTrue && !adccvItem.CheckValue && !!myConcept.Decrease) 
                            || (!myConcept.WhenTrue && adccvItem.CheckValue && !!myConcept.Decrease)) {

                            if (myConcept.DecreaseUnit == ADCConceptUnitType.percentage) {
                                totalDays = totalDays - (adcSite.InitialMD5 * (adccvItem.Value / 100)); //! Verificar si e sobre Inital MD5 o sobre el restante de totalDays
                            } else if (myConcept.DecreaseUnit == ADCConceptUnitType.days) {
                                totalDays = totalDays - adccvItem.Value;
                            }
                        }
                    } 
                });

                const decreaseTotal = totalDays;
                
                // Incrementos
                adcSite.ADCConceptValues.forEach(adccvItem => {
                    const myConcept = state.adcConceptList.find(ac => ac.ID == adccvItem.ADCConceptID);

                    if (!!myConcept) {
                        if ((myConcept.WhenTrue && adccvItem.CheckValue && !!myConcept.Increase)
                            || (!myConcept.WhenTrue && !adccvItem.CheckValue && !!myConcept.Increase)) {

                            if (myConcept.IncreaseUnit == ADCConceptUnitType.percentage) {
                                totalDays = totalDays + (decreaseTotal * (adccvItem.Value / 100));
                            } else if (myConcept.IncreaseUnit == ADCConceptUnitType.days) {
                                totalDays = totalDays + adccvItem.Value;
                            }
                        }
                    } 
                }); 
            }

            //* Validaciones

            // If the total initial is greater than the maximum allowed, it will be reduced to the maximum allowed
            const maxRedution = adcSite.InitialMD5 - (adcSite.InitialMD5 * (TOTAL_INITIAL_MAX_PERCENT_REDUCTION / 100));
            const exceedsReduction = totalDays < maxRedution;
            
            // Totales por sitio
            totalEmployees += adcSite.NoEmployees;
            totalInitial += totalDays;
            totalMD11 += adcSite.MD11;
            
            // Surveillance
            const survPercentBase = 30; // 30% de TotalInitial del site
            const surveillance = totalDays * (survPercentBase / 100);
            totalSurveillance += surveillance; // Sumar el resultado al total del ADC
            
            // Recertification
            
            // const rr = totalDays * ((100 - RR_PERCENT_BASE) / 100);
            // totalRR += rr;

            return {
                ...adcSite,
                TotalInitial: round(totalDays, 2),
                Surveillance: round(surveillance, 2),
                //MD11: round(totalMD11, 2),
                // RR: round(rr, 2),
                ExceedsMaximumReduction: exceedsReduction,
            };
        }); // newADCSiteList

        // None initial certification shall be less than 2 audit days
        if (totalInitial < TOTAL_INITIAL_MIN_DAYS) totalInitial = TOTAL_INITIAL_MIN_DAYS;

        const newADCData = {
            ...acdData,
            TotalInitial: roundDays(totalInitial, 2, 'up'),
            TotalEmployees: totalEmployees, 
            TotalMD11: roundDays(totalMD11, 2, 'up'),
            Total: 0,
            TotalSurveillance: roundDays(totalSurveillance, 0, 'up'),
            // TotalRR: roundDays(totalRR, 2, 'up'),
            //ExceedsMaximumReduction: totalInitial > (totalInitial * TOTAL_INITIAL_MAX_PERCENT_REDUCTION / 100),
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
            case 'SET_MISC': {
                return { ...state, misc: action.value };
            }
            case 'UPDATE_ADC_SITE': {
                const newState = updateTotals({
                    ...state, 
                    adcSiteList: updateADCSite(state, action.value)
                })
                return { ...newState };
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
const setMisc = (dispatch, value) => dispatch({ type: "SET_MISC", value });
const updateADCSite = (dispatch, value) => dispatch({ type: "UPDATE_ADC_SITE", value });
const updateADCConceptValue = (dispatch, value) => dispatch({ type: "UPDATE_ADC_CONCEPT_VALUE", value });
const updateTotals = (dispatch) => dispatch({ type: "UPDATE_TOTALS" });
const clearADCController = (dispatch) => dispatch({ type: "CLEAR_CONTROLLER" });

export { 
    ADCControllerProvider, 
    useADCController,

    setADCData,
    setADCSiteList,
    setADCConceptList,
    setMisc,
    
    updateADCSite,
    updateADCConceptValue,
    updateTotals,

    clearADCController,
};