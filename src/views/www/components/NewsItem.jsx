import React, { useState } from 'react';
import { ListGroupItem, Modal } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

export const NewsItem = ({ title, subtitle, children, ...props }) => {
  const [showModal, setShowModal] = useState(false);

  const onClose = () => setShowModal(false);
  const onShow = () => setShowModal(true);

  return (
    <>
      <ListGroupItem { ...props } action className="border-0 d-flex align-items-center px-3 mb-2" onClick={ onShow }>
        <div className="icon icon-sm icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center me-3">
          <FontAwesomeIcon icon={ faNewspaper } size="lg" className="text-white" />
        </div>
        <div className="d-flex flex-column justify-content-center">
          <h6 className="mb-0 text-md">{ title }</h6>
          { !!subtitle ? (
            <p className="mb-0 text-sm">{ subtitle }</p>
          ) : null }
        </div>
      </ListGroupItem>

      <Modal show={ showModal } onHide={ onClose } size="lg">
        {/* <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header> */}
        <Modal.Body className="mx-4">
          <h2 className="text-center my-4">{ title }</h2>
          <div className="overflow-y-scroll" style={{ maxHeight: '50vh' }}>
            { children }
          </div>
        </Modal.Body>
        <Modal.Footer className="text-end pe-4">
          <button className="btn bg-gradient-dark" onClick={ onClose }>Close</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default NewsItem;