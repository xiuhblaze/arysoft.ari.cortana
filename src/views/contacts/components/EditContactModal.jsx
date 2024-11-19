import { faUserPen, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useContactsStore } from "../../../hooks/useContactStore";
import enums from "../../../helpers/enums";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { Form, Formik } from "formik";
import { AryFormikTextInput } from "../../../components/Forms";

const EditContactModal = ({ id, ...props}) => {
    const label = !!id ? 'Edit' : 'Add';

    const { DefaultStatusType } = enums();

    const formDefaultValues = {
        firstNameInput: '',
        middleNameInput: '',
        lastNameInput: '',
        emailInput: '',
        phoneInput: '',
        phoneAltInput: '',
        locationDescriptionInput: '',
        positionInput: '',
        photoFileInput: '',
    };

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isContactLoading,
        isContactCreating,
        contactCreatedOk,
        contact,
        contactAsync,
        contactCreateAsync,
        contactClear,
    } = useContactsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [initialValues, setInitialValues] = useState(formDefaultValues);



    // useEffect(() => {
    //     if (contactCreatedOk && !!contact) {
    //         console.log(contact);
    //     }

    // }, [contactCreatedOk]);

    useEffect(() => {
        if (!!contact) {
            console.log(contact);
            
            setInitialValues({
                firstNameInput: contact?.FirstName ?? '',
                middleNameInput: contact?.MiddleName ?? '',
                lastNameInput: contact?.LastName ?? '',
                emailInput: contact?.Email ?? '',
                phoneInput: contact?.Phone ?? '',
                phoneAltInput: contact?.PhoneAlt ?? '',
                locationDescriptionInput: contact?.LocationDescription ?? '',
                positionInput: contact?.Position ?? '',
                photoFileInput: '',
            });
        }
    }, [contact]);
    
    


    // METHODS

    const onShowModal = () => {

        if (!id) {
            console.log('Crear nuevo contacto');
            contactCreateAsync({
                OrganizationID: organization.ID,
            });
        } else {
            console.log('Editar un contacto existente');
            contactAsync(id);
        }


        setShowModal(true);
    } // onShowModal

    const onCloseModal = () => {

        contactClear();
        setShowModal(false);
    } // onCloseModal

    const onFormSubmit = (values) => {
        console.log(values);
    };

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
            <Modal show={ showModal } onHide={ onCloseModal }>
                <Modal.Header closeButton>
                    <Modal.Title>{ label } Contact</Modal.Title>
                </Modal.Header>
                {
                    isContactCreating || isContactLoading ? (
                        <Spinner anumation="border" variant="info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : !!contact ? (
                        <Formik
                            initialValues={ initialValues }
                            onSubmit={ onFormSubmit }
                            enableReinitialize
                        >
                            { formik => (
                                <Form>
                                    <Modal.Body>
                                        <AryFormikTextInput name="firstNameInput"
                                            label="First name"
                                            placeholder="First Name"
                                        />
                                        <AryFormikTextInput name="middleNameInput"
                                            label="Middle name"
                                            placeholder="Middle Name"
                                        />
                                        <AryFormikTextInput name="lastNameInput"
                                            label="Last name"
                                            placeholder="Last Name"
                                        />
                                    </Modal.Body>
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