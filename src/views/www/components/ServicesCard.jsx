import { useState } from "react";
import { Card, Modal } from "react-bootstrap";


export const ServicesCard = ({ title, subtitle, desc, image, children, ...props }) => {
  const [showModal, setShowModal] = useState(false);

  const onClose = () => setShowModal(false);
  const onShow = () => setShowModal(true);

  return (
    <>
      <Card className="text-center p-3 h-100">
        { !!image ? (
          <div className="z-index-1 mx-auto">
            <div className="position-relative w-25 ">
              <div className="blur-shadow-avatar">
                <img className="avatar avatar-xxl" src={ image } />
              </div>
            </div>
          </div>
        ) : null }
        <Card.Body>
          <h4>{ title }</h4>
          <h6 className="category text-ari text-gradient">{ subtitle }</h6>
          <p className="card-description">
            { desc }
          </p>
          <button className="btn bg-gradient-warning" onClick={ onShow }>Read more</button>
        </Card.Body>
      </Card>
      <Modal show={ showModal } onHide={ onClose } size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { children }
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ServicesCard;