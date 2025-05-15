import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from 'react-bootstrap';
import { useAuditDocumentsStore } from '../../../hooks/useAuditDocumentsStore';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { useEffect, useState } from 'react';
import AuditDocumentEditItem from './AuditDocumentEditItem';
import AuditDocumentItem from './AuditDocumentItem';
import auditDocumentTypeProps from '../helpers/auditDocumentTypeProps';
import enums from '../../../helpers/enums';

const AuditDocumentsList = ({ showAllFiles = false, readOnly = false, ...props }) => {

    const {
        AuditDocumentType,
        DefaultStatusType
    } = enums();

    // CUSTOM HOOKS

    const {
        isAuditSaving,
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

            if (!!audit.Standards && audit.Standards.length > 0) {
                const fsscStandard = audit.Standards.some(i => 
                    i.StandardName.includes('FSSC') 
                    && i.Status == DefaultStatusType.active
                    && i.StandardStatus == DefaultStatusType.active
                );

                setAboutFSSC({
                    hasFSSC: !!fsscStandard,
                    isOnlyFSSC: fsscStandard && audit.Standards
                        .filter(s => s.Status == DefaultStatusType.active)
                        .length === 1,
                });
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

                        const documents = auditDocuments.filter(doc => doc.DocumentType == item.id
                            && (showAllFiles || doc.Status == DefaultStatusType.active)
                        );
                        const iconColorStyle = `text-${ documents.length == 0 
                            ? 'secondary'
                            : item.variant} text-gradient`;

                        return (
                            <div key={item.id}>
                                <div className="timeline-block">
                                    <div className="timeline-step">
                                        <FontAwesomeIcon icon={item.icon} className={iconColorStyle} />
                                    </div>
                                    <div className="timeline-content" style={{ maxWidth: 'none' }}>
                                        <div className='d-flex justify-content-between align-items-center pe-2 mb-0'>
                                            <div>
                                                <h6 className="text-sm text-dark font-weight-bold mb-0">{item.label}</h6>
                                                <p className="text-xs text-secondary mb-0">{item.helpText}</p>
                                            </div>
                                            {
                                                !readOnly && audit.Status != DefaultStatusType.nothing && !isAuditSaving &&
                                                <div className="text-dark text-sm font-weight-bold">
                                                    <AuditDocumentEditItem documentType={ item.id } />
                                                </div>
                                            }
                                        </div>
                                        <div className="d-flex justify-content-start flex-wrap gap-3 mt-1 mb-0">
                                            {
                                                isAuditDocumentsLoading ? (
                                                    <Spinner animation="border" role="status" 
                                                        className="text-light"
                                                        size="sm"
                                                    >
                                                        <span className="visually-hidden">Loading...</span>
                                                    </Spinner>
                                                ) : documents.map(doc => <AuditDocumentItem key={doc.ID} item={doc} />)
                                            }
                                        </div>
                                        <hr className="horizontal dark my-1" />
                                    </div>
                                </div>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default AuditDocumentsList;