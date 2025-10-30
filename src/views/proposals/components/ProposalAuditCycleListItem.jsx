import { faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import enums from "../../../helpers/enums";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";

const ProposalAuditCycleListItem = ({ proposal }) => {
    const { ProposalStatusType } = enums();
    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action gap-2 px-2 py-1`;

    return (
        <div className={itemStyle}>
            <div className="text-sm">
                <FontAwesomeIcon
                    icon={ faWindowMaximize }
                    size="lg"
                    className={`text-${ !!proposal.Alerts && proposal.Alerts.length > 0
                        ? 'danger'
                        : 'primary'
                    } text-gradient`}
                    title={ !!proposal.Alerts && proposal.Alerts.length > 0
                        ? 'The proposal have alerts, see the details'
                        : proposal.Status == 1 ? 'The proposal is active' : 'The proposal is inactive'
                    }
                />
            </div>
            <div>
                <h6 className="text-xs text-dark text-gradient mb-0">
                    ISO 9001:2015
                </h6>
                <p className="text-xs text-secondary text-wrap mb-0">
                    { isNullOrEmpty(proposal.SignerName) ? 'No signer' : proposal.SignerName }
                </p>
            </div>
        </div>
    )
}

export default ProposalAuditCycleListItem