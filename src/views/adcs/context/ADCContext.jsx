import { createContext, useContext, useMemo, useReducer } from 'react';
import enums from '../../../helpers/enums';
import aryMathTools from '../../../helpers/aryMathTools';
import roundToDecimals from '../../../helpers/roundToDecimals';

const ADCContext = createContext(null);

const ADCControllerProvider = ({ children }) => {

    const {
        ADCConceptUnitType,
        AuditCycleType,
        AuditStepType,
    } = enums();

    const { round, roundDays, roundToHalf } = aryMathTools();

    const initialState = {
        adcData: null,
        adcSiteList: [],
        adcConceptList: [],
        misc: {
            total:0,                // No se si se necesite
            isMultistandard: false, // Para saber si aplicar o no MD11
        },
        conceptValueHidden: {
            value: 0,
            touch: false,        
        },
        siteAuditHidden: {
            value: 0,
            touch: false,
        }
    } // initialState

    const updateADCSite = (state, value) => {
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
        let adcConceptValue = null;
        
        // state.adcSiteList.forEach(adcSite => {
        //     adcConceptValue = adcSite.ADCConceptValues.find(acv => acv.ID == adcConceptValueID);
        //     if (!!adcConceptValue) return;
        // });
        adcConceptValue = state.adcSiteList
            .flatMap(adcSite => adcSite.ADCConceptValues)
            .find(acv => acv.ID == adcConceptValueID);

        //console.log('updateADCConceptValue.adcConceptValue', adcConceptValue);
        
        const newADCSiteList = state.adcSiteList.map(adcSite => {
            let hasChanges = false;
            const newADCConceptValueList = adcSite.ADCConceptValues.map(adccvItem => {
                
                //if (adccvItem.ID == adcConceptValueID) {
                if (adcConceptValue.ADCConceptID == adccvItem.ADCConceptID) {
                    // console.log('updateADCConceptValue.find ADCConceptID', {
                    //     ...adccvItem,
                    //     CheckValue: checkValue ?? adccvItem.CheckValue,
                    //     Value: newValue ?? adccvItem.Value,
                    //     ValueUnit: unit ?? adccvItem.ValueUnit,
                    //     Justification: justification ?? adccvItem.Justification,
                    // });
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

    const updateADCSiteAudit = (state, value) => {
        const { adcSiteAuditID, value : checkValue } = value;

        const newADCSiteList = state.adcSiteList.map(adcSite => {
            let hasChanges = false;

            const newADCSiteAuditList = adcSite.ADCSiteAudits.map(adcSiteAudit => {

                if (adcSiteAudit.ID == adcSiteAuditID) {
                    hasChanges = true;

                    return {
                        ...adcSiteAudit,
                        Value: checkValue ?? adcSiteAudit.Value,
                    };
                }

                return adcSiteAudit;
            });

            if (hasChanges) {
                return {
                    ...adcSite,
                    ADCSiteAudits: newADCSiteAuditList,
                };
            }

            return adcSite;
        }); // newADCSiteList

        return newADCSiteList;
    }; // updateADCSiteAudit

    const updateTotals = (state) => {
        // Procesar todos los valores del ADC y calcular los totales
        const TOTAL_INITIAL_MIN_DAYS = 2;
        const TOTAL_INITIAL_MAX_PERCENT_REDUCTION = 30;

        const { adcData, adcSiteList } = state;
        let totalInitial = 0;           // equivalente a ST1 y ST2
        let totalEmployees = 0;         // suma de los empleados de todos los Sites        
        let totalSurveillance = 0;      // Suma de los días calculados para la vigilancia
        let totalRecertification = 0;   // Suma de los días calculados para la recertificación
        let total = 0;
        
        const newADCSiteList = adcSiteList.map(adcSite => {
            let totalDays = adcSite.InitialMD5;
            let totalSiteDays = 0;

            if (state.adcConceptList.length > 0) {
                
                // Decrementos
                adcSite.ADCConceptValues.forEach(adccvItem => { // Procesar para hacer Decrementos
                    const myConcept = state.adcConceptList.find(ac => ac.ID == adccvItem.ADCConceptID);

                    if (!!myConcept) {
                        if ((myConcept.WhenTrue && !adccvItem.CheckValue && !!myConcept.Decrease) 
                            || (!myConcept.WhenTrue && adccvItem.CheckValue && !!myConcept.Decrease)) {

                            if (myConcept.DecreaseUnit == ADCConceptUnitType.percentage) {
                                totalDays = roundToDecimals(totalDays - (adcSite.InitialMD5 * (adccvItem.Value / 100)));
                            } else if (myConcept.DecreaseUnit == ADCConceptUnitType.days) {
                                totalDays = roundToDecimals(totalDays - adccvItem.Value);
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
                                totalDays = roundToDecimals(totalDays + (decreaseTotal * (adccvItem.Value / 100)));
                            } else if (myConcept.IncreaseUnit == ADCConceptUnitType.days) {
                                totalDays = roundToDecimals(totalDays + adccvItem.Value);
                            }
                        }
                    } 
                }); 
            }

            //* Validaciones MD11

            if (adcSite.MD11 > 0 && state.misc.isMultistandard) {                
                const decreaseInDays = roundToDecimals(totalDays * (adcSite.MD11 / 100));
                totalSiteDays = roundToDecimals(totalDays - decreaseInDays);

                //totalMD11 += adcSite.MD11;
            } else {
                totalSiteDays = totalDays;
            }

            //* Validaciones

            // If the total initial is greater than the maximum allowed, it will be reduced to the maximum allowed
            const maxRedution = roundToDecimals(adcSite.InitialMD5 - (adcSite.InitialMD5 * (TOTAL_INITIAL_MAX_PERCENT_REDUCTION / 100)));
            const exceedsReduction = totalDays < maxRedution;
            
            //* Totales

            // Totales por sitio
            totalEmployees += adcSite.NoEmployees;
            totalInitial += totalDays;
            total += totalSiteDays;
            
            // Surveillance
            const survPercentBase = 34; // 33% de TotalInitial del site (una tercera parte)
            const surveillance = state.misc.isMultistandard 
                ? roundToDecimals(totalSiteDays * (survPercentBase / 100))
                : roundToDecimals(totalDays * (survPercentBase / 100));            
            totalSurveillance += surveillance; // Sumar el resultado al total del ADC

            // Recertification
            const rrPercentBase = 67; // 33% de reduccion del TotalInitial del site
            let recertification = state.misc.isMultistandard 
                ? roundToDecimals(totalSiteDays * (rrPercentBase / 100))
                : roundToDecimals(totalDays * (rrPercentBase / 100));
            // - None recertification shall be less than 50% than initial MD5 audit days
            const fiftyPercent = roundToDecimals(adcSite.InitialMD5 * 0.5);
            recertification = recertification < fiftyPercent
                ? fiftyPercent
                : recertification;
            totalRecertification += recertification; // Sumar el resultado al total del ADC
            
            return {
                ...adcSite,
                RealTotalInitial: round(totalDays, 2),          // Total Inicialdel ADC
                TotalInitial: roundDays(totalDays),
                RealSurveillance: round(surveillance, 2),       // Total de vigilancia del ADC
                Surveillance: roundDays(surveillance),
                RealRecertification: round(recertification, 2), // Total de recertificacion del ADC
                Recertification: roundDays(recertification),
                RealTotal: round(totalSiteDays, 2),             // Total St1 y St2 del ADC
                Total: roundDays(totalSiteDays),
                ExceedsMaximumReduction: exceedsReduction,
            };
        }); // newADCSiteList

        // None initial certification shall be less than 2 audit days
        if (totalInitial < TOTAL_INITIAL_MIN_DAYS) totalInitial = TOTAL_INITIAL_MIN_DAYS;

        // Generar lista de Surveillance por sitio seleccionado en ADCSiteAudits

        let _totalInitial = 0;
        let _totalMD11 = 0;
        let _total = 0;
        let _surveillance = [0, 0, 0, 0, 0];
        let _recertification = 0;
        newADCSiteList.forEach(adcSite => {
            //console.log('adcSite', adcSite.SiteDescription);

            adcSite.ADCSiteAudits.forEach(asa => {
                //console.log('asa', asa);
                if (asa.Value) {
                    switch (asa.AuditStep) {
                        case AuditStepType.stage1: {
                            _total += adcSite.Total;
                            break;
                        }
                        case AuditStepType.stage2: {
                            _total += adcSite.Total;
                            break;
                        }
                        case AuditStepType.surveillance1: {
                            _surveillance[0] += adcSite.Surveillance;
                            break;
                        }
                        case AuditStepType.surveillance2: {
                            _surveillance[1] += adcSite.Surveillance;
                            break;
                        }
                        case AuditStepType.surveillance3: {
                            _surveillance[2] += adcSite.Surveillance;
                            break;
                        }
                        case AuditStepType.surveillance4: {
                            _surveillance[3] += adcSite.Surveillance;
                            break;
                        }
                        case AuditStepType.surveillance5: {
                            _surveillance[4] += adcSite.Surveillance;
                            break;
                        }
                        case AuditStepType.recertification: { 
                            //console.log('adcSite.Recertification', adcSite.Recertification);
                            _recertification += adcSite.Recertification;
                            break;
                        }
                        default: {
                            console.log('asa.AuditStep', asa.AuditStep);
                            break;
                        }
                    }
                }
            });
        });

        // console.log('_totalInitial', _totalInitial);
        // console.log('_surveillance', _surveillance);
        // console.log('_recertification', _recertification);
        // console.log('_total', _total);

        //console.log('newADCSiteList[0]', newADCSiteList[0]);

        if (!!adcData && !!adcData.AuditCycle && !!adcData.AuditCycle.AuditCycleStandards) {
            // console.log('adcData', adcData);
            const auditCycleStandard = adcData.AuditCycle.AuditCycleStandards.find(acs => acs.StandardID == adcData.AppForm.StandardID);
            //console.log('auditCycleStandard', auditCycleStandard);
            
            if (auditCycleStandard.CycleType == AuditCycleType.initial) {
                // console.log('INICIAL');
                _recertification = totalRecertification; // Se indica pues no tiene un ADCSiteAudit asociado
            } 
            // else if (auditCycleStandard.CycleType == AuditCycleType.recertification) {
            //     console.log('RECERTIFICATION');
            // } else {
            //     console.log('TRANSFER');
            //     // Aqui aun no sé que se debe hacer
            // }
        }

        // Guardar los datos en el ADC
        const newADCData = {
            ...adcData,
            TotalInitial: roundDays(totalInitial),
            TotalEmployees: totalEmployees, 
            TotalMD11: roundDays(total),
            Total: roundDays(_total),
            TotalSurveillance: roundToHalf(totalSurveillance),
            TotalsSurveillance: _surveillance,
            TotalRecertification: _recertification, //roundDays(totalRecertification),            
        };
        //console.log('newADCData', newADCData);

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
                return updateTotals({ ...state, adcData: action.value });
            }
            case 'SET_ADC_SITES_LIST': {
                return updateTotals({ ...state, adcSiteList: action.value });
            }
            case 'SET_ADC_CONCEPTS': {
                return updateTotals({ ...state, adcConceptList: action.value });
            }
            case 'SET_MISC': {
                return { ...state, misc: action.value };
            }
            case 'SET_CONCEPT_VALUE_HIDDEN': {
                return { ...state, conceptValueHidden: { ...state.conceptValueHidden, value: action.value } };
            }
            case 'SET_CONCEPT_VALUE_TOUCH': {
                return { ...state, conceptValueHidden: { ...state.conceptValueHidden, touch: action.value } };
            }
            case 'SET_SITE_AUDIT_VALUE_HIDDEN': {
                return { ...state, siteAuditHidden: { ...state.siteAuditHidden, value: action.value } };
            }
            case 'SET_SITE_AUDIT_VALUE_TOUCH': {
                return { ...state, siteAuditHidden: { ...state.siteAuditHidden, touch: action.value } };
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
            case 'UPDATE_ADC_SITE_AUDIT': {
                //console.log('UPDATE_ADC_SITE_AUDIT', action.value);
                const newState = updateTotals({
                    ...state, 
                    adcSiteList: updateADCSiteAudit(state, action.value)
                });
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
const setConceptValueHidden = (dispatch, value) => dispatch({ type: "SET_CONCEPT_VALUE_HIDDEN", value });
const setConceptValueTouched = (dispatch, value) => dispatch({ type: "SET_CONCEPT_VALUE_TOUCH", value });
const setSiteAuditValueHidden = (dispatch, value) => dispatch({ type: "SET_SITE_AUDIT_VALUE_HIDDEN", value });
const setSiteAuditValueTouched = (dispatch, value) => dispatch({ type: "SET_SITE_AUDIT_VALUE_TOUCH", value });
const updateADCSite = (dispatch, value) => dispatch({ type: "UPDATE_ADC_SITE", value });
const updateADCConceptValue = (dispatch, value) => dispatch({ type: "UPDATE_ADC_CONCEPT_VALUE", value });
const updateADCSiteAudit = (dispatch, value) => dispatch({ type: "UPDATE_ADC_SITE_AUDIT", value });
const updateTotals = (dispatch) => dispatch({ type: "UPDATE_TOTALS" });
const clearADCController = (dispatch) => dispatch({ type: "CLEAR_CONTROLLER" });

export { 
    ADCControllerProvider, 
    useADCController,

    setADCData,
    setADCSiteList,
    setADCConceptList,
    setMisc,
    setConceptValueHidden,
    setConceptValueTouched,
    setSiteAuditValueHidden,
    setSiteAuditValueTouched,
    
    updateADCSite,
    updateADCConceptValue,
    updateADCSiteAudit,
    updateTotals,

    clearADCController,
};