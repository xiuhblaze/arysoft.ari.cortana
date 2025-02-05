import { useState } from 'react';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ListGroup, Modal } from 'react-bootstrap'
import { format, formatDistanceToNow } from "date-fns";

const NotesListModal = ({notes, buttonLabel, ...props}) => {

    const [showModal, setShowModal] = useState(false);


    const onShowModal = () => {
        setShowModal(true);
    }

    const onCloseModal = () => {
        setShowModal(false);
    }

    //console.log(buttonLabel);

    return (
        <>
            <Button
                variant="link"
                className="text-dark p-0 mb-0"
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={faStickyNote} size="lg" className="text-warning" />
                { !!buttonLabel ? <span className="ms-1">{buttonLabel}</span> : null }
            </Button>
            <Modal show={showModal} onHide={onCloseModal} centered>
                <Modal.Header closeButton className="list-group-item-warning">
                    <Modal.Title>
                        <FontAwesomeIcon icon={faStickyNote} className="me-2" />
                        Notes
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-0 list-group-item-warning">
                    <ListGroup variant="flush">
                        {
                            notes.map(item => {
                                let updatedLocalDate = null;
                                const updated = !!item.Updated ? new Date(item.Updated) : null;
                                if (!!updated) {
                                    const updatedFormat = new Date(updated);
                                    const updatedOffset = updatedFormat.getTimezoneOffset();
                                    updatedLocalDate = new Date(updatedFormat.getTime() - updatedOffset * 60000);
                                }
                                return (
                                    <ListGroup.Item key={item.ID} variant="warning">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faStickyNote} className="text-warning me-2" />
                                                <div className="text-xs">{item.Text}</div>
                                            </div>
                                            <div className="text-end">
                                                <div className="text-dark text-xs">{item.UpdatedUser}</div>
                                                <div 
                                                    className="text-xs text-secondary"
                                                    title={!!updated ? format(updatedLocalDate, "dd/MM/yyyy HH:mm:ss") : '00-00-00'}
                                                >
                                                    { !!updated ? formatDistanceToNow(new Date(updatedLocalDate)) : '(unknow)'}
                                                </div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                );
                            })
                        }
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#fef5d6'}}>
                    <Button 
                        variant="link" 
                        className="text-secondary mb-0"
                        onClick={onCloseModal}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default NotesListModal