import { useAuditsStore } from "../../../hooks/useAuditsStore";
import AuditEditItem from "../../audits/components/AuditEditItem";
import envVariables from "../../../helpers/envVariables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import auditStatusProps from "../../audits/helpers/auditStatusProps";

const CalendarEvent = ({ ...props}) => {

    const {
        DASHBOARD_OPTIONS,
    } = envVariables();

    // CUstOM HOOKS

    const {
        auditsAsync
    } = useAuditsStore();

    // METHODS

    const onCloseAuditModal = () => {        
        const savedSearch = JSON.parse(localStorage.getItem(DASHBOARD_OPTIONS)) || null;
        
        if (!!savedSearch) {
            auditsAsync(savedSearch);
        }
    }; // onCloseAuditModal

    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
                <h6 className="text-white text-sm font-weight-bold mb-0">
                    <FontAwesomeIcon icon={ auditStatusProps[props.event.audit.Status].icon } className="me-1"  />
                    {props.event.title}
                </h6>
                <p className="d-flex flex-wrap text-light text-xs mb-0">
                    {props.event.notes}
                </p>
                <p className="text-xs mb-0"> {props.event.audit.Auditors.map(i => i.AuditorName).join(', ')}</p>
            </div>
            <AuditEditItem 
                id={ props.event.audit.ID } 
                iconClassName="text-white"
                onClose={ onCloseAuditModal }
            />
        </div>
    )
}

export default CalendarEvent