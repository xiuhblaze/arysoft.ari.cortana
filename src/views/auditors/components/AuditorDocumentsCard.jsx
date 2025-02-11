import { useState } from 'react';
import { Alert, Card, ListGroup, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faListCheck, faUserCheck, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

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
    } = enums();

    // CUSTOM HOOKS

    const {
        isAuditorLoading,
        auditor
    } = useAuditorsStore();

    const {
        isCatAuditorDocumentsLoading,
        catAuditorDocuments,
    } = useCatAuditorDocumentsStore();

    // HOOKS

    const [navOption, setNavOption] = useState("documents-general");

    return (
        <Card {...props}>
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        {/* <FontAwesomeIcon 
                            icon={auditorValidityProps[auditor.ValidityStatus].iconFile} 
                            size="lg" 
                            className={`text-${auditorValidityProps[auditor.ValidityStatus].variant} me-2`}
                        />
                        <FontAwesomeIcon 
                            icon={auditorRequiredProps[auditor.RequiredStatus].icon} 
                            size="lg" 
                            className={`text-${auditorRequiredProps[auditor.RequiredStatus].variant} me-2`}
                        /> */}
                        <FontAwesomeIcon icon={ faListCheck } size="lg" className="text-dark me-2" />
                        Auditor Documents Checklist
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
                                <Alert variant={auditorValidityProps[auditor.ValidityStatus].variant} className="text-white text-xs" closeVariant="white" closeLabel="Close" dismissible>
                                    <FontAwesomeIcon icon={auditorValidityProps[auditor.ValidityStatus].icon} size="xl" className="me-2" />
                                    {auditorValidityProps[auditor.ValidityStatus].label}
                                </Alert>
                            }
                            {
                                !!auditor && auditor.RequiredStatus != AuditorDocumentRequiredType.success &&
                                <Alert variant={auditorRequiredProps[auditor.RequiredStatus].variant} className="text-white text-xs" closeVariant="white" dismissible>
                                    <FontAwesomeIcon icon={auditorRequiredProps[auditor.RequiredStatus].icon} size="xl" className="me-2" />
                                    {auditorRequiredProps[auditor.RequiredStatus].label}
                                </Alert>
                            }
                            <Nav
                                variant="pills"
                                className="nav-fill p-1 mb-3"
                                activeKey={navOption}
                                onSelect={(selectedKey) => setNavOption(selectedKey)}
                                role="tablist"
                            >
                                <Nav.Item>
                                    <Nav.Link className="mb-0 px-3 py-1" eventKey="documents-general">
                                        <FontAwesomeIcon icon={faUserGraduate} className="text-dark me-2" />
                                        Hiring Documents
                                    </Nav.Link>
                                </Nav.Item>
                                {
                                    auditor.Standards
                                        .filter(i => i.Status == DefaultStatusType.active)
                                        .map(i => (
                                            <Nav.Item key={i.ID}>
                                                <Nav.Link className="mb-0 px-3 py-1" eventKey={i.StandardID}>
                                                    <FontAwesomeIcon icon={faFileLines} className="text-dark me-2" />
                                                    {i.StandardName}
                                                </Nav.Link>
                                            </Nav.Item>
                                        ))
                                }
                            </Nav>
                            <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                                {
                                    navOption == "documents-general" &&
                                    <>
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
                                    </>
                                }
                                {
                                    auditor.Standards != null &&
                                    auditor.Standards.find(as => as.StandardID == navOption) != null &&
                                    <>
                                        {
                                            catAuditorDocuments
                                                .filter(cad => 
                                                    cad.StandardID == navOption &&
                                                    cad.DocumentType == CatAuditorDocumentType.evaluation)
                                                .length > 0 &&
                                            <>
                                                <h6 className={titleStyle}>
                                                    <FontAwesomeIcon icon={faUserCheck} size="lg" className="me-2" />
                                                    Category, sub-category document evaluation
                                                </h6>
                                                <ListGroup className="mb-3">
                                                    {
                                                        catAuditorDocuments
                                                            .filter(cad => 
                                                                cad.StandardID == navOption &&
                                                                cad.DocumentType == CatAuditorDocumentType.evaluation)
                                                            .sort((a, b) => a.Order - b.Order)
                                                            .map(item => {
                                                                const findDocument = auditor.Documents.find(d =>
                                                                    d.CatAuditorDocumentID == item.ID
                                                                    && (d.Status == DefaultStatusType.active || d.Status == DefaultStatusType.inactive)
                                                                );
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
                                            </>
                                        }
                                        {
                                            catAuditorDocuments
                                                .filter(cad => 
                                                    cad.StandardID == navOption &&
                                                    cad.DocumentType == CatAuditorDocumentType.training)
                                                .length > 0 &&
                                            <>
                                                <h6 className={titleStyle}>
                                                    <FontAwesomeIcon icon={faUserGraduate} size="lg" className="me-2" />
                                                    Training
                                                </h6>
                                                {/* <p className="text-xs text-secondary mb-0">Requirement Part 4; 3.5.1 (3)(h) (ISO 22003-1)</p> */}
                                                <ListGroup className="mb-3">
                                                    {
                                                        catAuditorDocuments
                                                            .filter(cad => 
                                                                cad.StandardID == navOption &&
                                                                cad.DocumentType == CatAuditorDocumentType.training)
                                                            .sort((a, b) => a.Order - b.Order)
                                                            .map(item => {
                                                                const findDocument = auditor.Documents.find(d =>
                                                                    d.CatAuditorDocumentID == item.ID
                                                                    && (d.Status == DefaultStatusType.active || d.Status == DefaultStatusType.inactive)
                                                                );
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
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </>
                    )
                }
            </Card.Body>
        </Card>
    )
}

export default AuditorDocumentsCard