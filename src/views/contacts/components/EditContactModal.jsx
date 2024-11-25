import { Button, Col, Image, ListGroup, Modal, Row, Spinner } from "react-bootstrap";
import { faBan, faEdit, faRotateRight, faSave, faTrash, faUserPen, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { formatDistanceToNow, parseISO } from 'date-fns';

import { AryFormikTextInput } from "../../../components/Forms";
import { useContactsStore } from "../../../hooks/useContactStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { ViewLoading } from "../../../components/Loaders";

const EditContactModal = ({ id, ...props}) => {
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

    const { VITE_FILES_URI } = envVariables();
    const { 
        DefaultStatusType,
        ContactOrderType,
    } = enums();

    const formDefaultValues = {
        firstNameInput: '',
        middleNameInput: '',
        lastNameInput: '',
        emailInput: '',
        phoneInput: '',
        phoneAltInput: '',
        addressInput: '',
        positionInput: '',
        photoFileInput: '',
        isMainContactCheck: false,
        statusCheck: false,
    };

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isContactLoading,
        isContactCreating,
        contactCreatedOk,
        isContactSaving,
        contactSavedOk,
        contact,
        contactsAsync,
        contactAsync,
        contactCreateAsync,
        contactSaveAsync,
        contactSaveWithFileAsync,
        contactDeleteFileAsync,
        contactClear,
    } = useContactsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [newPhoto, setNewPhoto] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [activeAccount, setActiveAccount] = useState(false);
    const [isMainContactCheck, setIsMainContactCheck] = useState(false);

    useEffect(() => {
        if (!!contact) {
            // console.log(contact);
            
            setInitialValues({
                firstNameInput: contact?.FirstName ?? '',
                middleNameInput: contact?.MiddleName ?? '',
                lastNameInput: contact?.LastName ?? '',
                emailInput: contact?.Email ?? '',
                phoneInput: contact?.Phone ?? '',
                phoneAltInput: contact?.PhoneAlt ?? '',
                addressInput: contact?.Address ?? '',
                positionInput: contact?.Position ?? '',
                photoFileInput: '',
                isMainContactCheck: contact?.IsMainContact ?? false,
                statusCheck: contact?.Status === DefaultStatusType.active,
            });

            setActiveAccount(contact?.Status === DefaultStatusType.active);
            setIsMainContactCheck(contact?.IsMainContact ?? false);
            setNewPhoto(!contact.PhotoFilename);
        }
    }, [contact]);
    
    useEffect(() => {
        if (contactSavedOk) {
            Swal.fire('Contact', `Contact ${ !id ? 'created' : 'updated' } successfully`, 'success');
            contactsAsync({
                organizationID: organization.ID,
                pageSize: 0,
                order: ContactOrderType.isMainContactDesc,
            })
            contactClear();
            setShowModal(false);
        }
    }, [contactSavedOk]);

    // METHODS

    const onShowModal = () => {

        if (!id) {
            // console.log('Crear nuevo contacto');
            contactCreateAsync({
                OrganizationID: organization.ID,
            });
        } else {
            // console.log('Editar un contacto existente');
            contactAsync(id);
        }


        setShowModal(true);
    } // onShowModal

    const onCloseModal = () => {

        contactClear();
        setShowModal(false);
    } // onCloseModal

    const onFormSubmit = (values) => {
        const toSave = {
            ID: contact.ID,
            FirstName: values.firstNameInput, 
            MiddleName: values.middleNameInput,
            LastName: values.lastNameInput,
            Email: values.emailInput,
            Phone: values.phoneInput,
            PhoneAlt: values.phoneAltInput,
            Address: values.addressInput,
            Position: values.positionInput,
            IsMainContact: values.isMainContactCheck,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive, //contact.Status,
        };

        contactSaveWithFileAsync(toSave, values.photoFileInput);
    }; // onFormSubmit

    const onDeleteFile = () => {
        
         contactDeleteFileAsync(contact.ID)
            .then( data => {
                if (!!data) {
                    setNewPhoto(true);
                }
            }).catch( err => {
                console.log(err);
            });
    }; // onDeleteFile

    return (
        <>
            <Button 
                variant="link" 
                className="text-dark p-0 mb-0"
                onClick={ onShowModal } 
                title={ !!id ? 'Edit contact' : 'Add contact'}
            >
                <FontAwesomeIcon icon={ !!id ? faUserPen : faUserPlus } size="lg" />
            </Button>
            <Modal show={ showModal } onHide={ onCloseModal } size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {
                            !!id ? (
                                <>
                                    <FontAwesomeIcon icon={ faUserPen } className="px-3" />
                                    Edit contact
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={ faUserPlus } className="px-3" />
                                    Add contact
                                </>
                            )
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    isContactCreating || isContactLoading ? (
                        <ViewLoading />
                    ) : !!contact ? (
                        <Formik
                            initialValues={ initialValues }
                            onSubmit={ onFormSubmit }
                            enableReinitialize
                        >
                            { formik => (
                                <Form>
                                    <Modal.Body>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <div className="d-flex justify-content-between">
                                                    <label className="form-label">Photo profile</label>
                                                    {
                                                        !newPhoto && !!contact.PhotoFilename &&
                                                        <div className="d-flex justify-content-end gap-3">
                                                            <button 
                                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                                onClick={ () => { setNewPhoto(true) }}
                                                                title="Upload new photo profile"
                                                            >
                                                                <FontAwesomeIcon icon={ faRotateRight } size="lg" />
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                                onClick={ onDeleteFile }
                                                                title="Delete photo profile"
                                                            >
                                                                <FontAwesomeIcon icon={ faTrash } size="lg" />
                                                            </button>
                                                        </div>
                                                    }
                                                    {
                                                        !!newPhoto && !!contact.PhotoFilename &&
                                                        <div className="text-end">
                                                            <button type="button"
                                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                                onClick={ () => { 
                                                                    setNewPhoto(false);
                                                                    formik.setFieldValue('photoFileInput', '');
                                                                }}
                                                                title="Cancel upload new file"
                                                            >
                                                                <FontAwesomeIcon icon={ faBan } size="lg" />
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                                {
                                                    !!newPhoto ? (
                                                        <>
                                                            {
                                                                !!photoPreview &&
                                                                <div>
                                                                    <Image src={ photoPreview }
                                                                        thumbnail
                                                                        fluid
                                                                        className="mb-3"
                                                                    />
                                                                </div>
                                                            }
                                                            <input 
                                                                type="file"
                                                                name="photoFile"
                                                                accept="image/*"
                                                                className="form-control"
                                                                onChange={(e) => {
                                                                    const fileReader = new FileReader();
                                                                    fileReader.onload = () => {
                                                                        if (fileReader.readyState === 2) {
                                                                            // formik.setFieldValue('photoFileInput', fileReader.result);
                                                                            setPhotoPreview(fileReader.result);
                                                                        }
                                                                    };
                                                                    fileReader.readAsDataURL(e.target.files[0]);
                                                                    formik.setFieldValue('photoFileInput', e.currentTarget.files[0]);
                                                                }}
                                                            />
                                                        </>
                                                    ) : !!contact.PhotoFilename && 
                                                        <div>
                                                            <Image src={`${VITE_FILES_URI}/contacts/${contact.PhotoFilename}`}
                                                                thumbnail
                                                                fluid
                                                                className="mb-3"
                                                            />
                                                        </div>
                                                    
                                                }
                                            </Col>
                                            <Col xs="12" sm="8">
                                                <Row>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="firstNameInput"
                                                            label="First name"
                                                            placeholder="First Name"
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="middleNameInput"
                                                            label="Middle name"
                                                            placeholder="Middle Name"
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="lastNameInput"
                                                            label="Last name"
                                                            placeholder="Last Name"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <AryFormikTextInput name="positionInput"
                                                    label="Position"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <AryFormikTextInput name="emailInput"
                                                    label="E-Mail"
                                                    placeholder="name@example.com"
                                                />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <AryFormikTextInput name="phoneInput"
                                                    label="Phone number"
                                                    placeholder="000-000-0000"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <AryFormikTextInput name="addressInput"
                                                    label="Address"
                                                    placeholder="3312 Example Street, City 00000"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <div className="form-check form-switch">
                                                    <input id="isMainContactCheck" name="isMainContactCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={ (e) => {
                                                            const isChecked = e.target.checked;
                                                            formik.setFieldValue('isMainContactCheck', isChecked);
                                                            setIsMainContactCheck(isChecked);
                                                        }}
                                                        checked={ formik.values.isMainContactCheck }
                                                    />
                                                    <label
                                                        className="form-check-label text-secondary mb-0"
                                                        htmlFor="isMainContactCheck"
                                                    >
                                                        {
                                                            isMainContactCheck ? 'Is main contact' : 'Is alternative contact'
                                                        }
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <div className="form-check form-switch">
                                                    <input id="statusCheck" name="statusCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        // onChange={ formik.handleChange }
                                                        onChange= { (e) => {
                                                            const isChecked = e.target.checked;
                                                            formik.setFieldValue('statusCheck', isChecked);
                                                            setActiveAccount(isChecked);
                                                        }} 
                                                        checked={ formik.values.statusCheck }
                                                    />
                                                    <label 
                                                        className="form-check-label text-secondary mb-0"
                                                        htmlFor="statusCheck"
                                                    >
                                                        { 
                                                            activeAccount ? 'Active account' : 'Inactive account'
                                                        }
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-between align-items-center w-100">
                                            <div>
                                                {
                                                    !!contact && (
                                                        <ListGroup className="opacity-7">
                                                            <ListGroup.Item className="border-0 py-0 ps-0 text-xs text-secondary">
                                                                <strong className="me-2">Created:</strong>
                                                                { formatDistanceToNow(new Date(contact.Created)) }
                                                                {/* { contact.Created.toLocaleString() } */}
                                                            </ListGroup.Item>
                                                            <ListGroup.Item className="border-0 py-0 ps-0 text-xs text-secondary">
                                                                <strong className="me-2">Updated:</strong>
                                                                { formatDistanceToNow(new Date(contact.Updated)) }
                                                                {/* { contact.Updated.toLocaleString() } */}
                                                            </ListGroup.Item>
                                                            <ListGroup.Item className="border-0 py-0 ps-0 text-xs text-secondary">
                                                                <strong className="me-2">Updated by:</strong>
                                                                { contact.UpdatedUser }
                                                            </ListGroup.Item>
                                                        </ListGroup>
                                                    )
                                                }
                                            </div>
                                            <div className="d-flex justify-content-end gap-2">
                                                <button type="submit" 
                                                    className="btn bg-gradient-dark mb-0"
                                                    disabled={ isContactSaving}
                                                >
                                                    <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
                                                    Save
                                                </button>
                                                <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCloseModal}>
                                                    {/* <FontAwesomeIcon icon={faArrowRightToBracket} className="me-1" size="lg" /> */}
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </Modal.Footer>
                                </Form>
                            )}
                        </Formik>
                    ) : null
                }
            </Modal>
        </>
    );
}; // EditContactModal

export default EditContactModal;