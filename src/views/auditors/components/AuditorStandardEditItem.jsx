import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { ViewLoading } from '../../../components/Loaders'

const AuditorStandardEditItem = ({ auditorStandardID, ...props }) => {

    const [showModal, setShowModal] = useState(false);

    // METHODS

    const onShowModal = () => {

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {

        setShowModal(false);        
    }; // onCloseModal

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link mb-0 p-0 text-lg"
                title="Edit or add new standard"
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={faEdit} className="text-dark" />
            </button>
            <Modal show={showModal} onHide={onCloseModal} >
                <Modal.Body>
                    <ViewLoading />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AuditorStandardEditItem