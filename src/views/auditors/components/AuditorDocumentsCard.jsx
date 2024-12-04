import { Card, ListGroup } from 'react-bootstrap'
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore'
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { useEffect } from 'react';
import enums from '../../../helpers/enums';
import { ViewLoading } from '../../../components/Loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCircleCheck, faUserCheck, faUserGraduate, faUserPen } from '@fortawesome/free-solid-svg-icons';
import AuditorDocumentsCardItem from './AuditorDocumentsCardItem';

const AuditorDocumentsCard = () => {
    const titleStyle = "bg-light p-2 border-radius-md mb-2";

    const { 
        DefaultStatusType,
        CatAuditorDocumentType,
        CatAuditorDocumentOrderType
    } = enums();

    const {
        isAuditorLoading,
        auditor
    } = useAuditorsStore();

    const {
        isCatAuditorDocumentsLoading,
        catAuditorDocuments,
        catAuditorDocumentsAsync,
    } = useCatAuditorDocumentsStore();

    useEffect(() => {

        catAuditorDocumentsAsync({
            status: DefaultStatusType.active,
            pageSize: 0,
            order: CatAuditorDocumentOrderType.documentType,
        });
    }, []);
    

    return (
        <Card className="h-100">
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <FontAwesomeIcon icon={ faFileCircleCheck } size="lg" className="text-success me-3" />
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
                            <div className="alert alert-info text-white">
                                Aqui wa mostrar cuando al menos un documento este por expirar o haya expirado
                            </div>
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
                            <hr className="horizontal dark my-3" />
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
                            <hr className="horizontal dark my-3" />
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