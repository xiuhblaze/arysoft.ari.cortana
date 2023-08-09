import { useState } from "react";
import { Card, Modal } from "react-bootstrap";


export const ServicesCard = ({ title, subtitle, desc, accredited, image, children, ...props }) => {
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
          { !!subtitle ? (
            <h6 className="category text-ari text-gradient">{ subtitle }</h6>
          ) : null }
          { !!accredited ? (
            <p className="text-dark text-sm">(Accredited service)</p>
          ) : (
            <p className="text-secondary text-sm">(Unaccredited service)</p>
          )}
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
        <Modal.Body className="mx-5">
          { !!image ? (
              <div className="text-center">
                <img src={ image } width="250px" />
              </div>
            ) : null }
          <h2 className="text-center text-ari text-gradient">{ title }</h2>
          <p className="lead text-center text-dark mb-0">{ subtitle }</p>
          { !!accredited ? (
            <p className="text-dark text-sm text-center">(Accredited service)</p>
          ) : (
            <p className="text-secondary text-sm text-center">(Unaccredited service)</p>
          )}
          { children }
        </Modal.Body>
        <Modal.Footer className="text-end pe-5">
          <button className="btn bg-gradient-warning" onClick={ onClose }>Close</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ServicesCard;