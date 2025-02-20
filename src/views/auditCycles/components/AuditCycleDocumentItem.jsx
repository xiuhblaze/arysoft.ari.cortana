import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables"
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";
import AuditCycleDocumentEditItem from "./AuditCycleDocumentEditItem";

const AuditCycleDocumentItem = ({ item, readOnly = false, ...props }) => {
    const {
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES
    } = envVariables();

    const {
        DefaultStatusType
    } = enums();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        auditCycle
    } = useAuditCyclesStore();

    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action px-2${ item.Status != DefaultStatusType.active ? ' opacity-5' : '' }`;
    const url = `${VITE_FILES_URL}/${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}`;
    const fileName = !!item.Filename
        ? `${url}/${item.Filename}`
        : null;
    let note = !isNullOrEmpty(item.Comments)
            ? item.Comments 
            : '';
        note += !isNullOrEmpty(item.Version)
            ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Version: ' + item.Version 
            : '';
        note += !isNullOrEmpty(item.OtherDescription)
            ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Other description: ' + item.OtherDescription 
            : '';

    return (
        <div {...props} className={itemStyle}>
            { !isNullOrEmpty(fileName) ? (
                <a href={fileName} className="font-weight-bold text-xs" target="_blank" title={ `Open or download file: ${item.Filename}` }>
                    { isNullOrEmpty(item.StandardName) ? 'All Standards' : item.StandardName } 
                </a>
            ) : (
                <span className="font-weight-bold text-xs">
                    { isNullOrEmpty(item.StandardName) ? 'All Standards' : item.StandardName } 
                </span>
            )}
            {
                !isNullOrEmpty(note) &&
                <FontAwesomeIcon 
                    className="text-warning ms-2" 
                    icon={ faStickyNote }
                    title={ note }
                />
            }
            {
                !readOnly &&
                <div className="ms-2">
                    <AuditCycleDocumentEditItem
                        id={ item.ID }
                        documentType={ item.DocumentType } 
                    />
                </div>
            }
        </div>
    )
}

export default AuditCycleDocumentItem