import { useEffect } from 'react';
import { Alert, Card, ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faUserGraduate, faUserPen } from '@fortawesome/free-solid-svg-icons';

import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore'
import { ViewLoading } from '../../../components/Loaders';
import AuditorDocumentsCardItem from './AuditorDocumentsCardItem';
import enums from '../../../helpers/enums';
import auditorValidityProps from '../helpers/auditorValidityProps';
import auditorRequiredProps from '../helpers/auditorRequiredProps';

const AuditorDocumentsCard = ({ readOnly = false, ...props }) => {
    const titleStyle = "bg-light p-2 border-radius-md mb-2";

    const { 
        AuditorDocumentValidityType,
        AuditorDocumentRequiredType,
        DefaultStatusType,
        CatAuditorDocumentType,
        CatAuditorDocumentOrderType
    } = enums();

    // CUSTOM HOOKS

    const {
        isAuditorLoading,
        auditor
    } = useAuditorsStore();

    const {
        isCatAuditorDocumentsLoading,
        catAuditorDocuments,
        catAuditorDocumentsAsync,
    } = useCatAuditorDocumentsStore();

    // HOOKS

    useEffect(() => {

        catAuditorDocumentsAsync({
            status: DefaultStatusType.active,
            pageSize: 0,
            order: CatAuditorDocumentOrderType.documentType,
        });
    }, []);

    return (
        <Card { ...props }>
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <FontAwesomeIcon icon={ auditorValidityProps[auditor.ValidityStatus].iconFile } size="lg" className={`text-${ auditorValidityProps[auditor.ValidityStatus].variant } me-2`} />
                        <FontAwesomeIcon icon={ auditorRequiredProps[auditor.RequiredStatus].icon } size="lg" className={ `text-${ auditorRequiredProps[auditor.RequiredStatus].variant} me-2` } />
                        FSSC Auditor Documents checklist
                    </h5>
                </div>
            </Card.Header>
            <Card.Body className="p-3">
                {
                    isAuditorLoading || isCatAuditorDocumentsLoading ? (
                        <ViewLoading />
                    ) : !!auditor && !!catAuditorDocuments && (
                        <>
                            {
                                !!auditor && auditor.ValidityStatus != AuditorDocumentValidityType.success && 
                                <Alert variant={ auditorValidityProps[auditor.ValidityStatus].variant } className="text-white text-xs" closeVariant="white" closeLabel="Close" dismissible>
                                    <FontAwesomeIcon icon={ auditorValidityProps[auditor.ValidityStatus].icon } size="xl" className="me-2" />
                                    { auditorValidityProps[auditor.ValidityStatus].label }
                                </Alert>
                            }
                            {
                                !!auditor && auditor.RequiredStatus != AuditorDocumentRequiredType.success &&
                                <Alert variant={ auditorRequiredProps[auditor.RequiredStatus].variant } className="text-white text-xs" closeVariant="white" dismissible>
                                    <FontAwesomeIcon icon={ auditorRequiredProps[auditor.RequiredStatus].icon } size="xl" className="me-2" />
                                    { auditorRequiredProps[auditor.RequiredStatus].label }
                                </Alert>
                            }
                            <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                            <h6 className={ titleStyle }>
                                <FontAwesomeIcon icon={ faUserPen } size="lg" className="me-2" />
                                Hiring documents
                            </h6>
                            <ListGroup className="mb-3">
                                {
                                    catAuditorDocuments
                                        .filter(i => i.DocumentType == CatAuditorDocumentType.hiring)
                                        .sort((a, b) => a.Order - b.Order)
                                        .map(item => {
                                            const findDocument = auditor.Documents == null 
                                                ? null
                                                : auditor.Documents
                                                    .find(d => 
                                                        d.CatAuditorDocumentID == item.ID
                                                        && (d.Status == DefaultStatusType.active || d.Status == DefaultStatusType.inactive)
                                                    );
                                            return (
                                                <AuditorDocumentsCardItem 
                                                    key={ item.ID }
                                                    item={ item }
                                                    document={ findDocument }
                                                    readOnly={ readOnly }
                                                />
                                            )
                                        })
                                }
                            </ListGroup>
                            <h6 className={ titleStyle }>
                                <FontAwesomeIcon icon={ faUserCheck } size="lg" className="me-2" />
                                Category, sub-category document evaluation
                            </h6>
                            <ListGroup className="mb-3">
                                {
                                    catAuditorDocuments
                                        .filter(i => i.DocumentType == CatAuditorDocumentType.evaluation)
                                        .sort((a, b) => a.Order - b.Order)
                                        .map(item =>
                                    {
                                        const findDocument = auditor.Documents.find(d => 
                                            d.CatAuditorDocumentID == item.ID
                                            && (d.Status == DefaultStatusType.active || d.Status == DefaultStatusType.inactive)
                                        );
                                        return (
                                            <AuditorDocumentsCardItem 
                                                key={ item.ID }
                                                item={item}
                                                document={ findDocument }
                                                readOnly={ readOnly }
                                            />
                                        )
                                    })
                                }
                            </ListGroup>
                            <h6 className={ titleStyle }>
                            <FontAwesomeIcon icon={ faUserGraduate } size="lg" className="me-2" />
                                Training
                            </h6>
                            <p className="text-xs text-secondary mb-0">Requirement Part 4; 3.5.1 (3)(h) (ISO 22003-1)</p>
                            <ListGroup className="mb-3">
                                {
                                    catAuditorDocuments
                                        .filter(i => i.DocumentType == CatAuditorDocumentType.training)
                                        .sort((a, b) => a.Order - b.Order)
                                        .map(item =>
                                    {
                                        const findDocument = auditor.Documents.find(d => 
                                            d.CatAuditorDocumentID == item.ID
                                            && (d.Status == DefaultStatusType.active || d.Status == DefaultStatusType.inactive)
                                        );
                                        return (
                                            <AuditorDocumentsCardItem
                                                key={ item.ID }
                                                item={item}
                                                document={ findDocument }
                                                readOnly={ readOnly } 
                                            />
                                        )
                                    })
                                }
                            </ListGroup>
                            </div>
                        </>
                    )
                }
            </Card.Body>
        </Card>
    )
}

export default AuditorDocumentsCard