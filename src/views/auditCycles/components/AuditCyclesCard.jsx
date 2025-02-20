import { Card, Nav } from 'react-bootstrap';
import { faArrowsSpin, faEdit, faLandmark, faPlay, faPlus, faStickyNote, faStop } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuditCycleDocumentsStore } from '../../../hooks/useAuditCycleDocumentsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { useEffect, useState } from 'react';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import auditCycleDocumentTypeProps from '../helpers/auditCycleDocumentTypeProps';
import AuditCycleEditItem from './AuditCycleEditItem';
import AuditCyclesCardItem from './AuditCyclesCardItem';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import AuditCycleDocumentsList from './AuditCycleDocumentsList';

const AuditCyclesCard = ({ readOnly = false, ...props }) => {

    const {         
        AuditCycleDocumentType,
        DefaultStatusType,
    } = enums();
    const { 
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES
    } = envVariables();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isAuditCycleLoading,
        auditCycle,
        auditCycleAsync,
        auditCycleClear,

        isAuditCyclesLoading,
        auditCycles,
        auditCyclesAsync,        
    } = useAuditCyclesStore();

    const {
        isAuditCycleDocumentsLoading,
        auditCycleDocuments,
        auditCycleDocumentsAsync,
    } = useAuditCycleDocumentsStore();

    //  HOOKS

    const [navOption, setNavOption] = useState(null);
    const [showAllFiles, setShowAllFiles] = useState(false);
    // const [auditCycleSelected, setAuditCycleSelected] = useState(null);
    // const [auditCycleDocumentsSelected, setAuditCycleDocumentsSelected] = useState(null);

    useEffect(() => {
        if (!!organization) {
            auditCyclesAsync({
                organizationID: organization.ID,
                pageSize: 0,
            });
            setNavOption(null);
            // setAuditCycleSelected(null);
            // setAuditCycleDocumentsSelected(null);

            // auditCycleClear();
        }
    }, [organization]);

    useEffect(() => {
        if (!!auditCycles && auditCycles.length > 0) {
            const loadID = navOption ?? auditCycles[0].ID;
            
            setNavOption(loadID);
            auditCycleAsync(loadID);
        } else {
            auditCycleClear();
        }
    }, [auditCycles]);

    useEffect(() => {
        if (!!auditCycle && auditCycle.ID === navOption) {
            console.log('Cambió el ciclo: ', auditCycle.ID)
            //setAuditCycleSelected(auditCycle);

            auditCycleDocumentsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
        }
    }, [auditCycle]);

    // useEffect(() => {
    //     if (!!auditCycleDocuments) {
    //         setAuditCycleDocumentsSelected(auditCycleDocuments);
    //     }
    // }, [auditCycleDocuments]);
    
    // METHODS

    const loadAuditCycle = (id) => {
        setNavOption(id);
        auditCycleAsync(id);
    }; // loadAuditCycle


    return (
        <Card {...props}>
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>
                        <FontAwesomeIcon icon={faArrowsSpin} size="lg" className="text-dark me-2" />
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
                    onSelect={(selectedKey) => loadAuditCycle(selectedKey)}
                    role="tablist"
                >
                    {
                        !!auditCycles && auditCycles.map(item => (
                            <AuditCyclesCardItem key={item.ID} item={item} />
                        ))
                    }
                </Nav>
                {
                    !!auditCycle && auditCycle.Status != DefaultStatusType.nothing && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center bg-gray-100 rounded-3 p-2 gap-2 mb-3">
                                <div>
                                    <h6 className="text-dark text-sm font-weight-bold mb-0">
                                        {auditCycle.Name}
                                    </h6>
                                    { !!auditCycle.AuditCycleStandards && auditCycle.AuditCycleStandards.length > 0 ? (
                                        <div className="d-flex justify-content-start align-items-start my-1 gap-2">
                                            {
                                                auditCycle.AuditCycleStandards.map(item => (
                                                    <span key={item.ID} className="badge bg-gradient-secondary text-xs">
                                                        <FontAwesomeIcon icon={ faLandmark } className="me-1" />
                                                        <span className="text-xs">
                                                            { item.StandardName }
                                                        </span>
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <p className="text-xs text-secondary my-2">
                                            (no standards assigned)
                                        </p>
                                    )}
                                
                                    <p className="text-xs text-secondary mb-0">
                                        <FontAwesomeIcon icon={ faPlay } className="text-success me-1" />
                                        <span className="font-weight-bold">{ new Date(auditCycle.StartDate).toLocaleDateString() }</span>
                                        <span className="mx-2">|</span>
                                        <FontAwesomeIcon icon={ faStop } className="text-primary me-1" />
                                        <span className="font-weight-bold">{ new Date(auditCycle.EndDate).toLocaleDateString() }</span>
                                        <span className="mx-2">|</span>
                                        <FontAwesomeIcon icon={ faStickyNote } className="text-warning me-1" />
                                        {auditCycle.ExtraInfo}
                                    </p>
                                </div>
                                {
                                    !readOnly && <AuditCycleEditItem id={ auditCycle.ID } />
                                }
                            </div>
                            <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                                <AuditCycleDocumentsList showAllFiles={ showAllFiles } />
                            </div>
                            <div className="d-flex justify-content-end">
                                <div className="form-check form-switch">
                                    <input id="showAllFilesCheck" name="showAllFilesCheck"
                                        className="form-check-input"
                                        type="checkbox"
                                        onChange={ () => setShowAllFiles(!showAllFiles) }
                                        checked={ showAllFiles }
                                    />
                                    <label 
                                        className="form-check-label text-secondary mb-0" 
                                        htmlFor="showAllFilesCheck"
                                    >
                                        Show all files
                                    </label>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Card.Body>
        </Card>
    )
}

export default AuditCyclesCard