import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import defaultProfile from '../../assets/img/phoDefaultProfile.jpg';
import { setNavbarTitle, useArysoftUIController } from '../../context/context';
import enums from '../../helpers/enums';
import { useAuditorsStore } from '../../hooks/useAuditorsStore';
import { getFullName } from '../../helpers/getFullName';
import Swal from 'sweetalert2';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { ViewLoading } from '../../components/Loaders';

import imgHeaderBackground from '../../assets/img/bgWavesWhite.jpg';
import defaultStatusProps from '../../helpers/defaultStatusProps';
import isNullOrEmpty from '../../helpers/isNullOrEmpty';
import AryDefaultStatusBadge from '../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import { Form, Formik } from 'formik';

import * as Yup from "yup";
import { AryFormikTextInput } from '../../components/Forms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHome, faPhone, faSave } from '@fortawesome/free-solid-svg-icons';
import AryLastUpdatedInfo from '../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';

const AuditorEditView = () => {
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
    const { 
        DefaultStatusType,
        AuditorIsLeaderType,
    } = enums();

    const formDefaultValues = {
        firstNameInput: '',
        middleNameInput: '',
        lastNameInput: '',
        emailInput: '',
        phoneInput: '',
        addressInput: '',
        isLeadAuditorCheck: false,
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        firstNameInput: Yup.string()
            .required('Must specify first name')
            .max(50, 'The first name cannot exceed more than 50 characters'),
        middleNameInput: Yup.string()
            .max(50, 'The middle name cannot exceed more than 50 characters'),
        lastNameInput: Yup.string()
            .max(50, 'The last name cannot exceed more than 50 characters')
            .when('middleNameInput', { 
                is: value => !value || value.length === 0,
                then: () => Yup.string().required('A last name is needed.'),
            }),
        emailInput: Yup.string()
            .email('The email has an invalid format')
            .max(250, 'The email cannot exceed more than 250 characters'),
        phoneInput: Yup.string()
            .max(25, 'The phone number cannot exceed more than 25 characters')
            .matches(phoneRegExp, 'The phone number has an invalid format'),
        addressInput: Yup.string()
            .max(500, 'The last name cannot exceed more than 500 characters')
    });


    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();

    const {
        isAuditorLoading,
        isAuditorSaving,
        auditorSavedOk,
        isAuditorDeleting,
        auditorDeletedOk,
        auditor,
        auditorsErrorMessage,

        auditorAsync,
        auditorSaveAsync,
        auditorDeleteAsync,
        auditorClear,
    } = useAuditorsStore();

    // HOOKS

    const { id } = useParams();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [avatarPreview, setAvatarPreview] = useState(defaultProfile);
    const [activeAccountCheck, setActiveAccountCheck] = useState(false);
    const [isLeadAuditorCheck, setIsLeadAuditorCheck] = useState(false);
    
    const [fullName, setFullName] = useState("(new auditor)");

    useEffect(() => {
        if (!!id) auditorAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!auditor) {
            const name = getFullName(auditor);
            setNavbarTitle(dispatch, name);

            if (!isNullOrEmpty(name)) setFullName(name);

            setInitialValues({
                firstNameInput: auditor?.FirstName ?? '',
                middleNameInput: auditor?.MiddleName ?? '',
                lastNameInput: auditor?.LastName ?? '',
                emailInput: auditor?.Email ?? '',
                phoneInput: auditor?.Phone ?? '',
                addressInput: auditor?.Address ?? '',
                isLeadAuditorCheck: auditor?.IsLeadAuditor,
                statusCheck: auditor?.Status === DefaultStatusType.active,
            });

            setIsLeadAuditorCheck(auditor?.IsLeadAuditor);
            setActiveAccountCheck(auditor?.Status === DefaultStatusType.active);
        }
    }, [auditor]);

    useEffect(() => {
        if (!!auditorSavedOk) {
            Swal.fire('Auditor', 'Auditor created|updated successfully', 'success');
            auditorClear();
            navigate('/auditors/');
        }
    }, [auditorSavedOk]);
    

    //* Aqui faltan useEffects...

    useEffect(() => {
        if (!!auditorsErrorMessage) {
            Swal.fire('Auditor', auditorsErrorMessage, 'error');
        }
    }, [auditorsErrorMessage]);
    
    // METHODS

    const onFormSubmit = (values) => {
        const toSave = {
            ID: auditor.ID,
            FirstName: values.firstNameInput, 
            MiddleName: values.middleNameInput,
            LastName: values.lastNameInput,
            Email: values.emailInput,
            Phone: values.phoneInput,
            Address: values.addressInput,
            IsLeadAuditor: values.isLeadAuditorCheck,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        console.log('onFormSubmit', toSave);

        auditorSaveAsync(toSave);
    }; // onFormSubmit

    const onCancelButton = () => {
        auditorClear();
        navigate('/auditors/');
    }; // onCancelButton

    const onDismissButton = () => {
        console.log('onDismissButton');
    };
    
    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col xs="12">
                    <Card>
                        {
                            isAuditorLoading ? (
                                <Card.Body>
                                    <ViewLoading />
                                </Card.Body>
                            ) : !!auditor && (
                                <>
                                    <Card.Body>
                                        <div 
                                            className="page-header min-height-150 border-radius-lg"
                                            style={{
                                                background: `url(${imgHeaderBackground})`,
                                                backgroundPositionY: '50%'
                                            }}
                                        >
                                            <span className={`mask bg-gradient-${defaultStatusProps[auditor.Status].bgColor} opacity-6`} />
                                        </div>
                                        <div className="card card-body blur shadow-blur mx-4 mt-n7 overflow-hidden">
                                            <Row className="gx-4">
                                                <div className="col-auto">
                                                    <div className="avatar avatar-xl position-relative">
                                                        <img 
                                                            src={ isNullOrEmpty(auditor.PhotoFilename) //! Aun a esto le falta algo, que pasa si selecciono una nueva imagen?
                                                                ? avatarPreview
                                                                : `/files/auditors/${auditor.ID}/${auditor.PhotoFilename}`
                                                            } 
                                                            className="border-radius-md"
                                                            alt="Profile photo"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-auto my-auto">
                                                    <div className="h-100">
                                                        <h5 className="mb-1">
                                                            { fullName }
                                                        </h5>
                                                        <p className="mb-0 font-weight-bold text-sm">
                                                            Update data
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3 text-end">
                                                    <AryDefaultStatusBadge value={ auditor.Status} />
                                                </div>
                                            </Row>
                                        </div>
                                    </Card.Body>
                                        <Formik
                                            initialValues={ initialValues }
                                            validationSchema={ validationSchema }
                                            enableReinitialize
                                            onSubmit={ onFormSubmit }
                                        >
                                            { formik => (
                                                <Form>
                                                    <Card.Body className="pt-0">
                                                    <Row>
                                                        <Col xs="12" sm="4">
                                                            <AryFormikTextInput 
                                                                name="firstNameInput"
                                                                label="First name"
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="4">
                                                            <AryFormikTextInput 
                                                                name="middleNameInput" 
                                                                label="Middle name"
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="4">
                                                            <AryFormikTextInput 
                                                                name="lastNameInput"
                                                                label="Last name"
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <AryFormikTextInput 
                                                                name="emailInput"
                                                                label="Email"
                                                                startLabel={ <FontAwesomeIcon icon={ faEnvelope } /> }
                                                                placeholder="name@example.com"
                                                            />
                                                        </Col>
                                                        <Col xs="12" sm="6">
                                                            <AryFormikTextInput 
                                                                name="phoneInput"
                                                                label="Phone number"
                                                                startLabel={ <FontAwesomeIcon icon={ faPhone } /> }
                                                                placeholder="000-000-0000"
                                                            />
                                                        </Col>
                                                        <Col xs="12">
                                                            <AryFormikTextInput 
                                                                name="addressInput"
                                                                label="Address"
                                                                startLabel={ <FontAwesomeIcon icon={ faHome } /> }
                                                                placeholder="3312 Example Street, City 00000"
                                                            />
                                                        </Col>
                                                        <Col xd="12" sm="4">
                                                            <div className="form-check form-switch">
                                                                <input id="isLeadAuditorCheck" name="isLeadAuditorCheck"
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    onChange={ (e) => {
                                                                        const isChecked = e.target.checked;
                                                                        formik.setFieldValue('isLeadAuditorCheck', isChecked);
                                                                        setIsLeadAuditorCheck(isChecked);
                                                                    }}
                                                                    checked={ formik.values.isLeadAuditorCheck }
                                                                />
                                                                <label
                                                                    className="form-check-label text-secondary mb-0"
                                                                    htmlFor="isLeadAuditorCheck"
                                                                >
                                                                    {
                                                                        isLeadAuditorCheck ? 'Is lead auditor' : 'Is lead auditor'
                                                                    }
                                                                </label>
                                                            </div>
                                                        </Col>
                                                        <Col xd="12" sm="4">
                                                            <div className="form-check form-switch">
                                                                <input id="statusCheck" name="statusCheck"
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    onChange={ (e) => {
                                                                        const isChecked = e.target.checked;
                                                                        formik.setFieldValue('statusCheck', isChecked);
                                                                        setActiveAccountCheck(isChecked);
                                                                    }}
                                                                    checked={ formik.values.statusCheck }
                                                                />
                                                                <label
                                                                    className="form-check-label text-secondary mb-0"
                                                                    htmlFor="statusCheck"
                                                                >
                                                                    Active account
                                                                </label>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <div className="d-flex justify-content-between align-items-center w-100">
                                                            <div className="text-secondary">
                                                                <AryLastUpdatedInfo item={ auditor } />
                                                            </div>
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <button type="submit" 
                                                                    className="btn bg-gradient-dark mb-0"
                                                                    disabled={ isAuditorSaving}
                                                                >
                                                                    <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
                                                                    Save
                                                                </button>
                                                                <button type="button" 
                                                                    className="btn btn-link text-secondary mb-0" 
                                                                    onClick={ onCancelButton }>
                                                                    Close
                                                                </button>
                                                            </div>  
                                                        </div>
                                                    </Card.Footer>
                                                </Form>
                                            )}
                                        </Formik>
                                    {/* </Card.Body> */}
                                </>
                            ) 
                        }
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default AuditorEditView