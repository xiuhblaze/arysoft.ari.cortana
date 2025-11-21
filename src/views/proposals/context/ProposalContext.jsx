import { createContext, useContext, useMemo, useReducer } from "react";

const  ProposalContext = createContext(null);

const ProposalControllerProvider = ({ children }) => {

    const initialState = {
        auditCycleData: null,
        organizationData: null,
        proposalData: null,
        adcList: [],
        contactList: [],
        proposalAuditList: [],
        adcsCountHidden: {
            value: 0,
            touch: false,
        },
        includeTravelExpenses: false,
    }; // initialState

    // REDUCER

    const reducer = (state, action) => {
        
        switch (action.type) {
            case 'SET_AUDIT_CYCLE': {
                return {
                    ...state,                    
                    auditCycleData: action.payload,
                };
            }
            case 'SET_ORGANIZATION': {
                return {
                    ...state,                    
                    organizationData: action.payload,
                };
            }
            case 'SET_PROPOSAL': {
                return {
                    ...state,                    
                    proposalData: action.payload,
                };
            }
            case 'SET_ADC_LIST': {
                return {
                    ...state,                    
                    adcList: action.payload,
                };
            }
            case 'SET_CONTACT_LIST': {
                return {
                    ...state,                    
                    contactList: action.payload,
                };
            }
            case 'SET_PROPOSAL_AUDIT_LIST': {
                return {
                    ...state,                    
                    proposalAuditList: action.payload,
                };
            }
            case 'SET_INCLUDE_TRAVEL_EXPENSES': {
                return {
                    ...state,                    
                    includeTravelExpenses: action.payload,
                };
            }
            case 'CLEAR_CONTROLLER': {
                return { ...initialState };
            }
            default:
                throw new Error(`Unhandled action type: ${action.type}`);
        }
    };

    const [proposalController, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [proposalController, dispatch], [proposalController]);

    return <ProposalContext.Provider value={ value }>{ children }</ProposalContext.Provider>;
}; // ProposalControllerProvider

const useProposalController = () => {
    const context = useContext(ProposalContext);

    if (!context) {
        throw new Error('useProposalController must be used within a ProposalControllerProvider');
    }

    return context;
}; // useProposalController

const setAuditCycleData = (dispatch, value) => dispatch({ type: "SET_AUDIT_CYCLE", payload: value });
const setOrganizationData = (dispatch, value) => dispatch({ type: "SET_ORGANIZATION", payload: value });
const setProposalData = (dispatch, value) => dispatch({ type: "SET_PROPOSAL", payload: value });
const setADCList = (dispatch, value) => dispatch({ type: "SET_ADC_LIST", payload: value });
const setContactList = (dispatch, value) => dispatch({ type: "SET_CONTACT_LIST", payload: value });
const setProposalAuditList = (dispatch, value) => dispatch({ type: "SET_PROPOSAL_AUDIT_LIST", payload: value });
const setIncludeTravelExpenses = (dispatch, value) => dispatch({ type: "SET_INCLUDE_TRAVEL_EXPENSES", payload: value });
const clearProposalController = (dispatch) => dispatch({ type: "CLEAR_CONTROLLER" });

export {
    ProposalControllerProvider,
    useProposalController,

    setAuditCycleData,
    setOrganizationData,
    setProposalData,
    setADCList,
    setContactList,
    setProposalAuditList,
    setIncludeTravelExpenses,

    // setADCsCountHiddenValue,
    // setADCsCountHiddenTouched,

    clearProposalController,
};