import { Col, ListGroup, Row } from 'react-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuditAuditorsStore } from '../../../hooks/useAuditAuditorsStore';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { useEffect } from 'react';
import { ViewLoading } from '../../../components/Loaders';
import AuditAuditorEditItem from './AuditAuditorEditItem';
import AuditAuditorItem from './AuditAuditorItem';

const AuditAuditorsList = ({ readOnly = false, ...props }) => {
    
    // CUSTOM HOOKS

    const {
        audit,
    } = useAuditsStore();

    const {
        isAuditAuditorsLoading,
        auditAuditors,
        auditAuditorsAsync,
        auditAuditorsErrorMessage,
    } = useAuditAuditorsStore();

    // HOOKS

    useEffect(() => {
        if (!!audit) {
            auditAuditorsAsync({
                auditID: audit.ID,
                pageSize: 0,
            });
        }
    }, [audit]);
    

    return (
        <Row {...props}>
            <Col xs="12">
                <label className="form-label d-flex justify-content-between align-items-center">
                    Auditors
                    <AuditAuditorEditItem />
                </label>
                {
                    isAuditAuditorsLoading ? (
                        <ViewLoading />
                    ) : !!auditAuditors && auditAuditors.length > 0 ? (
                        <div className="bg-gray-100 rounded-3 mb-3 p-2">
                            <ListGroup>
                                {
                                    auditAuditors.map(item => 
                                        <AuditAuditorItem 
                                            key={ item.ID } 
                                            item={ item } 
                                            readOnly={ readOnly }
                                        />
                                    )
                                }                            
                            </ListGroup>
                        </div>
                    ) : <p className="text-center text-secondary text-xs">
                        (no auditors assigned, press de <FontAwesomeIcon icon={ faPlus } className="text-dark" /> button to assign one
                    </p>    
                }
            </Col>
        </Row>
    );
}; // AuditAuditorsList

export default AuditAuditorsList;