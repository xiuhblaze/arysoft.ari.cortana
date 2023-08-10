import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Modal } from "react-bootstrap";

export const StepsTimeline = ({ icon, text, subtext, children, ...props }) => {
  const iconFig = icon?.icon ?? faSmile;
  const iconColor = icon?.color ?? 'primary';
  const [showModal, setShowModal] = useState(false);

  const onClose = () => setShowModal(false);
  const onShow = () => setShowModal(true);

  return (
    <>
      <div { ...props } className="timeline-block mb-3">
        <span className="timeline-step">
          <FontAwesomeIcon icon={ iconFig } className={ `text-${ iconColor } text-gradient` } />
        </span>
        <div className="timeline-content">
          <a href="#" className="text-dark text-md font-weight-bold mb-0" onClick={ onShow }>{ text }</a>
          { !!subtext ? (
            <p className="text-secondary font-weight-bold text-sm mt-1 mb-0">{ subtext }</p>
          ) : null }
        </div>
      </div>

      <Modal show={ showModal } onHide={ onClose } size="xl">
        {/* <Modal.Header closeButton>
          <Modal.Title>{ text }</Modal.Title>
        </Modal.Header> */}
        <Modal.Body className="mx-5 my-4">
          <h3 className="text-center text-dark text-gradient mb-4">{ text }</h3>
          { children }
        </Modal.Body>
        <Modal.Footer className="text-end pe-5">
          <button className="btn bg-gradient-dark" onClick={ onClose }>Close</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default StepsTimeline;