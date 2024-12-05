import { useEffect } from 'react';
import { Alert, Card, ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleCheck, faCircleExclamation, faCircleXmark, faFile, faFileCircleCheck, faFileCircleExclamation, faFileCircleXmark, faUserCheck, faUserGraduate, faUserPen } from '@fortawesome/free-solid-svg-icons';

import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore'
import { ViewLoading } from '../../../components/Loaders';
import AuditorDocumentsCardItem from './AuditorDocumentsCardItem';
import enums from '../../../helpers/enums';

const AuditorDocumentsCard = () => {
    const titleStyle = "bg-light p-2 border-radius-md mb-2";

    const { 
        AuditorDocumentValidityType,
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

    const showAlert = !!auditor 
        ? auditor.ValidityStatus != AuditorDocumentValidityType.success
        : false;
    const infoAlert = [
        { icon: faCircle, iconTitle: faFile, label: '-', variant: 'light' },
        { icon: faCircleCheck, iconTitle: faFileCircleCheck, label: 'All updated', variant: 'success' },
        { icon: faCircleExclamation, iconTitle: faFileCircleExclamation, label: 'At least one document is close to expired', variant: 'warning' },
        { icon: faCircleXmark, iconTitle: faFileCircleXmark, label: 'At least one document has expired', variant: 'danger' },
    ];

    return (
        <Card className="h-100">
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <FontAwesomeIcon icon={ infoAlert[auditor.ValidityStatus].iconTitle } size="lg" className={`text-${ infoAlert[auditor.ValidityStatus].variant } me-2`} />
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
                                showAlert && 
                                <Alert variant={ infoAlert[auditor.ValidityStatus].variant } className="text-white text-xs" closeVariant="white" closeLabel="Close" dismissible>
                                    <FontAwesomeIcon icon={ infoAlert[auditor.ValidityStatus].icon } size="xl" className="me-2" />
                                    { infoAlert[auditor.ValidityStatus].label }
                                </Alert>
                            }
                            <h6 className={ titleStyle }>
                                <FontAwesomeIcon icon={ faUserPen } size="lg" className="me-2" />
                                Hiring documents
                            </h6>
                            <ListGroup className="mb-3">
                                {
                                    catAuditorDocuments
                                        .filter(i => i.DocumentType == CatAuditorDocumentType.hiring)
                                        .sort((a, b) => a.Order - b.Order)
                                        .map(item =>
                                    {
                                        const findDocument = auditor.Documents.find(d => 
                                            d.CatAuditorDocumentID == item.ID
                                            && d.Status == DefaultStatusType.active
                                        );

                                        // console.log(currentDocument);
                                        return (
                                            <AuditorDocumentsCardItem key={ item.ID } item={item} document={ findDocument } />
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
                                        return (
                                            <AuditorDocumentsCardItem key={ item.ID } item={item} />
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
                                        return (
                                            <AuditorDocumentsCardItem key={ item.ID } item={item} />
                                        )
                                    })
                                }
                            </ListGroup>
                        </>
                    )
                }
            </Card.Body>
        </Card>
    )
}

export default AuditorDocumentsCard