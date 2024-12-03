import React from 'react'
import { Modal } from 'react-bootstrap'

const AuditorDetailsModal = ({ show, onHide, ...props }) => {
  return (
    <Modal {...props} show={ show } onHide={ onHide } size="lg">
        <Modal.Body>
            Lorem ipsum
        </Modal.Body>
    </Modal>
  )
}

export default AuditorDetailsModal