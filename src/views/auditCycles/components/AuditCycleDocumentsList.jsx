import React from 'react'
import auditCycleDocumentTypeProps from '../helpers/auditCycleDocumentTypeProps'
import enums from '../../../helpers/enums'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import envVariables from '../../../helpers/envVariables';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import AuditCycleDocumentEditItem from './AuditCycleDocumentEditItem';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import AuditList from '../../audits/components/AuditList';
import AuditEditItem from '../../audits/components/AuditEditItem';
import { useAuditCycleDocumentsStore } from '../../../hooks/useAuditCycleDocumentsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import AuditCycleDocumentItem from './AuditCycleDocumentItem';

const AuditCycleDocumentsList = ({ readOnly = false, showAllFiles = false, ...props }) => {
    const { 
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES
    } = envVariables();
    const { 
        AuditCycleDocumentType,
        DefaultStatusType
    } = enums();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        auditCycle
    } = useAuditCyclesStore();

    const {
        auditCycleDocuments
    } = useAuditCycleDocumentsStore();

    return (
        <div {...props} className="timeline timeline-one-side">
            {
                auditCycleDocumentTypeProps
                    .filter(i => i.id != AuditCycleDocumentType.nothing && i.id != AuditCycleDocumentType.audit)
                    .map(item => {
                        
                        return (    
                            <div key={item.id}>
                                <div  className="timeline-block mb-3">
                                    <div className="timeline-step">
                                        <FontAwesomeIcon icon={item.icon} className={`text-${item.variant} text-gradient`} />
                                    </div>
                                    <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                        <h6 className='d-flex justify-content-between align-items-center text-dark text-sm font-weight-bold pe-2 mb-0'>
                                            {item.label}
                                            <AuditCycleDocumentEditItem 
                                                documentType={ item.id } 
                                                // auditCycle={ auditCycle } 
                                            />
                                        </h6>
                                        <div className="d-flex justify-content-start flex-wrap gap-3 mt-1 mb-0">
                                            {
                                                !!auditCycleDocuments && auditCycleDocuments
                                                    .filter(doc => doc.DocumentType == item.id
                                                        && (showAllFiles || doc.Status == DefaultStatusType.active)
                                                    )
                                                    .map(doc => <AuditCycleDocumentItem key={doc.ID} item={doc} readOnly={readOnly} />
                                                        // {
                                                        // const url = `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}`;
                                                        // const fileName = !!doc.Filename 
                                                        //     ? `${url}/${doc.Filename}`
                                                        //     : null;
                                                        // let note = !isNullOrEmpty(doc.Comments)
                                                        //     ? doc.Comments 
                                                        //     : '';
                                                        // note += !isNullOrEmpty(doc.Version)
                                                        //     ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Version: ' + doc.Version 
                                                        //     : '';
                                                        // note += !isNullOrEmpty(doc.OtherDescription)
                                                        //     ? (!isNullOrEmpty(note) ? ` | ` : '') + 'Other description: ' + doc.OtherDescription 
                                                        //     : '';
                                                        // const itemStyle = `d-flex justify-content-between align-items-center rounded-1 item-action px-2${ doc.Status != DefaultStatusType.active ? ' opacity-5' : '' }`;
                                                        // return (
                                                        //     <span key={doc.ID} className={ itemStyle }>
                                                        //         { !!fileName ? (
                                                        //             <a href={fileName} className="font-weight-bold text-xs" target="_blank" title={ `Open or download file: ${doc.Filename}` }>
                                                        //                 { isNullOrEmpty(doc.StandardName) ? 'All Standards' : doc.StandardName } 
                                                        //             </a>
                                                        //         ) : (
                                                        //             <span className="font-weight-bold text-xs">
                                                        //                 { isNullOrEmpty(doc.StandardName) ? 'All Standards' : doc.StandardName } 
                                                        //             </span>
                                                        //         )}
                                                        //         {
                                                        //             !isNullOrEmpty(note) &&
                                                        //             <FontAwesomeIcon icon={ faStickyNote }
                                                        //                 title={ note }
                                                        //                 className="text-warning ms-2" 
                                                        //             />
                                                        //         }
                                                        //         {
                                                        //             !readonly &&
                                                        //             <div className="ms-2">
                                                        //                 <AuditCycleDocumentEditItem 
                                                        //                     id={ doc.ID } 
                                                        //                     auditCycle={ auditCycle }
                                                        //                     documentType={ item.id } 
                                                        //                 />
                                                        //             </div>
                                                        //         }
                                                        //     </span>
                                                        // )}
                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    item.id == AuditCycleDocumentType.auditProgramme &&
                                    <div className="timeline-block mb-3">
                                        <div className="timeline-step">
                                            <FontAwesomeIcon 
                                                icon={auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].icon} 
                                                className={`text-${auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].variant} text-gradient`}
                                            />
                                        </div>
                                        <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                            <h6 className='d-flex justify-content-between align-items-center text-dark text-sm font-weight-bold pe-2 mb-0'>
                                                {auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].label}
                                                <AuditEditItem />
                                            </h6>
                                            <div className="d-flex justify-content-start gap-3 mt-1 mb-0">
                                                <AuditList />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    })
            }
        </div>        
    )
}

export default AuditCycleDocumentsList