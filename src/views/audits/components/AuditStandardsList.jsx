import { useEffect } from "react";
import { useAuditsStore } from "../../../hooks/useAuditsStore";
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";
import { Col, ListGroup, Row } from "react-bootstrap";
import { ViewLoading } from "../../../components/Loaders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AuditStandardItem from "./AuditStandardItem";
import AuditStandardEditItem from "./AuditStandardEditItem";

const AuditStandardsList = ({ readOnly = false, ...props }) => {

    // CUSTOM HOOKS

    const {
        audit,
    } = useAuditsStore();

    const {
        isAuditStandardsLoading,
        auditStandards,
        auditStandardsAsync,
        auditStandardsErrorMessage,
    } = useAuditStandardsStore();

    // HOOKS

    useEffect(() => {
        if (!!audit) {
            auditStandardsAsync({
                auditID: audit.ID,
                pageSize: 0,
            });
        }
    }, [audit]);
    

    return (
        <Row {...props}>
            <Col xs="12">
                <label className="form-label d-flex justify-content-between align-items-center">
                    Standards
                    <AuditStandardEditItem />
                </label>
                {
                    isAuditStandardsLoading ? (
                        <ViewLoading />
                    ) : !!auditStandards && auditStandards.length > 0 ? (
                        <div className="bg-gray-100 rounded-3 mb-3 p-2">
                            <ListGroup>
                                {
                                    auditStandards.map(item => 
                                        <AuditStandardItem 
                                            key={item.ID} 
                                            item={item} 
                                        />)
                                }
                            </ListGroup>
                        </div>
                    ) : <p className="text-center text-secondary text-xs">
                        (no standards assigned, press de <FontAwesomeIcon icon={ faPlus } className="text-dark" /> button to assign one)
                    </p>
                }
            </Col>
        </Row>
    )
} // AuditStandardsList

export default AuditStandardsList;