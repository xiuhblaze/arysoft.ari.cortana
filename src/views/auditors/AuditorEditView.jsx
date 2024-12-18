import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { setNavbarTitle, useArysoftUIController } from '../../context/context';
import enums from '../../helpers/enums';
import { useAuditorsStore } from '../../hooks/useAuditorsStore';
import { getFullName } from '../../helpers/getFullName';
import Swal from 'sweetalert2';
import { Card, Col, Container, Image, Nav, Row } from 'react-bootstrap';
import { ViewLoading } from '../../components/Loaders';

import defaultStatusProps from '../../helpers/defaultStatusProps';
import isNullOrEmpty from '../../helpers/isNullOrEmpty';
import AryDefaultStatusBadge from '../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import { Form, Formik } from 'formik';

import * as Yup from "yup";
import { AryFormikTextInput } from '../../components/Forms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEnvelope, faHome, faLandmark, faPhone, faRotateRight, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import AryLastUpdatedInfo from '../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';

import imgHeaderBackground from '../../assets/img/bgWavesWhite.jpg';
import defaultProfile from '../../assets/img/phoDefaultProfile.jpg';
import envVariables from '../../helpers/envVariables';
import AuditorDocumentsCard from './components/AuditorDocumentsCard';
import auditorValidityProps from './helpers/auditorValidityProps';

