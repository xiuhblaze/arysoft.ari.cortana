import { faLandmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import auditCycleProps from "../helpers/auditCycleProps";
import auditStepProps from "../../audits/helpers/auditStepProps";
import enums from "../../../helpers/enums";

const AuditCyclesCardStandardItem = ({ item, ...props }) => {
    const { DefaultStatusType } = enums();
    const itemStyle = `d-flex justify-content-start align-items-center px-2 py-1 bg-gray-200 rounded-1 mb-1${
        item.Status >= DefaultStatusType.inactive ? ' opacity-6' : ''
    }`;
    
    return (
        <div className={itemStyle} {...props}>
            <FontAwesomeIcon icon={ faLandmark } className="me-1" />
            <div>
                <h6 className="text-xs mb-0">{ item.StandardName }</h6>
                <p className="text-xs text-secondary mb-0">
                    <span title="Cycle type">{ auditCycleProps[item.CycleType].label }</span> | <span title="Initial step">{ auditStepProps[item.InitialStep].abbreviation.toUpperCase() }</span>
                </p>
            </div>
        </div>
    );
};

export default AuditCyclesCardStandardItem;