import { useEffect, useState } from "react";
import enums from "../../../helpers/enums"
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useProposalsStore } from "../../../hooks/useProposalsStore";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import ProposalAuditCycleListItem from "./ProposalAuditCycleListItem";
import { ProposalControllerProvider } from "../context/ProposalContext";
import ProposalModalEditItem from "./ProposalModalEditItem";

const ProposalAuditCycleList = ({ showAll = false }) => {
    const { ProposalStatusType } = enums();

    // CUSTOM HOOKS

    const { auditCycle } = useAuditCyclesStore();
    const {
        isProposalsLoading,
        proposal,
        proposals,
        proposalsErrorMessage,

        proposalsAsync,
    } = useProposalsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [proposalID, setProposalID] = useState(null);

    useEffect(() => {
        if (!!auditCycle) {
            proposalsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
        }
    }, [auditCycle]);
    
    useEffect(() => {
        
        if (!!proposalsErrorMessage) {
            Swal.fire('Proposal', proposalsErrorMessage, 'error');
        }
    }, [proposalsErrorMessage])
    
    // METHODS

    const onShowModal = (id) => {

        setProposalID(id);
        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {

        if (!!proposal && proposal.Status < ProposalStatusType.inactive) {

            proposalsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
        }

        setShowModal(false);
    }; // onCloseModal

    return (
        <>
            <div className="d-flex justify-content-start flex-wrap gap-2 mt-1 mb-0">
                {
                    isProposalsLoading ? (
                        <div className="ms-3 my-3">
                            <Spinner animation="border" variant="secondary" role="status" size="sm">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : !!proposals && proposals.length > 0 ? proposals
                        .filter(proposal => showAll || proposal.Status <= ProposalStatusType.inactive)
                        .map(proposal => <ProposalAuditCycleListItem 
                            key={proposal.ID} 
                            proposal={proposal} 
                            onShowModal={ () => { onShowModal(proposal.ID) } }
                        />
                    ) : null
                }
            </div>
            <ProposalControllerProvider>
                <ProposalModalEditItem show={ showModal } onHide={ onCloseModal } id={ proposalID } />
            </ProposalControllerProvider>
        </>
    )
}

export default ProposalAuditCycleList