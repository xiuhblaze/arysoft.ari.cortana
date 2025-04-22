import { ListGroupItem } from "react-bootstrap";
import enums from "../../../helpers/enums"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faLandmark } from "@fortawesome/free-solid-svg-icons";
import auditStepProps from "../helpers/auditStepProps";
import { isNullOrEmpty } from "../../../helpers/isNullOrEmpty";
import AuditStandardEditItem from "./AuditStandardEditItem";

const AuditStandardItem = ({ item, readOnly = false, ...props }) => {
    const { DefaultStatusType } = enums();

    const itemStyle = `border-0 d-flex justify-content-between align-items-center bg-transparent px-0${item.Status == DefaultStatusType.inactive || item.StandardStatus == DefaultStatusType.inactive ? ' opacity-6' : ''}`;

    return (
        <ListGroupItem {...props} className={itemStyle} >
            <div className="d-flex justify-content-start align-items-center">
                <FontAwesomeIcon icon={ faLandmark } size="lg" className="text-dark me-2" /> 
                <div>
                    <h6 className="text-sm mb-0">
                        {item.StandardName}
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                        { auditStepProps[item.Step].label }
                    </p>
                    { !isNullOrEmpty(item.ExtraInfo) ? (
                        <p className="text-xs text-secondary mb-0">
                            {item.ExtraInfo}
                        </p>
                    ) : null }  
                </div>
            </div>
            {
                !readOnly && <AuditStandardEditItem id={item.ID} />
            }
        </ListGroupItem>
    )
}

export default AuditStandardItem