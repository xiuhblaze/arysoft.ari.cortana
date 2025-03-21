import { useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";

import bgHeadModal from "../../../assets/img/bgWavesWhite.jpg";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const AppFormModalEditItem = ({ id, show, onHide, ...props }) => {

    // HOOKS

    const [showModal, setShowModal] = useState(!!show);

    
    // METHODS

    const onCloseModal = () => {
        setShowModal(false);
        if (!!onHide) onHide();
    };
    
    return (
        <Modal {...props} show={showModal} onHide={ onCloseModal }
            size="xl"
            contentClassName="bg-gray-100 border-0 shadow-lg"
            fullscreen="sm-down"
        >
            <Modal.Body>
                <div 
                    className="page-header min-height-150 border-radius-xl"
                    style={{
                        backgroundImage: `url(${bgHeadModal})`,
                        backgroundPositionY: '50%'
                    }}
                >
                    <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>App Form</h4>
                    <span className={`mask bg-gradient-info opacity-6`} />
                </div>
                <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                    <Row className="gx-4">
                        <Col xs="12" className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <div 
                                    className={`icon icon-md icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center me-2 position-relative`} 
                                    title="Change this!!!"
                                    style={{ minWidth: '48px' }}
                                >
                                    <FontAwesomeIcon icon={ faMagnifyingGlass  } className="opacity-10 text-white" aria-hidden="true" size="lg" /> 
                                </div>
                                <div className="h-100">
                                    <h5 className="flex-wrap mb-1">
                                        Organization Name
                                    </h5>
                                    <p className="mb-0 font-weight-bold text-sm">
                                        Audit Cycle Name
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className={`badge bg-gradient-info text-white`}>
                                    New
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AppFormModalEditItem;