import { Button, Col, Image, ListGroup, Modal, Row, Spinner } from "react-bootstrap";
import { faBan, faEdit, faRotateRight, faSave, faTrash, faUserPen, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import Swal from 'sweetalert2';
// import { formatDistanceToNow, parseISO } from 'date-fns';

import { AryFormikTextArea, AryFormikTextInput } from "../../../components/Forms";
import { useContactsStore } from "../../../hooks/useContactStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import { ViewLoading } from "../../../components/Loaders";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";

// import defaultProfile from '../../../assets/img/phoDefaultProfile.jpg';

const EditContactModal = ({ id, ...props}) => {
    const { 
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
        PHONE_REGEX,
    } = envVariables();
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
        addressInput: '',
        positionInput: '',
        photoFileInput: '',
        isMainContactCheck: false,
        extraInfoInput: '',
        statusCheck: false,
    };

    const validationSchema = Yup.object({
        firstNameInput: Yup.string()
            .required('First name is required')
            .max(50, 'First name is too long'),
        middleNameInput: Yup.string()
            .max(50, 'Middle name is too long'),
        lastNameInput: Yup.string()
            .max(50, 'Last name is too long')
            .when('middleNameInput', {
                is: value => !value || value.length === 0,
                then: () => Yup.string().required('A last name is needed.'),
            }),
        emailInput: Yup.string()
            .email('Email is invalid')
            .max(250, 'Email is too long')
            .required('Email is required'),
        phoneInput: Yup.string()
            .required('Phone is required')
            .max(25, 'Phone is too long')
            .matches(PHONE_REGEX, 'Phone is invalid'),
        addressInput: Yup.string()
            .max(500, 'Address is too long'),
        positionInput: Yup.string()
            .max(250, 'Poistion is too long'),
        photoFileInput: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file update error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop()?.toLowerCase() ?? '';
                        const validTypes = ['jpg', 'png'];
                        if (!validTypes.includes(extension)) {
                            return ctx.createError({
                                message: 'Only files with png or jpg extensions are allowed'
                            });
                        }
                    }
                    return true;
                }
            }),
        extraInfoInput: Yup.string()
            .max(1000, 'Extra info is too long'),
    });

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isContactLoading,
        isContactCreating,
        // contactCreatedOk,
        isContactSaving,
        contactSavedOk,
        contact,
        contactsAsync,
        contactAsync,
        contactCreateAsync,
        contactSaveAsync,
        contactDeleteFileAsync,
        contactClear,
        contactsErrorMessage,
    } = useContactsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [newPhoto, setNewPhoto] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);    
    // const [isMainContactCheck, setIsMainContactCheck] = useState(false);

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
                extraInfoInput: contact?.ExtraInfo ?? '',
                statusCheck: contact?.Status === DefaultStatusType.active,
            });

            // setIsMainContactCheck(contact?.IsMainContact ?? false);
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

    useEffect(() => {
        if (!!contactsErrorMessage) {
            Swal.fire('Contact', contactsErrorMessage, 'error');
            // contactClear();
            // setShowModal(false);
        }
    }, [contactsErrorMessage]);
    

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
            ExtraInfo: values.extraInfoInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        contactSaveAsync(toSave, values.photoFileInput);
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
                            validationSchema={ validationSchema }
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
                                                                type="button"
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
                                                                accept="image/jpeg,image/png"
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
                                                            <Image src={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${contact.OrganizationID}/contacts/${contact.ID}/${contact.PhotoFilename}`}
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
                                            <Col xs="12" sm="4">
                                                <AryFormikTextInput name="positionInput"
                                                    label="Position"
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <AryFormikTextInput name="emailInput"
                                                    label="E-Mail"
                                                    placeholder="name@example.com"
                                                />
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <AryFormikTextInput name="phoneInput"
                                                    label="Phone number"
                                                    placeholder="00-0000-0000"
                                                    helpText="[0000000000] [x0000]"
                                                />
                                            </Col>                                        
                                            <Col xs="12" sm="6">
                                                <AryFormikTextArea name="addressInput"
                                                    label="Address"
                                                    placeholder="3312 Example Street, City 00000"
                                                    rows={3}
                                                />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <AryFormikTextArea name="extraInfoInput"
                                                    label="Extra info"
                                                    placeholder="Extra info"
                                                    rows={3}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                {/* <div className="form-check form-switch">
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
                                                </div> */}
                                                <div className="form-check form-switch">
                                                    <input id="isMainContactCheck" name="isMainContactCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={formik.handleChange}
                                                        checked={formik.values.isMainContactCheck}
                                                    />
                                                    <label
                                                        className="form-check-label text-secondary mb-0"
                                                        htmlFor="isMainContactCheck"
                                                    >
                                                        Is main contact
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <div className="form-check form-switch">
                                                    <input id="statusCheck" name="statusCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={formik.handleChange}
                                                        checked={formik.values.statusCheck}
                                                    />
                                                    <label 
                                                        className="form-check-label text-secondary mb-0"
                                                        htmlFor="statusCheck"
                                                    >
                                                        Active
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-between align-items-center w-100">
                                            <div className="text-secondary">
                                                <AryLastUpdatedInfo item={contact} />
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