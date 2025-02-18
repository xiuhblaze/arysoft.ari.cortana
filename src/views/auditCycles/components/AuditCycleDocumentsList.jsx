import React from 'react'
import auditCycleDocumentTypeProps from '../helpers/auditCycleDocumentTypeProps'
import enums from '../../../helpers/enums'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import envVariables from '../../../helpers/envVariables';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import AuditCycleDocumentEditItem from './AuditCycleDocumentEditItem';

const AuditCycleDocumentsList = ({ auditCycle, documents, readonly = false, ...props }) => {
    const { 
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES
    } = envVariables();
    const { AuditCycleDocumentType } = enums();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    return (
        <div {...props} className="timeline timeline-one-side">
            {
                auditCycleDocumentTypeProps
                    .filter(i => i.id != AuditCycleDocumentType.nothing)
                    .map(item => {
                        if (item.id == AuditCycleDocumentType.audit) {
                            return (
                                <div key={item.id} className="timeline-block mb-3">
                                    <div className="timeline-step">
                                        <FontAwesomeIcon icon={item.icon} className={`text-${item.variant} text-gradient`} />
                                    </div>
                                    <div className="timeline-content">
                                        <h6 className='d-flex justify-content-between align-items-center text-dark text-sm font-weight-bold mb-0'>
                                            {item.label}
                                            <FontAwesomeIcon icon={faPlus} className="ms-2" />
                                        </h6>
                                        <div className="d-flex justify-content-start gap-3 mt-1 mb-0">
                                            <span className="font-weight-bold text-xs">
                                                <a href="#" className="opacity-6">
                                                    Este va a funcionar de otra forma
                                                </a>
                                                {/* <FontAwesomeIcon icon={faEdit} className="ms-1" size="lg" /> */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        return (    
                            <div key={item.id} className="timeline-block mb-3">
                                <div className="timeline-step">
                                    <FontAwesomeIcon icon={item.icon} className={`text-${item.variant} text-gradient`} />
                                </div>
                                <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                    <h6 className='d-flex justify-content-between align-items-center text-dark text-sm font-weight-bold mb-0'>
                                        {item.label}
                                        <FontAwesomeIcon icon={faPlus} className="ms-2" />
                                    </h6>
                                    <div className="d-flex justify-content-start gap-3 mt-1 mb-0">
                                        {
                                            !!documents && documents
                                                .filter(doc => doc.DocumentType == item.id)
                                                .map(doc => {
                                                    const url = `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}`;
                                                    const fileName = !!doc.Filename 
                                                        ? `${url}/${doc.Filename}`
                                                        : null;
                                                    return (
                                                        <span key={doc.ID} className="font-weight-bold text-xs">
                                                            { !!fileName ? (
                                                                <a href={fileName} target="_blank" title={ doc.Filename }>
                                                                    { doc.StandardName }
                                                                </a>
                                                            ) : (
                                                                <span>
                                                                    { doc.StandardName }
                                                                </span>
                                                            )}
                                                            {
                                                                !readonly &&
                                                                <AuditCycleDocumentEditItem id={ doc.ID } documentType={ item.DocumentType } />
                                                            }
                                                        </span>
                                                    )})
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default AuditCycleDocumentsList