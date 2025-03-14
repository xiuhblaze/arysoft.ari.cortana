import auditCycleDocumentTypeProps from '../helpers/auditCycleDocumentTypeProps';
import enums from '../../../helpers/enums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faPlus, faStickyNote } from '@fortawesome/free-solid-svg-icons';
// import envVariables from '../../../helpers/envVariables';
// import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import AuditCycleDocumentEditItem from './AuditCycleDocumentEditItem';
//import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import AuditList from '../../audits/components/AuditList';
import AuditEditItem from '../../audits/components/AuditEditItem';
import { useAuditCycleDocumentsStore } from '../../../hooks/useAuditCycleDocumentsStore';
//import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import AuditCycleDocumentItem from './AuditCycleDocumentItem';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';

const AuditCycleDocumentsList = ({ readOnly = false, showAllFiles = false, ...props }) => {
    const { 
        AuditCycleDocumentType,
        DefaultStatusType,
        OrganizationStatusType,
    } = enums();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        auditCycleDocuments
    } = useAuditCycleDocumentsStore();

    return (
        <div {...props} className="timeline timeline-one-side">
            {
                auditCycleDocumentTypeProps
                    .filter(i => i.id != AuditCycleDocumentType.nothing && i.id != AuditCycleDocumentType.audit)
                    .map(item => {
                        const documents = auditCycleDocuments.filter(doc => doc.DocumentType == item.id
                            && (showAllFiles || doc.Status == DefaultStatusType.active)
                        );
                        const iconColorStyle = `text-${ documents.length == 0 
                            ? 'secondary'
                            : item.variant} text-gradient`;

                        if (organization.Status == OrganizationStatusType.applicant
                            && item.id > AuditCycleDocumentType.contract
                        ) 
                            return null;
                        
                        return (    
                            <div key={item.id}>
                                <div  className="timeline-block mb-3">
                                    <div className="timeline-step">
                                        <FontAwesomeIcon icon={item.icon} className={iconColorStyle} />
                                    </div>
                                    <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                        <div className='d-flex justify-content-between align-items-center pe-2 mb-0'>
                                            <div>
                                                <h6 className="text-sm text-dark font-weight-bold mb-0">{item.label}</h6>
                                                <p className="text-xs text-secondary mb-0">{item.helpText}</p>
                                            </div>
                                            <div className="text-dark text-sm font-weight-bold">
                                                <AuditCycleDocumentEditItem 
                                                    documentType={ item.id }
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-start flex-wrap gap-2 mt-1 mb-0">
                                            {
                                                documents.map(doc => <AuditCycleDocumentItem key={doc.ID} item={doc} readOnly={readOnly} />)
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
                                            <div className='d-flex justify-content-between align-items-center pe-2 mb-0'>
                                                <div>
                                                    <h6 className="text-sm text-dark font-weight-bold mb-0">
                                                        {auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].label}
                                                    </h6>
                                                    <p className="text-xs text-secondary mb-0">
                                                        {auditCycleDocumentTypeProps[AuditCycleDocumentType.audit].helpText}
                                                    </p>
                                                </div>
                                                <div className="text-dark text-sm font-weight-bold">
                                                    <AuditEditItem />
                                                </div>
                                            </div>
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