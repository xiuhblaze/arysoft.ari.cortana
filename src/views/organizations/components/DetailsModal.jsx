import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, ListGroup, Modal, Row } from "react-bootstrap";
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faArrowRotateLeft, faBuilding, faBuildingCircleXmark, faCertificate, faEdit, faGlobe, faPhone, faShare } from "@fortawesome/free-solid-svg-icons";

import enums from "../../../helpers/enums";
import getFriendlyDate from "../../../helpers/getFriendlyDate";
import statusProps from "../helpers/StatusProps";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { ViewLoading } from "../../../components/Loaders";
import Status from "./Status";

import bgHeadModal from '../../../assets/img/bgTrianglesBW.jpg';
import ContactsCard from "../../contacts/components/ContactsCard";
import SitesCard from "../../sites/components/SitesCard";

const DetailsModal = ({ show, onHide, ...props }) => {
    const navigate = useNavigate();
    const { OrganizationStatusType } = enums();
    const {
        isOrganizationLoading,
        isOrganizationSaving,
        organizationSavedOk,
        organization,
        organizationSaveAsync,
        organizationClear,
    } = useOrganizationsStore();

    useEffect(() => {
        if (organizationSavedOk) {
            Swal.fire('Standards', 'Successful restoration', 'success');
            organizationClear();
            onHide();
        }
    }, [organizationSavedOk]);

    // METHODS

    const onEditButton = () => {
        navigate(`/organizations/${organization.ID}`);
    }

    const onRestoreButton = () => {
        Swal.fire({
            title: 'Organization',
            text: 'Restore the organization?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Restore',
            cancelButtonText: 'Cancel',
        }).then(resp => {
            if (resp.value) {
                const itemToSave = {
                    ...organization,
                    Status: OrganizationStatusType.active,
                }
                organizationSaveAsync(itemToSave);
            }
        });
    };

    return (
        <Modal {...props} show={show} onHide={onHide} size="xl">
            <Modal.Body>
                {
                    isOrganizationLoading ? (
                        <ViewLoading />
                    ) : !!organization ? (
                        <>
                            <div
                                className="page-header min-height-150 border-radius-lg"
                                style={{
                                    backgroundImage: `url(${bgHeadModal})`,
                                    backgroundPositionY: '50%'
                                }}
                            >
                                <span className={`mask bg-gradient-${statusProps[organization.Status].bgColor} opacity-6`}></span>
                            </div>
                            <div className="card card-body blur shadow-blur mx-4 mt-n7 overflow-hidden">
                                <div className="row gx-4">
                                    <div className="col-auto">
                                        <div className="avatar avatar-xl position-relative">
                                            <img src="/files/organizations/lgoArysoft2019.png" alt="profile_image" className="w-100 border-radius-lg shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="col-auto my-auto">
                                        <div className="h-100">
                                            <h5 className="mb-1">
                                                {organization.Name}
                                            </h5>
                                            <p className="mb-0 font-weight-bold text-sm">
                                                {organization.LegalEntity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-auto my-auto">
                                        <p className="mb-0 text-sm">
                                            <strong className="text-dark me-2">
                                                <FontAwesomeIcon icon={faGlobe} className="me-1" />
                                            </strong>
                                            <a href={`http://${organization.Website}`} target="_blank">
                                                {organization.Website}
                                                <FontAwesomeIcon icon={faShare} className="ms-1" />
                                            </a>
                                        </p>
                                        <p className="text-dark text-sm mb-0">
                                            <FontAwesomeIcon icon={faPhone} className="me-2" />
                                            {organization.Phone}
                                            <a href={`tel:${organization.Phone}`} className="ms-1">
                                                <FontAwesomeIcon icon={faShare} className="opacity-6" />
                                            </a>
                                        </p>
                                    </div>
                                    <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                                        <Status value={organization.Status} />
                                    </div>
                                </div>
                            </div>

                            <Row className="mt-4">
                                <Col xs="12" sm={4}>
                                    <ContactsCard readOnly />
                                </Col>
                                <Col xs="12" sm="4">
                                    <SitesCard readOnly />
                                </Col>
                                <Col xs="12" sm="4">
                                    <Card className="h-100">
                                        <Card.Header className="pb-0 p-3">
                                            <h6 className="mb-0">Certificates</h6>
                                        </Card.Header>
                                        <Card.Body className="p-3">
                                            <ListGroup>
                                                <ListGroup.Item className="border-0 d-flex align-items-center px-0 mb-2">
                                                    <div className="me-3">
                                                        <div className="icon icon-shape bg-gradient-warning border-radius-md d-flex align-items-center justify-content-center">
                                                            <FontAwesomeIcon icon={faCertificate} size="lg" className="text-white mx-3" aria-hidden="true" />
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-start flex-column justify-content-center">
                                                        <h6 className="mb-0 text-sm">ISO 9000</h6>
                                                        <p className="mb-0 text-xs">Expires: 2024/04/23</p>
                                                    </div>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    ) : null
                }
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        {!!organization && (
                            <ul className="list-group opacity-7">
                                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                                    <strong className="me-2">Last updated:</strong>
                                    {getFriendlyDate(organization.Updated)}
                                </li>
                                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                                    <strong className="me-2">By:</strong>
                                    {organization.UpdatedUser}
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        {organization?.Status === OrganizationStatusType.deleted && (
                            <button type="button"
                                className="btn bg-gradient-secondary mb-0"
                                onClick={onRestoreButton}
                                title="Retore"
                                disabled={isOrganizationSaving}
                            >
                                <FontAwesomeIcon icon={faArrowRotateLeft} size="lg" />
                            </button>
                        )}
                        {organization?.Status !== OrganizationStatusType.deleted && (
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