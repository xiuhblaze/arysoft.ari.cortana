import { useEffect, useState } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { useAppFormsStore } from '../../../hooks/useAppFormsStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { useContactsStore } from '../../../hooks/useContactStore';
import enums from '../../../helpers/enums';
import { faEnvelope, faPhone, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isString from '../../../helpers/isString';
import { setContactsList, useAppFormController } from '../context/appFormContext';

const AppFormEditContacts = ({ ...props }) => {
    const [ controller, dispatch ] = useAppFormController();
    const { contactsList } = controller;

    const { DefaultStatusType } = enums();

    // CUSTOM HOOKS

    const { organization } = useOrganizationsStore();
    const { contacts } = useContactsStore();
    const {
        appForm,
        contactAddAsync,
        contactDelAsync,
    } = useAppFormsStore();

    // HOOKS

    const [contactSelected, setContactSelected] = useState(null);
    const [disabledButtons, setDisabledButtons] = useState(false);

    // METHODS

    const onContactSelected = (e) => {
        setContactSelected(e.target.value);
    };

    const onClickAdd = () => {
        setDisabledButtons(true);
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
            }).catch(err => {
                console.log('onClickAdd', err);
                Swal.fire('Add contact', err, 'error');
            });
        setDisabledButtons(false);
    }; // onClickAdd

    const onClickRemove = (id) => {
        setDisabledButtons(true);
        contactDelAsync(id)
            .then(data => {
                if (!!data) {
                    setContactsList(dispatch, contactsList.filter(i => i.ID != id));
                }
            })
            .catch(err => {
                console.log('onClickRemove', err);
                Swal.fire('Remove contact', err, 'error');
            });
        setDisabledButtons(false);
    } // onClickRemove

    return (
        <Row {...props}>
            <Col xs="8" sm="10">
                <label className="form-label">Contacts</label>
                <select 
                    className="form-select" 
                    value={contactSelected ?? ''} 
                    onChange={onContactSelected}
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
                        disabled={disabledButtons}
                    >
                        Add
                    </button>
                </div>
            </Col>
            <Col xs="12">
                <ListGroup variant='flush' className="mb-3">
                    {
                        contactsList
                            //.sort((a, b) => a.FullName.localeCompare(b.FullName))
                            .map(item => 
                                <ListGroup.Item key={item.ID} className="bg-transparent border-0 py-1 ps-0 text-xs">
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
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 mb-0 text-secondary"
                                            onClick={() => onClickRemove(item.ID)}
                                            title="Delete"
                                            disabled={disabledButtons}
                                        >   
                                            <FontAwesomeIcon icon={faTrashCan} size="lg" />
                                        </button>
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