import { Card, Col, Image, Row } from 'react-bootstrap'
import { Form, Formik } from 'formik';
import { useAuditorsStore } from '../../../hooks/useAuditorsStore'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as Yup from "yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faEnvelope, faHome, faPhone, faRotateRight, faSave, faTrash, faUserPen } from '@fortawesome/free-solid-svg-icons';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import envVariables from '../../../helpers/envVariables';
import enums from '../../../helpers/enums';
import { AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import Swal from 'sweetalert2';

const AuditorEditCard = ({ actualizarPhotoPreview, ...props }) => {
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
    const { VITE_FILES_URL, URL_AUDITOR_FILES } = envVariables();
    const { DefaultStatusType } = enums();
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
                message: 'Some file update error', // <- este solo es visible si el último return es false
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

    const {
        isAuditorLoading,
        isAuditorSaving,
        auditorSavedOk,
        auditor,
        auditorsErrorMessage,

        auditorAsync,
        auditorSaveAsync,
        auditorDeleteFileAsync,
        auditorClear,
    } = useAuditorsStore();

    // HOOKS

    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [newPhoto, setNewPhoto] = useState(false);
    const [isLeadAuditorCheck, setIsLeadAuditorCheck] = useState(false);

    useEffect(() => {
        if (!!auditor) {
            
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

        auditorSaveAsync(toSave, values.photoFileInput);
    };

    const onCancelButton = () => {
        auditorClear();
        navigate('/auditors/');
    };

    const onDeleteFile = () => {

        auditorDeleteFileAsync(auditor.ID)
            .then(data => {
                if (!!data) setNewPhoto(true);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <Card>
            <Card.Header className="pb-0">
                <Card.Title>
                    <FontAwesomeIcon icon={faUserPen} size="lg" className="text-info me-2" />
                    Edit profile
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Edit auditor's general information</Card.Subtitle>
            </Card.Header>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onFormSubmit}
            >
                {formik => (
                    <Form>
                        <Card.Body className="py-0">
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
                                                        actualizarPhotoPreview(null);
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
                                                                actualizarPhotoPreview(fileReader.result);
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
                                                <Image src={`${VITE_FILES_URL}${URL_AUDITOR_FILES}/${auditor.ID}/${auditor.PhotoFilename}`}
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
                                                // setActiveAccountCheck(isChecked);
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
                        </Card.Body>
                        <Card.Footer>
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
                        </Card.Footer>
                    </Form>
                )}
            </Formik>
        </Card>
    )
}

export default AuditorEditCard;