import { useEffect, useState } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { useAppFormsStore } from '../../../hooks/useAppFormsStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
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

    const {
        appForm,
        contactAddAsync,
        contactDelAsync,
    } = useAppFormsStore();

    // HOOKS

    const [contactSelected, setContactSelected] = useState(null);
    //const [contactsList, setContactsList] = useState(contactsListRef.current);
    const [disabledButtons, setDisabledButtons] = useState(false);

    // useEffect(() => {
    //     // console.log('AppFormEditContacts: useEffect: void');
    //     if (!!appForm && !!appForm.Contacts && appForm.Contacts.length > 0) {
    //         setContactsList(dispatch, appForm.Contacts
    //             .map(contact => (
    //                 { 
    //                     ID: contact.ID, 
    //                     FullName: contact.FullName,
    //                     Email: contact.Email,
    //                     Phone: contact.Phone,
    //                     Position: contact.Position,
    //                     Status: contact.Status,
    //                 }
    //             ))
    //         );
    //     }
    // }, []);

    // METHODS

    const onContactSelected = (e) => {
        setContactSelected(e.target.value);
    };

    const onClickAdd = () => {
        setDisabledButtons(true);
        contactAddAsync(contactSelected)
            .then(data => {
                //console.log('onClickAdd', data);
                if (!!data) {
                    const myContact = organization.Contacts.find(i => i.ID == contactSelected);

                    if (!!myContact) {
                        setContactsList(dispatch, [
                            ...contactsList,
                            // { 
                            //     ID: myContact.ID, 
                            //     FullName: myContact.FullName,
                            //     Email: myContact.Email,
                            //     Phone: myContact.Phone,
                            //     Position: myContact.Position,
                            //     Status: myContact.Status,
                            // },
                            myContact,
                        ]);
                    }
                    //onChange(contactsList.length + 1);
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
                //console.log('onClickRemove', data);
                console.log(data, contactsList, id);
                if (!!data) {
                    setContactsList(dispatch, contactsList.filter(i => i.ID != id));
                    // onChange(contactsList.length < 1 ? 0 : contactsList.length - 1);
                    console.log(contactsList.filter(i => i.ID != id))
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
                        !!organization.Contacts && organization.Contacts.length > 0 && organization.Contacts.map(contact => (
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
                            .sort((a, b) => a.FullName.localeCompare(b.FullName))
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