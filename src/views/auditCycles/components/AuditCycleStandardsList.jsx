import { faLandmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore'
import { useAuditCycleStandardsStore } from '../../../hooks/useAuditCycleStandardsStore'
import { ViewLoading } from '../../../components/Loaders'
import Swal from 'sweetalert2'
import enums from '../../../helpers/enums'
import auditCycleProps from '../helpers/auditCycleProps'
import AuditCycleStandardItem from './AuditCycleStandardItem'
import AuditCycleStandardEditItem from './AuditCycleStandardEditItem'

const AuditCycleStandardsList = ({ readOnly = false, ...props }) => {   

    const {
        DefaultStatusType
    } = enums();

    // CUSTOM HOOKS

    const {
        auditCycle,
    } = useAuditCyclesStore();

    const {
        isAuditCycleStandardsLoading,
        auditCycleStandards,
        auditCycleStandardsAsync,
        auditCycleStandardsErrorMessage,
    } = useAuditCycleStandardsStore();

    // HOOKS

    useEffect(() => {
        if (!!auditCycle) {
            auditCycleStandardsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
        }
    }, [auditCycle]);
    
    useEffect(() => {
        if(!!auditCycleStandardsErrorMessage) {
            Swal.fire('Audit Cycle Standards', auditCycleStandardsErrorMessage, 'error');
        }
    }, [auditCycleStandardsErrorMessage]);
    

    return (
        <Row {...props}> 
            <Col xs="12">
                <label className="form-label d-flex justify-content-between align-items-center">
                    Standards
                    <AuditCycleStandardEditItem />
                </label>
                {
                    isAuditCycleStandardsLoading ? (
                        <ViewLoading />
                    ) : !!auditCycleStandards && auditCycleStandards.length > 0 ? (
                    <ListGroup className="mb-3">
                        {
                            auditCycleStandards.map(item => <AuditCycleStandardItem key={item.ID} item={ item } />)
                        }
                    </ListGroup>
                    ) : <p className="text-center text-secondary text-xs">
                        (no standards assigned, press de <FontAwesomeIcon icon={faPlus} className="text-dark" /> button to assign one)
                    </p>
                }
            </Col>
        </Row>
    )
}

export default AuditCycleStandardsList