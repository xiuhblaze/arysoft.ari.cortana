import React, { useEffect, useState } from 'react'
import { useAuditsStore } from '../../../hooks/useAuditsStore'
import enums from '../../../helpers/enums';
import auditDocumentTypeProps from '../helpers/auditDocumentTypeProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import AuditDocumentEditItem from './AuditDocumentEditItem';
import { useAuditDocumentsStore } from '../../../hooks/useAuditDocumentsStore';
import { Spinner } from 'react-bootstrap';
import AuditDocumentItem from './AuditDocumentItem';

const AuditDocumentsList = ({ showAllFiles = false, readOnly = false, ...props }) => {

    const {
        AuditDocumentType,
        DefaultStatusType
    } = enums();

    // CUSTOM HOOKS

    const {
        audit
    } = useAuditsStore();

    const {
        isAuditDocumentsLoading,
        auditDocuments,
        auditDocumentsAsync,
        auditDocumentsErrorMessage,
    } = useAuditDocumentsStore();

    // HOOKS

    const [aboutFSSC, setAboutFSSC] = useState({
        hasFSSC: false,
        isOnlyFSSC: false,
    });
    
    useEffect(() => {
        if (!!audit) {
            //console.log('AuditDocumentList', audit);

            if (!!audit.Standards && audit.Standards.length > 0) {
                const fsscStandard = audit.Standards.some(i => i.StandardName.includes('FSSC'));
                setAboutFSSC({
                    hasFSSC: !!fsscStandard,
                    isOnlyFSSC: fsscStandard && audit.Standards.length === 1,
                });

                //console.log('Use FSSC Standard', fsscStandard);
            }

            auditDocumentsAsync({
                auditID: audit.ID,
                pageSize: 0,
            });
        }
    }, [audit]);
    
    return (
        <div {...props} className="timeline timeline-one-side">
            {
                auditDocumentTypeProps
                    .filter(i => i.id != AuditDocumentType.nothing)
                    .map(item => {

                        if (!aboutFSSC.hasFSSC && item.id == AuditDocumentType.fsscIntegrityLetter) return null;
                        if (!aboutFSSC.hasFSSC && item.id == AuditDocumentType.fsscAuditPlanSigned) return null;
                        if (!aboutFSSC.hasFSSC && item.id == AuditDocumentType.fsscScreenShot) return null;
                        if (aboutFSSC.isOnlyFSSC && item.id == AuditDocumentType.techReport) return null;
                        if (!audit.HasWitness && item.id == AuditDocumentType.witnessReport) return null;

                        return (
                            <div key={item.id}>
                                <div className="timeline-block mb-3">
                                    <div className="timeline-step">
                                        <FontAwesomeIcon icon={item.icon} className={`text-${item.variant} text-gradient`} />
                                    </div>
                                    <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                        <h6 className='d-flex justify-content-between align-items-center text-dark text-sm font-weight-bold mb-0'>
                                            { item.label }
                                            <AuditDocumentEditItem documentType={ item.id } />
                                        </h6>
                                        <div className="d-flex justify-content-start flex-wrap gap-3 mt-1 mb-0">
                                            {
                                                isAuditDocumentsLoading ? (
                                                    <Spinner animation="border" role="status" 
                                                        className="text-light"
                                                        size="sm"
                                                    >
                                                        <span className="visually-hidden">Loading...</span>
                                                    </Spinner>
                                                ) : !!auditDocuments && auditDocuments
                                                    .filter(doc => doc.DocumentType == item.id 
                                                        && (showAllFiles || doc.Status == DefaultStatusType.active))
                                                    .map(doc => <AuditDocumentItem key={doc.ID} item={doc} />)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default AuditDocumentsList