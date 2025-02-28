import { Col, ListGroup, Row } from "react-bootstrap";
import { useAuditDocumentsStore } from "../../../hooks/useAuditDocumentsStore";
import { useAuditsStore } from "../../../hooks/useAuditsStore"
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark, faPlus } from "@fortawesome/free-solid-svg-icons";

const AuditDocumentStandardsList = ({ readOnly = false, ...props }) => {

    // CUSTOM HOOKS

    const {
        audit,
    } = useAuditsStore();

    const {
        auditDocument,
    } = useAuditDocumentsStore();

    return (
        <Row>
            <Col xs="12">
                { !!auditDocument ? (
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
                        (no standards assigned, press de <FontAwesomeIcon icon={ faPlus } className="text-dark" /> button to assign one)
                    </p>
                )}
            </Col>
        </Row>
    )
}

export default AuditDocumentStandardsList