import { createContext, useContext, useMemo, useReducer } from "react";

const  ProposalContext = createContext(null);

const ProposalControllerProvider = ({ children }) => {

    const initialState = {
        organizationData: null,
        auditCycleData: null,
        proposalData: null,
        adcsList: [],
    }; // initialState

    // REDUCER

    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_ORGANIZATION': {
                return {
                    ...state,                    
                    organizationData: action.payload,
                };
            }
            case 'SET_PROPOSAL':
                return {
                    ...state,                    
                    proposalData: action.payload,
                };
            case 'CLEAR_CONTROLLER': {
                return { ...initialState };
            }
            default:
                throw new Error(`Unhandled action type: ${action.type}`);
        }
    };

    const [proposalController, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [proposalController, dispatch], [proposalController, dispatch]);

    return <ProposalContext.Provider value={ value }>{ children }</ProposalContext.Provider>;
}; // ProposalControllerProvider

const useProposalController = () => {
    const context = useContext(ProposalContext);

    if (!context) {
        throw new Error('useProposalController must be used within a ProposalControllerProvider');
    }

    return context;
}; // useProposalController

const setOrganizationData = (dispatch, value) => dispatch({ type: "SET_ORGANIZATION", payload: value });
const setProposalData = (dispatch, value) => dispatch({ type: "SET_PROPOSAL", payload: value });
const clearProposalController = (dispatch) => dispatch({ type: "CLEAR_CONTROLLER" });

export {
    ProposalControllerProvider,
    useProposalController,

    setOrganizationData,
    setProposalData,

    clearProposalController,
};