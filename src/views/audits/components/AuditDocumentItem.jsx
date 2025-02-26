import React from 'react'
import enums from '../../../helpers/enums';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import AuditDocumentEditItem from './AuditDocumentEditItem';
import envVariables from '../../../helpers/envVariables';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import getRandomNumber from '../../../helpers/getRandomNumber';

const AuditDocumentItem = ({ item, readOnly = false, ...props }) => {
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

    const title = isNullOrEmpty(item.StandardName) ? 'All Standards' : item.StandardName;
    const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action px-2 py-1${ item.Status != DefaultStatusType.active ? ' opacity-5' : '' }`;
    const url = `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}/${item.AuditID}`;
    const fileName = !!item.Filename
        ? `${url}/${item.Filename}?v=${ getRandomNumber(4) }`
        : null;
    const extension = !!item.Filename ? item.Filename.split('.').pop().toUpperCase() : null;
    let note = !isNullOrEmpty(item.Comments)
        ? item.Comments
        : '';
    note += item.IsWitnessIncluded
        ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Is witness included: ' + item.IsWitnessIncluded
        : '';
    note += !isNullOrEmpty(item.OtherDescription)
        ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Other description: ' + item.OtherDescription
        : '';
    let smallNote = !isNullOrEmpty(item.Comments) && item.Comments.length > COMMENTS_SMALL_MAX_LENGTH
        ? item.Comments.substring(0, COMMENTS_SMALL_MAX_LENGTH) + '...'
        : '';
    smallNote += item.IsWitnessIncluded
        ? (!isNullOrEmpty(smallNote) ? ` | ` : '') + 'Witness: ' + (item.IsWitnessIncluded ? 'Yes' : 'No')
        : '';
    smallNote += !isNullOrEmpty(item.OtherDescription)
        ? (!isNullOrEmpty(smallNote) ? ` | ` : '') + 'Other description: ' + item.OtherDescription
        : '';

    return (
        <div {...props} className={itemStyle}>
            <div className="d-flex flex-column">
                {
                    !isNullOrEmpty(fileName) ? (
                        <a href={fileName} className="font-weight-bold text-xs" target="_blank" title={`Open or download file: ${item.Filename}`}>
                            {title}
                            { isNullOrEmpty(extension) ? '' : <span className="text-secondary ms-1">({extension})</span> }
                        </a>
                    ) : (
                        <span className="font-weight-bold text-xs">
                            {title}
                        </span>
                    )
                }
                {
                    !isNullOrEmpty(note) &&
                    <span className="text-xs" title={note}>
                        <FontAwesomeIcon 
                            icon={ faStickyNote } 
                            className="text-warning me-1" 
                        />
                        {smallNote}
                    </span>
                }

            </div>
            {
                !readOnly && <div className="ms-2">
                    <AuditDocumentEditItem id={item.ID} documentType={ item.DocumentType } />
                </div>
            }
        </div>
    )
}

export default AuditDocumentItem