import { faGear, faSignature, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import proposalStatusProps from "../helpers/proposalStatusProps";

const ProposalAuditCycleListItem = ({ proposal, onShowModal }) => {
    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action gap-2 px-2 py-1`;
    
    return (
        <div className={itemStyle}>
            <div className="text-sm">
                <FontAwesomeIcon
                    icon={ faWindowMaximize }
                    size="lg"
                    className={`text-${ !!proposal.Alerts && proposal.Alerts.length > 0
                        ? 'danger'
                        : proposalStatusProps[proposal.Status].variant
                    } text-gradient`}
                    title={ !!proposal.Alerts && proposal.Alerts.length > 0
                        ? 'The proposal have alerts, see the details'
                        : proposalStatusProps[proposal.Status].description
                    }
                />
            </div>
            <div>
                <h6 className="text-xs text-dark text-gradient mb-0">
                    {
                        !!proposal.Standards && proposal.Standards.length == 1
                            ? proposal.Standards.map(standard => standard).join(', ')
                            : 'Integral Proposal'
                    }
                </h6>
                {
                    !!proposal.Standards && proposal.Standards.length > 1 &&
                    <p className="text-xs text-secondary text-wrap mb-0">
                        { proposal.Standards.map(standard => standard).join(', ') } standards
                    </p>
                }
                <div className="d-flex justify-content-start align-items-center text-xs text-secondary gap-1">
                    <span title="Signer">
                        <FontAwesomeIcon icon={ faSignature } 
                            className={`text-${ isNullOrEmpty(proposal.SignerName) ? 'secondary' : 'dark' }`}
                        />: { isNullOrEmpty(proposal.SignerName) ? 'No signer' : proposal.SignerName }
                    </span>
                </div>
            </div>
            <div className="text-end">
                <button type="button" 
                    className="btn btn-link text-dark text-gradient p-0 mb-0"
                    onClick={ onShowModal }
                    title="Edit proposal"
                >
                    <FontAwesomeIcon icon={ faGear } size="lg" />
                </button>
            </div>
        </div>
    )
}

export default ProposalAuditCycleListItem