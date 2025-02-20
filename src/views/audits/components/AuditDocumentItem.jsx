import React from 'react'
import enums from '../../../helpers/enums';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import AuditDocumentEditItem from './AuditDocumentEditItem';
import envVariables from '../../../helpers/envVariables';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';

const AuditDocumentItem = ({ item, readOnly = false, ...props }) => {
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

    const title = isNullOrEmpty(item.StandardName) ? 'All Standards' : item.StandardName;
    const url = `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}/${item.AuditID}`;
    const fileName = !!item.Filename
        ? `${url}/${item.Filename}`
        : null;

    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action px-2${ item.Status != DefaultStatusType.active ? ' opacity-5' : '' }`;
    let note = !isNullOrEmpty(item.Comments)
        ? item.Comments
        : '';
    note += item.IsWitnessIncluded
        ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Is witness included: ' + item.IsWitnessIncluded
        : '';
    note += !isNullOrEmpty(item.OtherDescription)
        ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Other description: ' + item.OtherDescription
        : '';

    return (
        <div {...props} className={itemStyle}>
            {
                !isNullOrEmpty(fileName) ? (
                    <a href={fileName} className="font-weight-bold text-xs" target="_blank" title={`Open or download file: ${item.Filename}`}>
                        {title}
                    </a>
                ) : (
                    <span className="font-weight-bold text-xs">
                        {title}
                    </span>
                )
            }
            {
                !isNullOrEmpty(note) &&                
                <FontAwesomeIcon 
                    icon={ faStickyNote } 
                    className="text-warning ms-2" 
                    title={note}
                />
            }
            {
                !readOnly && <div className="ms-2">
                    <AuditDocumentEditItem id={item.ID} documentType={ item.DocumentType } />
                </div>
            }
        </div>
    )
}

export default AuditDocumentItem