const AuditorEditView = () => {
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
    const { VITE_FILES_URI } = envVariables();
    const {
        DefaultStatusType,
        AuditorIsLeaderType,
        AuditorDocumentValidityType,
    } = enums();

    const formDefaultValues = {
        firstNameInput: '',
        middleNameInput: '',
        lastNameInput: '',
        emailInput: '',
        phoneInput: '',
        addressInput: '',
        photoFileInput: '',
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
            .max(500, 'The last name cannot exceed more than 500 characters'),
        photoFileInput: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop(); // value.name.split('.').slice(-1)[0]; // https://stackoverflow.com/questions/651563/getting-the-last-element-of-a-split-string-array
                        const validTypes = ['jpg', 'jpeg', 'png'];
                        if (!validTypes.includes(extension)) {
                            return ctx.createError({
                                message: 'Only files with png or jpg extensions are allowed'
                            });
                        }
                    }
                    return true;
                }
            }),
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
        auditorDeleteFileAsync,
        auditorClear,
    } = useAuditorsStore();

    // HOOKS

    const { id } = useParams();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [newPhoto, setNewPhoto] = useState(false);
    const [activeAccountCheck, setActiveAccountCheck] = useState(false);
    const [isLeadAuditorCheck, setIsLeadAuditorCheck] = useState(false);
    const [navOptions, setNavOptions] = useState("documents")

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
                photoFileInput: '',
                isLeadAuditorCheck: auditor?.IsLeadAuditor ?? false,
                statusCheck: auditor?.Status === DefaultStatusType.active,
            });

            setIsLeadAuditorCheck(auditor?.IsLeadAuditor);
            setActiveAccountCheck(auditor?.Status === DefaultStatusType.active);
            setNewPhoto(isNullOrEmpty(auditor.PhotoFilename));
        }
    }, [auditor]);

    useEffect(() => {
        if (!!auditorSavedOk) {
            Swal.fire('Auditor', 'Changes made successfully', 'success');
            auditorClear();
            navigate('/auditors/');
        }
    }, [auditorSavedOk]);

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

        auditorSaveAsync(toSave, values.photoFileInput);
    }; // onFormSubmit

    const onCancelButton = () => {
        auditorClear();
        navigate('/auditors/');
    }; // onCancelButton

    // const onDismissButton = () => {
    //     console.log('onDismissButton');
    // };

    const onDeleteFile = () => {

        auditorDeleteFileAsync(auditor.ID)
            .then(data => {
                if (!!data) setNewPhoto(true);
            })
            .catch(err => {
                console.log(err);
            });
    }; // onDeleteFile

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
                                                        <Image
                                                            src={!!photoPreview
                                                                ? photoPreview
                                                                : !!auditor.PhotoFilename
                                                                    ? `/files/auditors/${auditor.ID}/${auditor.PhotoFilename}`
                                                                    : defaultProfile
                                                            }
                                                            className="border-radius-md"
                                                            alt="Profile photo"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-auto my-auto">
                                                    <div className="h-100">
                                                        <h5 className="mb-1">
                                                            {fullName}
                                                        </h5>
                                                        <p className="mb-0 font-weight-bold text-sm">
                                                            Update auditor's profile
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3 text-end">
                                                    <AryDefaultStatusBadge value={auditor.Status} />
                                                </div>
                                            </Row>
                                        </div>
                                        <Row className="mt-4">
                                            <Col xs="12" sm="6">
                                                <Formik
                                                    initialValues={initialValues}
                                                    validationSchema={validationSchema}
                                                    enableReinitialize
                                                    onSubmit={onFormSubmit}
                                                >
                                                    {formik => (
                                                        <Form>
                                                            <Row>
                                                                <Col xs="12" sm="4">
                                                                    <div className="d-flex justify-content-between">
                                                                        <label className="form-label">Photo profile</label>
                                                                        {
                                                                            !newPhoto && !!auditor.PhotoFilename &&
                                                                            <div className="d-flex justify-content-end gap-3">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-link p-0 mb-0 text-secondary"
                                                                                    onClick={() => setNewPhoto(true)}
                                                                                    title="Upload new photo profile"
                                                                                >
                                                                                    <FontAwesomeIcon icon={faRotateRight} size="lg" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-link p-0 mb-0 text-secondary"
                                                                                    onClick={onDeleteFile}
                                                                                    title="Delete photo file"
                                                                                >
                                                                                    <FontAwesomeIcon icon={faTrash} size="lg" />
                                                                                </button>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !!newPhoto && !isNullOrEmpty(auditor.PhotoFilename) &&
                                                                            <div className="text-end">
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-link p-0 mb-0 text-secondary"
                                                                                    onClick={() => {
                                                                                        setNewPhoto(false);
                                                                                        setPhotoPreview(null);
                                                                                        formik.setFieldValue('photoFileInput', '');
                                                                                    }}
                                                                                    title="Cancel upload new file"
                                                                                >
                                                                                    <FontAwesomeIcon icon={faBan} size="lg" />
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
                                                                                        <Image src={photoPreview}
                                                                                            thumbnail
                                                                                            fluid
                                                                                            className="mb-3"
                                                                                        />
                                                                                    </div>
                                                                                }
                                                                                <input
                                                                                    type="file"
                                                                                    name="photoFile"
                                                                                    accept="image/jpeg,image/png,application/pdf"
                                                                                    className="form-control"
                                                                                    onChange={(e) => {
                                                                                        const fileReader = new FileReader();
                                                                                        fileReader.onload = () => {
                                                                                            if (fileReader.readyState === 2) {
                                                                                                setPhotoPreview(fileReader.result);
                                                                                            }
                                                                                        };
                                                                                        fileReader.readAsDataURL(e.target.files[0]);
                                                                                        formik.setFieldValue('photoFileInput', e.currentTarget.files[0]);
                                                                                    }}
                                                                                />
                                                                                {
                                                                                    formik.touched.photoFileInput && formik.errors.photoFileInput &&
                                                                                    <span className="text-danger text-xs">{formik.errors.photoFileInput}</span>
                                                                                }
                                                                            </>
                                                                        ) : !!auditor.PhotoFilename && (
                                                                            <div>
                                                                                <Image src={`${VITE_FILES_URI}/auditors/${auditor.ID}/${auditor.PhotoFilename}`}
                                                                                    thumbnail
                                                                                    fluid
                                                                                    className="mb-3"
                                                                                />
                                                                            </div>
                                                                        )
                                                                    }
                                                                </Col>
                                                                <Col xs="12" sm="8">
                                                                    <Row>
                                                                        <Col xs="12">
                                                                            <AryFormikTextInput
                                                                                name="firstNameInput"
                                                                                label="First name"
                                                                            />
                                                                        </Col>
                                                                        <Col xs="12">
                                                                            <AryFormikTextInput
                                                                                name="middleNameInput"
                                                                                label="Middle name"
                                                                            />
                                                                        </Col>
                                                                        <Col xs="12">
                                                                            <AryFormikTextInput
                                                                                name="lastNameInput"
                                                                                label="Last name"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="12" sm="6">
                                                                    <AryFormikTextInput
                                                                        name="emailInput"
                                                                        label="Email"
                                                                        startLabel={<FontAwesomeIcon icon={faEnvelope} />}
                                                                        placeholder="name@example.com"
                                                                    />
                                                                </Col>
                                                                <Col xs="12" sm="6">
                                                                    <AryFormikTextInput
                                                                        name="phoneInput"
                                                                        label="Phone number"
                                                                        startLabel={<FontAwesomeIcon icon={faPhone} />}
                                                                        placeholder="000-000-0000"
                                                                    />
                                                                </Col>
                                                                <Col xs="12">
                                                                    <AryFormikTextInput
                                                                        name="addressInput"
                                                                        label="Address"
                                                                        startLabel={<FontAwesomeIcon icon={faHome} />}
                                                                        placeholder="3312 Example Street, City 00000"
                                                                    />
                                                                </Col>
                                                                <Col xs="12" md="6" xxl="4">
                                                                    <div className="form-check form-switch">
                                                                        <input id="isLeadAuditorCheck" name="isLeadAuditorCheck"
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            onChange={(e) => {
                                                                                const isChecked = e.target.checked;
                                                                                formik.setFieldValue('isLeadAuditorCheck', isChecked);
                                                                                setIsLeadAuditorCheck(isChecked);
                                                                            }}
                                                                            checked={formik.values.isLeadAuditorCheck}
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
                                                                <Col xs="12" md="6" xxl="4">
                                                                    <div className="form-check form-switch">
                                                                        <input id="statusCheck" name="statusCheck"
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            onChange={(e) => {
                                                                                const isChecked = e.target.checked;
                                                                                formik.setFieldValue('statusCheck', isChecked);
                                                                                setActiveAccountCheck(isChecked);
                                                                            }}
                                                                            checked={formik.values.statusCheck}
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
                                                            <hr className="horizontal dark my-4" />
                                                            <Row>
                                                                <Col xs="12">
                                                                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                                                                        <div className="text-secondary mb-3 mb-sm-0">
                                                                            <AryLastUpdatedInfo item={auditor} />
                                                                        </div>
                                                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                                                            <button type="submit"
                                                                                className="btn bg-gradient-dark mb-0"
                                                                                disabled={isAuditorSaving}
                                                                            >
                                                                                <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
                                                                                Save
                                                                            </button>
                                                                            <button type="button"
                                                                                className="btn btn-link text-secondary mb-0"
                                                                                onClick={onCancelButton}>
                                                                                Close
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <div className="nav-wrapper position-relative end-0 mb-3">
                                                    <Nav
                                                        activeKey={ navOptions }
                                                        onSelect={ (selectedKey) => setNavOptions(selectedKey) }
                                                        variant="pills"
                                                        className="nav-fill p-1"
                                                        role="tablist"
                                                    >
                                                        <Nav.Item>
                                                            <Nav.Link className="mb-0 px-0 py-1" eventKey="documents"
                                                                title={ auditorValidityProps[auditor.ValidityStatus].label }
                                                            >
                                                                <FontAwesomeIcon 
                                                                    icon={ auditorValidityProps[auditor.ValidityStatus].iconFile } 
                                                                    className={`me-2 text-${ auditorValidityProps[auditor.ValidityStatus].variant }`}
                                                                />
                                                                FSSC Checklist
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link className="mb-0 px-0 py-1" eventKey="standards">
                                                                <FontAwesomeIcon icon={ faLandmark } className="me-2" />
                                                                Standards
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                </div>
                                                { navOptions == "documents" && <AuditorDocumentsCard /> }
                                                { navOptions == "standards" && <div>Standards goes here</div> }
                                            </Col>
                                        </Row>
                                    </Card.Body>
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