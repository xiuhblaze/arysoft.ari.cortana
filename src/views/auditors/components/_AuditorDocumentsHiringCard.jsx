import React from 'react'
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore'
import { Card, ListGroup } from 'react-bootstrap';
import { ViewLoading } from '../../../components/Loaders';
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import AuditorDocumentsCardItem from './AuditorDocumentsCardItem';
import enums from '../../../helpers/enums';

const AuditorDocumentsHiringCard = ({ readOnly = false, ...props }) => {

    const {
        CatAuditorDocumentType,
        DefaultStatusType,
    } = enums();


    const {
        isAuditorLoading,
        auditor,
    } = useAuditorsStore();
    const {
        isCatAuditorDocumentLoading,
        catAuditorDocuments,
    } = useCatAuditorDocumentsStore();

    return (
        <Card {...props }>
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <span className="text-dark">Hiring documents</span>
                    </h5>
                </div>
            </Card.Header>
            <Card.Body className="p-3">
                {
                    isAuditorLoading || isCatAuditorDocumentLoading ? (
                        <ViewLoading />
                    ) : !!auditor || !!catAuditorDocuments ? (
                        <ListGroup className="mb-3">
                            {
                                catAuditorDocuments
                                    .filter(i => i.DocumentType == CatAuditorDocumentType.hiring)
                                    .sort((a, b) => a.Order - b.Order)
                                    .map(item => {
                                        const findDocuments = auditor.Documents == null
                                            ? null
                                            : auditor.Documents
                                                .filter(d => d.CatAuditorDocumentID == item.ID
                                                    && (d.Status == DefaultStatusType.active || d.Status == DefaultStatusType.inactive))
                                                .sort((a, b) => a.Status - b.Status);
                                        const findDocument = findDocuments.length > 0 ? findDocuments[0] : null;
                                        return (
                                            <AuditorDocumentsCardItem
                                                key={item.ID}
                                                item={item}
                                                document={findDocument}
                                                readOnly={readOnly}
                                            />
                                        )
                                    })
                            }
                        </ListGroup>
                    ) : null
                }
            </Card.Body>
        </Card>
    )
}

export default AuditorDocumentsHiringCard