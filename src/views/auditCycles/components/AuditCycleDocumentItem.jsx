import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables"
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";
import AuditCycleDocumentEditItem from "./AuditCycleDocumentEditItem";
import getRandomNumber from "../../../helpers/getRandomNumber";

const AuditCycleDocumentItem = ({ item, readOnly = false, ...props }) => {
    const {
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
        COMMENTS_SMALL_MAX_LENGTH
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

    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action px-2 py-1${ item.Status != DefaultStatusType.active ? ' opacity-5' : '' }`;
    const url = `${VITE_FILES_URL}/${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}`;
    const fileName = !!item.Filename
        ? `${url}/${item.Filename}?v=${ getRandomNumber(4) }`
        : null;
    const extension = !!item.Filename ? item.Filename.split('.').pop().toUpperCase() : null;
    let note = !isNullOrEmpty(item.Comments)
            ? item.Comments 
            : '';
    note += !isNullOrEmpty(item.Version)
        ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Ver: ' + item.Version 
        : '';
    note += !isNullOrEmpty(item.OtherDescription)
        ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Other description: ' + item.OtherDescription 
        : '';

    let smallNote = !isNullOrEmpty(item.Comments) && item.Comments.length > COMMENTS_SMALL_MAX_LENGTH
        ? item.Comments.substring(0, COMMENTS_SMALL_MAX_LENGTH) + '...'
        : item.Comments;
    smallNote += !isNullOrEmpty(item.Version)
        ? (!isNullOrEmpty(smallNote) ? ` | ` : '') + 'Ver: ' + item.Version 
        : '';
    smallNote += !isNullOrEmpty(item.OtherDescription)
        ? (!isNullOrEmpty(smallNote) ? ` | ` : '') + 'Other description: ' + item.OtherDescription 
        : '';

    return (
        <div {...props} className={itemStyle}>
            <div className="d-flex flex-column">
                { !isNullOrEmpty(fileName) ? (
                    <a href={fileName} className="font-weight-bold text-xs" target="_blank" title={ `Open or download file: ${item.Filename}` }>
                        { isNullOrEmpty(item.StandardName) ? 'All Standards' : item.StandardName } 
                        <span className="text-secondary ms-1">
                            {isNullOrEmpty(extension) ? '' : `(${extension})`}
                        </span>
                    </a>
                ) : (
                    <span className="font-weight-bold text-xs">
                        { isNullOrEmpty(item.StandardName) ? 'All Standards' : item.StandardName } 
                    </span>
                )}
                {
                    !isNullOrEmpty(note) &&
                    <span className="text-xs" title={note}>
                        <FontAwesomeIcon 
                            className="text-warning me-1" 
                            icon={ faStickyNote }
                        />
                        { smallNote }
                    </span>
                }
            </div>
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