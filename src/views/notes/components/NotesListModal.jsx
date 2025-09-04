import { useState } from 'react';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ListGroup, Modal } from 'react-bootstrap'
import { format, formatDistanceToNow } from "date-fns";
import aryDateTools from '../../../helpers/aryDateTools';

const NotesListModal = ({notes, buttonLabel, order = 'desc', ...props}) => {
    const { 
        getFriendlyDate,
        getLocalDate,
    } = aryDateTools();
    const notesOrdered = !!notes 
        ? [...notes].sort((a, b) => { // Sino se hace así, marca: 0 is read-only
                const aDate = new Date(a.Updated);
                const bDate = new Date(b.Updated);

                if (order == 'asc') {
                    return aDate < bDate ? -1 : 1;
                }                
                return aDate > bDate ? -1 : 1;
            }) 
        : [];

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
                { ...props }
                variant="link"
                className="text-dark p-0 mb-0"
                onClick={onShowModal}
                disabled={ notes.length == 0 }
                title={ notes.length == 0 ? 'No notes' : `Notes (${notes.length})` }
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
                            notesOrdered.map(item => 
                                <ListGroup.Item key={item.ID} variant="warning">
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faStickyNote} className="text-warning me-3" />
                                            <div className="text-xs">{item.Text}</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-dark text-xs">{item.UpdatedUser}</div>
                                            <div 
                                                className="text-xs text-secondary"
                                                title={!!item.Updated ? format(getLocalDate(item.Updated), "dd/MM/yyyy HH:mm:ss") : '00-00-00'}
                                            >
                                                { !!item.Updated ? getFriendlyDate(new Date(item.Updated), true) : '(unknow)'} 
                                            </div>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#fef5d6'}}>
                    <Button 
                        variant="link" 
                        className="text-dark mb-0"
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