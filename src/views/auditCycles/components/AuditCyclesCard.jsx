
import { faArrowsSpin, faCertificate, faClock, faEdit, faFile, faFileCircleCheck, faFileContract, faFileSignature, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import AuditCycleEditItem from './AuditCycleEditItem';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';

const AuditCyclesCard = ({ readOnly = false, ...props }) => {

    // CUSTOM HOOKS

    const { 
        organization
    } = useOrganizationsStore();

    const {
        isAuditCyclesLoading,
        auditCycles,
        auditCyclesAsync,
    } = useAuditCyclesStore();

    //  HOOKS

    const [navOption, setNavOption] = useState("cycle-1");

    useEffect(() => {
        auditCyclesAsync({
            organizationID: organization.ID,
            pageSize: 0,
        });
    }, [organization]);
    
    useEffect(() => {
        if (!!auditCycles && auditCycles.length > 0) {
            setNavOption(auditCycles[0].ID);
        }
    }, [auditCycles]);
    

    return (
        <Card {...props}>
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>
                        <FontAwesomeIcon icon={ faArrowsSpin } size="lg" className="text-dark me-2" />
                        Audit cycles
                    </Card.Title>
                    { !readOnly && <AuditCycleEditItem /> }
                </div>
            </Card.Header>
            <Card.Body>
                <Nav
                    variant="pills"
                    className="nav-fill p-1 mb-3"
                    activeKey={navOption}
                    onSelect={(selectedKey) => setNavOption(selectedKey)}
                    role="tablist"
                >
                    {
                        !!auditCycles && auditCycles.map(item => (
                            <Nav.Item key={item.ID}>
                                <Nav.Link className="mb-0 px-3 py-1" eventKey={item.ID}>
                                    <FontAwesomeIcon icon={ faArrowsSpin } className="text-dark me-2" />
                                    {item.Name}
                                </Nav.Link>
                            </Nav.Item>
                        ))
                    }
                    {/* <Nav.Item>
                        <Nav.Link className="mb-0 px-3 py-1" eventKey="cycle-1">
                            <FontAwesomeIcon icon={ faArrowsSpin } className="text-dark me-2" />
                            Cycle 1
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="mb-0 px-3 py-1" eventKey="cycle-2">
                            <FontAwesomeIcon icon={ faArrowsSpin } className="text-dark me-2" />
                            Cycle N
                        </Nav.Link>
                    </Nav.Item> */}
                </Nav>
                <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <div className="timeline timeline-one-side">
                        <div className="timeline-block mb-3">
                            <div className="timeline-step">
                                <FontAwesomeIcon icon={ faFile } className="text-dark text-gradient" />
                            </div>
                            <div className="timeline-content">
                                <h6 className="text-dark text-sm font-weight-bold mb-0">Application Form</h6>
                                <div className="d-flex justify-content-start gap-3 mt-1 mb-0">
                                    <span className="font-weight-bold text-xs">
                                        <a href="#" className="opacity-6">
                                            ISO 9001:2015
                                        </a>                                        
                                        <FontAwesomeIcon icon={ faEdit } className="ms-1" size="lg" />
                                    </span>
                                    <span className="font-weight-bold text-xs">
                                        <a href="#">
                                            ISO 45001:2018
                                        </a>                                        
                                        <FontAwesomeIcon icon={ faEdit } className="ms-1" size="lg" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="timeline-block mb-3">
                            <div className="timeline-step">
                                <FontAwesomeIcon icon={ faClock } className="text-warning text-gradient" />
                            </div>
                            <div className="timeline-content">
                                <h6 className="text-dark text-sm font-weight-bold mb-0">Audit calculation day</h6>
                                <p className="text-secondary font-weight-bold text-sm mt-1 mb-0">
                                    <span className="badge bg-gradient-secondary">
                                        ISO 9001:2015
                                        <FontAwesomeIcon icon={ faEdit } className="ms-1" />
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="timeline-block mb-3">
                            <div className="timeline-step">
                                <FontAwesomeIcon icon={ faFileSignature } className="text-danger text-gradient" />
                            </div>
                            <div className="timeline-content">
                                <h6 className="text-dark text-sm font-weight-bold mb-0">Proposal</h6>
                                <p className="font-weight-bold text-xs mt-1 mb-0">
                                    ISO 9001:2015
                                </p>
                            </div>
                        </div>
                        <div className="timeline-block mb-3">
                            <div className="timeline-step">
                                <FontAwesomeIcon icon={ faFileContract } className="text-success text-gradient" />
                            </div>
                            <div className="timeline-content">
                                <h6 className="text-dark text-sm font-weight-bold mb-0">Contract</h6>
                                <p className="font-weight-bold text-xs mt-1 mb-0">
                                    Signed File
                                </p>
                            </div>
                        </div>
                        <div className="timeline-block mb-3">
                            <div className="timeline-step">
                                <FontAwesomeIcon icon={ faFileCircleCheck } className="text-info text-gradient" />
                            </div>
                            <div className="timeline-content">
                                <h6 className="text-dark text-sm font-weight-bold mb-0">Audit Programme</h6>
                                <p className="font-weight-bold text-uppercase text-xs mt-1 mb-0">
                                    <span>
                                        <a href="#">
                                            Confirmation Letter
                                        </a>                                        
                                        <FontAwesomeIcon icon={ faEdit } className="ms-2" size="lg" />
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="timeline-block mb-3">
                            <div className="timeline-step">
                                <FontAwesomeIcon icon={ faMagnifyingGlass } className="text-dark text-gradient" />
                            </div>
                            <div className="timeline-content">
                                <h6 className="text-dark text-sm font-weight-bold mb-0">Audits</h6>
                                <p className="font-weight-bold text-xs mt-1 mb-0">
                                    Stage 1 | Stage 2 | Surveilance 1
                                </p>
                            </div>
                        </div>
                        <div className="timeline-block mb-3">
                            <div className="timeline-step">
                                <FontAwesomeIcon icon={ faCertificate } className="text-success text-gradient" />
                            </div>
                            <div className="timeline-content">
                                <h6 className="text-dark text-sm font-weight-bold mb-0">Certificates</h6>
                                <p className="font-weight-bold text-xs mt-1 mb-0">
                                    <span>
                                        <a href="#">
                                            ISO 9001:2015
                                        </a>                                        
                                        <FontAwesomeIcon icon={ faEdit } className="ms-2" size="lg" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default AuditCyclesCard