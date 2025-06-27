import { useEffect, useState } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { useAppFormsStore } from '../../../hooks/useAppFormsStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useContactsStore } from '../../../hooks/useContactStore';
import enums from '../../../helpers/enums';
import { faEnvelope, faPhone, faSpinner, faStickyNote, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isString from '../../../helpers/isString';
import { setContactsList, useAppFormController } from '../context/appFormContext';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';

const AppFormEditContacts = ({ readonly = false, ...props }) => {
    const [ controller, dispatch ] = useAppFormController();
    const { contactsList } = controller;

    const { DefaultStatusType } = enums();

    // CUSTOM HOOKS

    const { contacts } = useContactsStore(); // Este viene cargado desde OrganizationEditView
    const {
        contactAddAsync,
        contactDelAsync,
    } = useAppFormsStore();

    // HOOKS

    const [contactSelected, setContactSelected] = useState(null);
    const [isAdding, setIsAddging] = useState(false); 
    const [isDeleting, setIsDeleting] = useState(null);

    // METHODS

    const onContactSelected = (e) => {
        setContactSelected(e.target.value);
    };

    const onClickAdd = () => {

        if (readonly) { return; }

        setIsAddging(true);
        contactAddAsync(contactSelected)
            .then(data => {
                if (!!data) {
                    const myContact = contacts.find(i => i.ID == contactSelected);

                    if (!!myContact) {
                        setContactsList(dispatch, [
                            ...contactsList,
                            myContact,
                        ]);
                    }
                    setContactSelected(null);
                }
                setIsAddging(false);
            }).catch(err => {
                console.log('onClickAdd', err);
                Swal.fire('Add contact', err, 'error');
                setIsAddging(false);
            });
        
    }; // onClickAdd

    const onClickRemove = (id) => {

        if (readonly) { return; }

        setIsDeleting(id);
        contactDelAsync(id)
            .then(data => {
                if (!!data) {
                    setContactsList(dispatch, contactsList.filter(i => i.ID != id));
                }
                setIsDeleting(null);
            })
            .catch(err => {
                console.log('onClickRemove', err);
                Swal.fire('Remove contact', err, 'error');
                setIsDeleting(null);
            });
    } // onClickRemove

    return (
        <Row {...props}>
            {
                readonly ? (
                    <Col xs="8" sm="10">
                        <label className="form-label">Contacts</label>
                    </Col>
                 ) : (
                <>
                    <Col xs="8" sm="10">
                        <label className="form-label">Contacts</label>
                        <select 
                            className="form-select" 
                            value={contactSelected ?? ''} 
                            onChange={onContactSelected}
                            disabled={ isAdding || isDeleting }
                        >
                            <option value="">(select a contact)</option>
                            {
                                !!contacts && contacts.length > 0 && contacts.map(contact => (
                                    <option 
                                        key={contact.ID} 
                                        value={contact.ID}
                                        disabled={ contact.Status != DefaultStatusType.active }
                                    >
                                        {contact.FullName}
                                    </option>
                                ))
                            }
                        </select>
                    </Col>
                    <Col xs="4" sm="2">
                        <div className="d-grid gap-1 align-items-end">
                            <label className="form-label">&nbsp;</label>
                            <button type="button"
                                className="btn btn-link text-dark px-2"
                                onClick={onClickAdd}
                                disabled={ isAdding }
                            >
                                { isAdding ? <FontAwesomeIcon icon={ faSpinner } spin /> : 'ADD' }
                            </button>
                        </div>
                    </Col>
                </>
            )}
            <Col xs="12">
                <ListGroup variant='flush' className="mb-3">
                    {
                        contactsList
                            .map(item => 
                                <ListGroup.Item key={item.ID} 
                                    className={`bg-transparent border-0 py-1 px-0 text-xs${ item.Status != DefaultStatusType.active ? ' opacity-6' : ''}`}
                                    title={ item.Status != DefaultStatusType.active ? 'Inactive' : '' }
                                > 
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex justify-content-start align-items-center">
                                            <FontAwesomeIcon icon={ faUser } className="me-2" size="lg" />
                                            <div className="d-flex flex-column">
                                                <div className="d-flex gap-2">
                                                    <span className="text-dark font-weight-bold">
                                                        {item.FullName}
                                                    </span>
                                                    {
                                                        isString(item.Position) &&
                                                        <span className="text-secondary" title="Position">
                                                            - {item.Position}
                                                        </span>
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-start align-items-center gap-2">
                                                    { 
                                                        isString(item.Email) &&
                                                        <span>
                                                            <FontAwesomeIcon icon={ faEnvelope } className="me-1" />
                                                            <a href={`mailto:${item.Email}`} >
                                                                {item.Email}
                                                            </a>
                                                        </span>
                                                    }
                                                    {
                                                        isString(item.Phone) &&
                                                        <span>
                                                            <FontAwesomeIcon icon={ faPhone } className="me-1" />
                                                            <span>{item.Phone}</span>
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end align-items-center">
                                            {
                                                isNullOrEmpty(item.ExtraInfo) ? null :
                                                <FontAwesomeIcon 
                                                    icon={ faStickyNote } 
                                                    size="lg" 
                                                    title={ item.ExtraInfo }
                                                    className="me-2"
                                                />
                                            }
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                onClick={() => onClickRemove(item.ID)}
                                                title="Delete"
                                                disabled={isDeleting == item.ID || readonly}
                                            >   
                                                {
                                                    isDeleting == item.ID 
                                                        ? <FontAwesomeIcon icon={ faSpinner } spin size="lg" />
                                                        : <FontAwesomeIcon icon={ faTrashCan } size="lg" />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            )
                    }
                </ListGroup>
            </Col>
        </Row>
    )
}

export default AppFormEditContacts