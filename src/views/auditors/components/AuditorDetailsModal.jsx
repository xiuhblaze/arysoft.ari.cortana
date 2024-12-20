import React, { useEffect } from 'react'
import { Card, Col, Modal, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import enums from '../../../helpers/enums';
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import Swal from 'sweetalert2';
import { ViewLoading } from '../../../components/Loaders';

import bgHeadModal from '../../../assets/img/bgWavesWhite.jpg';
import defaultStatusProps from '../../../helpers/defaultStatusProps';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft, faEdit, faEnvelope, faPhone, faShare } from '@fortawesome/free-solid-svg-icons';
import AryDefaultStatusBadge from '../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import AuditorDocumentsCard from './AuditorDocumentsCard';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import { getFullName } from '../../../helpers/getFullName';
import envVariables from '../../../helpers/envVariables';

const AuditorDetailsModal = ({ show, onHide, ...props }) => {
    const navigate = useNavigate();
    const { DefaultStatusType } = enums();
    const {
        VITE_FILES_URL,
        URL_AUDITOR_FILES,
    } = envVariables();
    
    // CUSTOM HOOKS

    const {
        isAuditorLoading,
        isAuditorSaving,
        auditorSavedOk,
        auditor,
        auditorSaveAsync,
        auditorClear,
    } = useAuditorsStore();

    // HOOKS

    useEffect(() => {
        if (auditorSavedOk) {
            Swal.fire('Auditor', 'Successfull restoration', 'success');
        }
    }, [auditorSavedOk]);

    // METHODS

    const onEditButton = () => {
        navigate(`/auditors/${auditor.ID}`);
    };

    const onRestoreButton = () => {
        console.log('onRestoreButton');
    };
    
    return (
        <Modal {...props} show={show} onHide={onHide} size="lg">
            <Modal.Body>
                {
                    isAuditorLoading ? (
                        <ViewLoading />
                    ) : !!auditor && (
                        <>
                            <div 
                                className="page-header min-height-150 border-radius-lg"
                                style={{
                                    backgroundImage: `url(${bgHeadModal})`,
                                    backgroundPositionY: '50%'
                                }}
                            >
                                <span className={`mask bg-gradient-${defaultStatusProps[auditor.Status].bgColor} opacity-6`} />
                            </div>
                            <div className="card card-body blur shadow-blur mx-4 mt-n7 overflow-hidden">
                                <Row className="gx-4">
                                    <div className="col-auto">
                                        <div className="avatar avatar-xl position-relative">
                                            <img 
                                                src={`${VITE_FILES_URL}${URL_AUDITOR_FILES}/${ auditor.ID }/${ auditor.PhotoFilename }`} 
                                                alt="Profile pic" 
                                                className="w-100 border-radius-lg shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-auto my-auto">
                                        <div className="h-100">
                                            <h5 className="mb-1">
                                                { getFullName(auditor) }
                                            </h5>
                                            { auditor.IsLeadAuditor}
                                            <p className="mb-0 font-weight-bold text-sm">
                                                { auditor.Address }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-auto my-auto">
                                        <p className="mb-0 text-sm">
                                            <span className="text-dark me-1">
                                                <FontAwesomeIcon icon={faEnvelope} fixedWidth />
                                            </span>
                                            <a href={`mailto:${auditor.Email}`} target="_blank">
                                                {auditor.Email}
                                                <FontAwesomeIcon icon={faShare} className="ms-1" />
                                            </a>
                                        </p>
                                        <p className="text-dark text-sm mb-0">
                                            <span className="text-dark me-1">
                                                <FontAwesomeIcon icon={faPhone} fixedWidth />
                                            </span>
                                            <a href={`tel:${auditor.Phone}`}>
                                                {auditor.Phone}
                                                <FontAwesomeIcon icon={faShare} className="ms-1 opacity-6" />
                                            </a>
                                        </p>
                                    </div>
                                    <div className="col-auto my-auto ms-auto">
                                        <AryDefaultStatusBadge value={ auditor.Status } />
                                    </div>
                                </Row>
                            </div>

                            <Row className="mt-4">
                                <Col xs="12">
                                    <AuditorDocumentsCard readOnly />
                                </Col>
                            </Row>
                        </>
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        { !!auditor && 
                            <AryLastUpdatedInfo item={auditor} />
                        }
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        {auditor?.Status === DefaultStatusType.deleted && (
                            <button type="button"
                                className="btn bg-gradient-secondary mb-0"
                                onClick={onRestoreButton}
                                title="Retore"
                                disabled={isAuditorSaving}
                            >
                                <FontAwesomeIcon icon={faArrowRotateLeft} size="lg" />
                            </button>
                        )}
                        {auditor?.Status !== DefaultStatusType.deleted && (
                            <button type="button" className="btn bg-gradient-dark mb-0" onClick={onEditButton}>
                                <FontAwesomeIcon icon={faEdit} className="me-1" size="lg" />
                                Edit
                            </button>
                        )}
                        <button type="button" className="btn btn-link text-secondary mb-0" onClick={onHide}>
                            Close
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AuditorDetailsModal