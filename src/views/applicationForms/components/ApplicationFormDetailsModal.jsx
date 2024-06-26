import { Button, Card, Col, Modal, Row } from "react-bootstrap"
import { useApplicationFormsStore } from "../../../hooks/useApplicationFormsStore"
import { ViewLoading } from "../../../components/Loaders";

import bgHead from '../../../assets/img/bgWavesWhite.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import getFriendlyDate from "../../../helpers/getFriendlyDate";
import enums from "../../../helpers/enums";

const ApplicationFormDetailsModal = ({ show, onHide, ...props }) => {
    const { ApplicationFormStatusType } = enums();
    
    // CUSTOM HOOKS 
    
    const {
        isApplicationFormLoading,
        applicationForm
    } = useApplicationFormsStore();
    
    // HOOKS 
    
    const navigate = useNavigate();

    // METHODS

    const onEditButton = () => {
        navigate(`/application-forms/${ applicationForm.ID }`);
    };

    return (
        <Modal { ...props } show={ show } onHide={ onHide } size="lg">
            <Modal.Body>
                {
                    isApplicationFormLoading ? (
                        <ViewLoading />
                    ) : !!applicationForm ? (
                        <>
                            <div
                                className="page-header min-height-150 border-radius-lg"
                                style={{
                                    backgroundImage: `url(${ bgHead })`,
                                    backgroundPositionY: '50%'
                                }}
                            >
                                <span className={ `mask bg-gradient-info opacity-6` }></span>
                            </div>
                            <Card className="blur shadow-blur mx-4 mt-n5 overflow-hidden">
                                <Card.Body>
                                    <Row className="gx-4">
                                        <Col className="col-auto my-auto">
                                            <h5 className="mb-1">
                                                ISO 9001:2015
                                            </h5>
                                            <p className="mb-0 font-weight-bold text-sm">
                                                Application Form
                                            </p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Row className="mt-4">
                                <Col xs="12">
                                    <Card className="h-100">
                                        <Card.Header className="pb-0 p-3">
                                            <h6 className="mb-0">Organization</h6>                                            
                                        </Card.Header>
                                        <Card.Body className="p-3">
                                            <Row>
                                                <Col xs="12" md="8">
                                                    <ul className="list-group">
                                                        <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                                                            <strong className="text-dark">Organization name</strong>
                                                            <span className="ms-2">Arysoft Corp</span>
                                                        </li>
                                                        <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                                                            <strong className="text-dark">Main Site Address</strong>
                                                            <span className="ms-2">Adolfo Ruiz Cortine 701 Col. Los Olivos, Ciudad Guzmán, Jalisco, México.</span>
                                                        </li>
                                                        <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                                                            <strong className="text-dark">Legal Entity</strong>
                                                            <span className="ms-2">Arysoft Corp</span>
                                                        </li>
                                                        <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                                                            <strong className="text-dark">Website</strong>
                                                            <a href="#" className="text-info ms-2">arysoft.com.mx</a>
                                                        </li>
                                                    </ul>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <h6 className="text-sm">Contact</h6>
                                                    <div className="d-flex align-items-center px-0 mb-2">
                                                        <div className="avatar me-3">
                                                            <img 
                                                                className="border-radius-lg shadow"
                                                                src="/files/contacts/contact (4).jpg"
                                                                alt="contact"
                                                            />
                                                        </div>
                                                        <div className="d-flex align-items-start flex-column justify-content-center">
                                                            <h6 className="mb-0 text-sm">Ariadne E. Castillo</h6>
                                                            <p className="mb-0 text-xs">Project Manager</p>
                                                            <a href="mailto:"
                                                                className="text-info text-xs"
                                                            >
                                                                ariadne.castillo@arysoft.com.mx
                                                            </a>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <Row>
                            <Col xs="12" className="text-center py-5">
                                Item not found
                            </Col>
                        </Row>
                    )
                }
            </Modal.Body>
            <Modal.Footer className="border-top-0">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        { !!applicationForm && (
                            <ul className="list-group opacity-7">
                                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                                    <strong className="me-2">Last updated</strong>
                                    { getFriendlyDate(applicationForm.Updated) }
                                </li>
                                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                                    <strong className="me-2">By</strong>
                                    { applicationForm.UpdatedUser }
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" className="mb-0" onClick={ onHide }>
                            <FontAwesomeIcon icon={ faArrowRightToBracket } className="me-1" size="lg" />
                            Close
                        </Button>
                        {
                            !!applicationForm && applicationForm.Status !== ApplicationFormStatusType.deleted &&
                            <Button className="bg-gradient-dark mb-0" onClick={ onEditButton }>
                                <FontAwesomeIcon icon={ faEdit } className="me-1" size="lg" />
                                Edit
                            </Button>
                        }
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ApplicationFormDetailsModal