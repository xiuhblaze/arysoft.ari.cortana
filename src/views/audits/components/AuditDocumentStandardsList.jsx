import { Col, ListGroup, Row } from "react-bootstrap";
import { useAuditDocumentsStore } from "../../../hooks/useAuditDocumentsStore";
import { useAuditsStore } from "../../../hooks/useAuditsStore"
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark, faPlus } from "@fortawesome/free-solid-svg-icons";

const AuditDocumentStandardsList = ({ ...props }) => {

    // CUSTOM HOOKS

    // const {
    //     audit,
    // } = useAuditsStore();

    const {
        auditDocument,
    } = useAuditDocumentsStore();

    return (
        <Row {...props}>
            <Col xs="12">
                { !!auditDocument && !!auditDocument?.AuditStandards && auditDocument.AuditStandards.length > 0 ? (
                    <ListGroup className="mb-3">
                        {
                            auditDocument.AuditStandards.map(item => 
                                <ListGroup.Item key={item.ID} className="border-0 py-0 ps-0 text-xs">
                                    <FontAwesomeIcon icon={ faLandmark } className="me-2" />
                                    {item.StandardName}
                                </ListGroup.Item>
                            )
                        }
                    </ListGroup>
                ) : (
                    <p className="text-center text-secondary text-xs">
                        (no standards assigned, select the standard or press de Add Another button to assign more than one)
                    </p>
                )}
            </Col>
        </Row>
    )
}

export default AuditDocumentStandardsList