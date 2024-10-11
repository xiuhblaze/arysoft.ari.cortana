import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { ListGroup, Modal } from "react-bootstrap";
import Swal from 'sweetalert2';

import enums from "../../../helpers/enums";
import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faAngleRight, faArrowRightToBracket, faArrowRotateLeft, faCalendarDay, faEdit, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { ViewLoading } from "../../../components/Loaders";
import getFriendlyDate from "../../../helpers/getFriendlyDate";
import Status from "./Status";
import ListGroupItemData from "../../../components/ListGroup/ListGroupItemData";

const DetailsModal = ({ show, onHide, ...props }) => {
    const navigate = useNavigate();
    const { DefaultStatusType } = enums();
    const {
        isStandardLoading,
        isStandardSaving,
        standardSavedOk,
        standard,
        standardSaveAsync,
        standardClear,
    } = useStandardsStore();

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
                    isStandardLoading ? (
                        <ViewLoading />
                    ) : !!standard ? (
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
                                {/* <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Status:" icon={ faAngleRight }>
                                        <Status value={standard.Status} />
                                    </ListGroupItemData>
                                </ListGroup.Item> */}
                            </ListGroup>
                        </>
                    ) : null
                }
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        {!!standard && (
                            <ul className="list-group opacity-7">
                                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                                    <strong className="me-2">Last updated:</strong>
                                    {getFriendlyDate(standard.Updated)}
                                </li>
                                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                                    <strong className="me-2">By:</strong>
                                    {standard.UpdatedUser}
                                </li>
                            </ul>
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

export default DetailsModal