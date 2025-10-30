import { useDispatch, useSelector } from "react-redux";

import {
    onProposalsLoading,
    setProposals,

    onProposalLoading,
    setProposal,
    clearProposals,

    onProposalCreating,
    isProposalCreated,
    onProposalSaving,
    isProposalSaved,
    onProposalDeleting,
    isProposalDeleted,

    setProposalsErrorMessage,
    clearProposalsErrorMessage,
    clearProposal,
} from "../store/slices/proposalsSlice";

import envVariables from "../helpers/envVariables";
import cortanaApi from "../api/cortanaApi";
import getError from "../helpers/getError";
import isString from "../helpers/isString";

const PROPOSAL_URL = '/proposals';
const { VITE_PAGE_SIZE } = envVariables();

const getSearchQuery = (options = {}) => {
    let query = '';

    query = `?pagesize=${options?.pageSize ?? VITE_PAGE_SIZE}`;
    query += options?.pageNumber ? `&pagenumber=${options.pageNumber}` : '&pagenumber=1';

    query += options?.organizationID ? `&organizationid=${options.organizationID}` : '';
    query += options?.auditCycleID ? `&auditcycleid=${options.auditCycleID}` : '';
    query += options?.text ? `&text=${options.text}` : '';
    query += options?.status ? `&status=${options.status}` : '';
    query += options?.includeDeleted ? `&includeDeleted=${options.includeDeleted}` : '';

    query += options?.order ? `&order=${options.order}` : '';
    return query;
}; // getSearchQuery

export const useProposalsStore = () => {
    const dispatch = useDispatch();
    const {
        isProposalsLoading,
        proposals,
        proposalsMeta,

        isProposalLoading,
        isProposalCreating,
        proposalCreatedOk,
        isProposalSaving,
        proposalSavedOk,
        isProposalDeleting,
        proposalDeletedOk,
        proposal,

        proposalsErrorMessage
    } = useSelector(state => state.proposals)

    const { user } = useSelector(state => state.auth);
    
    // Methods

    const setError = (value) => {
        if (isString(value)) {
            dispatch(setProposalsErrorMessage(value));    
        } else if (isString(value.message)) {
            dispatch(setProposalsErrorMessage(value.message));
        } else {
            console.error('Unknow error data: ', value);
            return null;
        }
        setTimeout(() => {
            dispatch(clearProposalsErrorMessage());
        }, 10);
    }; // setError

    //* Export Methods

    /**
     * Obtiene un listado de registros de acuerdo a los filtros establecidos, estableciendo pagesize = 0, devuelve todos los registros.
     * @param {OrganizationID, AuditCycleID, Text, Status, Order, PageSize, PageMumber} options Objeto con las opciones para filtrar busquedas
     */
    const proposalsAsync = async (options = {}) => {
        dispatch(onProposalsLoading());

        try {
            const query = getSearchQuery(options);
            const resp = await cortanaApi.get(`${PROPOSAL_URL}${query}`);
            const { Data, Meta } = await resp.data;

            dispatch(setProposals({
                proposals: Data,
                proposalsMeta: Meta
            }));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    const proposalsClear = () => {
        dispatch(clearProposals());
    };

    /**
     * Obtiene un registro de acuerdo al identificador recibido
     * @param {guid} id Identificador del registro a obtener
     * @returns null
     */
    const proposalAsync = async (id) => {
        dispatch(onProposalLoading());

        if (!id) {
            setError('You must specify the ID');
            return;
        }

        try {
            const resp = await cortanaApi.get(`${PROPOSAL_URL}/${id}`);
            const { Data } = await resp.data;

            dispatch(setProposal(Data));
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Crea un registro en limpio con sus propiedades en blanco
     * @param {appFormID} identificador del Application Form asociada al proposal
     */
    const proposalCreateAsync = async (item) => {
        dispatch(onProposalCreating());

        try {
            const params = {
                //AppFormID: item.AppFormID,
                ...item,
                UpdatedUser: user.username,
            };
            const resp = await cortanaApi.post(PROPOSAL_URL, params);
            const { Data } = await resp.data;

            dispatch(setProposal(Data));
            dispatch(isProposalCreated());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    // /**
    //  * Llama al endpoint para actualizar la información de un registro existente en la base de datos
    //  * @param {ID, Name, Description, Status, UpdatedUser} item Objeto tipo Proposal
    //  */
    const proposalSaveAsync = async (item, file) => {
        dispatch(onProposalSaving());

        const toSave = {
            ...item,
            UpdatedUser: user.username,
        }

        try {
            const formData = new FormData();
            const headers = {
                'Content-Type': 'multipart/form-data',
            };

            if (!!file) {
                formData.append('file', file);
            }
            formData.append('data', JSON.stringify(toSave));

            const resp = await cortanaApi.post(`${PROPOSAL_URL}`, formData, { headers });
            const { Data } = await resp.data;

            dispatch(setProposal(Data));
            dispatch(isProposalSaved());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    };

    /**
     * Elimina o marca como eliminado a un registro de la base de datos
     * @param {guid} id identificador del registro a eliminar
     */
    const proposalDeleteAsync = async (id) => {
        dispatch(onProposalDeleting());

        const toDelete = {
            ProposalID: id,
            UpdatedUser: user.username,
        }

        try {
            const resp = await cortanaApi.delete(`${PROPOSAL_URL}/${id}`, { data: toDelete });

            console.log('proposalDeleteAsync.resp', resp);

            dispatch(isProposalDeleted());
        } catch (error) {
            const message = getError(error);
            setError(message);
        }
    }

    const proposalClear = () => {
        dispatch(clearProposal());
    }; // proposalClear

    // PROPOSAL ADCS

    const adcAddAsync = async (adcID) => {

        if (!proposal) {
            throw new Error('The proposal is not loaded');
        }

        const toAdd = {
            ProposalID: proposal.ID,
            ADCID: adcID,
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.post(`${PROPOSAL_URL}/${proposal.ID}/adc`, toAdd);
            const { Data } = await resp.data;

            return Data;
        } catch (error) {
            const errData = getError(error);
            console.log(errData);
            throw new Error(errData.message);
        }
    }; // adcAddAsync

    const adcRemoveAsync = async (id) => {

        if (!proposal) {
            throw new Error('The proposal is not loaded');
        }

        const toRemove = {
            ProposalID: proposal.ID,
            ADCID: id,
            UpdatedUser: user.username,
        };

        try {
            const resp = await cortanaApi.delete(`${PROPOSAL_URL}/${proposal.ID}/adc`, { data: toRemove });
            const { Data } = await resp.data;

            return Data;
        } catch (error) {
            const errData = getError(error);
            console.log(errData);
            throw new Error(errData.message);
        }
    }; // adcRemoveAsync

    return {
        // properties
        isProposalsLoading,
        proposals,
        proposalsMeta,

        isProposalLoading,
        isProposalCreating,
        proposalCreatedOk,
        isProposalSaving,
        proposalSavedOk,
        isProposalDeleting,
        proposalDeletedOk,
        proposal,

        proposalsErrorMessage,

        // methods
        proposalsAsync,      // plural
        proposalsClear,
        
        proposalAsync,       // singular
        proposalCreateAsync,
        proposalSaveAsync,
        proposalDeleteAsync,
        proposalClear,

        // proposal adcs
        adcAddAsync,
        adcRemoveAsync,
    }
};
