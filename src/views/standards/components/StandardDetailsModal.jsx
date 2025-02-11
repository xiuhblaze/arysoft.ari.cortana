import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Card, ListGroup, Modal } from "react-bootstrap";
import Swal from 'sweetalert2';

import enums from "../../../helpers/enums";
import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faAngleRight, faArrowRightToBracket, faArrowRotateLeft, faCalendarDay, faCertificate, faCity, faEdit, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { ViewLoading } from "../../../components/Loaders";
import getFriendlyDate from "../../../helpers/getFriendlyDate";
import Status from "./Status";
import ListGroupItemData from "../../../components/ListGroup/ListGroupItemData";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import AuditorSimpleItem from "../../auditors/components/AuditorSimpleItem";
import { useAuditorsStore } from "../../../hooks/useAuditorsStore";

const StandardDetailsModal = ({ show, onHide, ...props }) => {
    const navigate = useNavigate();
    const { DefaultStatusType } = enums();

    // CUSTOM HOOKS

    const {
        isStandardLoading,
        isStandardSaving,
        standardSavedOk,
        standard,
        standardSaveAsync,
        standardClear,
    } = useStandardsStore();

    const {
        isAuditorsLoading,
        auditors,
        auditorsAsync,
    } = useAuditorsStore();

    // HOOKS

    useEffect(() => {
        if (!!standard) {

            auditorsAsync({
                standardID: standard.ID,
                pageSize: 0,
            });
        }
    }, [standard]);
    
    useEffect(() => {
        if (standardSavedOk) {
            Swal.fire('Standards', 'Successful restoration');
            standardClear();
            onHide();
        }
    }, [standardSavedOk]);

    const onEditButton = () => {
        navigate(`/standards/${standard.ID}`);
    }

    const onRestoreButton = () => {
        Swal.fire({
            title: 'Standard',
            text: 'Restore the standard?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Restore',
            cancelButtonText: 'Cancel',
        }).then(resp => {
            if (resp.value) {
                const itemToSave = {
                    ...standard,
                    Status: DefaultStatusType.active,
                }
                standardSaveAsync(itemToSave);
            }
        });
    };

    return (
        <Modal {...props} show={show} onHide={onHide} size="md">
            <Modal.Header>
                {
                    !!standard ? (
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-0 w-100">
                            <Modal.Title>
                                <FontAwesomeIcon icon={ faLandmark } className="me-3" />
                                { standard.Name }
                            </Modal.Title>
                            <div>
                                <Status value={ standard.Status } />
                            </div>
                        </div>
                    ) : (
                        <Modal.Title>
                            <FontAwesomeIcon icon={ faLandmark } className="me-3" />
                            Details
                        </Modal.Title>
                    )
                }
            </Modal.Header>
            <Modal.Body>
                {
                    isStandardLoading || isAuditorsLoading ? (
                        <ViewLoading />
                    ) : !!standard && !!auditors ? (
                        <>
                            <ListGroup>
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Standard:" icon={ faLandmark }>
                                        {standard.Name}
                                    </ListGroupItemData>
                                </ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Description:" icon={ faAlignLeft }>
                                        {standard.Description}
                                    </ListGroupItemData>
                                </ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Maximum reduction days:" icon={ faCalendarDay }>
                                        {!!standard.MaxReductionDays ? standard.MaxReductionDays : '0'}
                                    </ListGroupItemData>
                                </ListGroup.Item>
                                <hr className="horizontal dark my-3" />
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Certificates:" icon={ faCertificate }>
                                        { standard?.Certificates?.length ?? 0 }
                                    </ListGroupItemData>
                                </ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Organizations:" icon={ faCity }>
                                        { standard?.Organizations?.length ?? 0 }
                                    </ListGroupItemData>
                                </ListGroup.Item>
                            </ListGroup>
                            

                            <h6>Auditors</h6>
                            {   
                                auditors.length > 0 &&
                                     auditors.map(item => {
                                        const auditorStandard = standard.Auditors.find(x => x.AuditorID == item.ID);
                                        const classCard = `d-inline-block mb-2 me-2 ${auditorStandard?.Status == DefaultStatusType.active ? '' : 'opacity-6'}`;
                                        return (
                                            <Card key={item.ID} className={ classCard }>
                                                <Card.Body className="p-2">
                                                    <AuditorSimpleItem item={item} size="sm" />
                                                </Card.Body>
                                            </Card>
                                        )
                                     }
                                    )
                            }
                        </>
                    ) : null
                }
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        {!!standard && (
                            <AryLastUpdatedInfo item={ standard } />
                        )}
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        {standard?.Status === DefaultStatusType.deleted && (
                            <button type="button"
                                className="btn bg-gradient-info mb-0"
                                onClick={onRestoreButton}
                                title="Restore"
                                disabled={isStandardSaving}
                            >
                                <FontAwesomeIcon icon={faArrowRotateLeft} size="lg" />
                            </button>
                        )}
                        {standard?.Status !== DefaultStatusType.deleted && (
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

export default StandardDetailsModal