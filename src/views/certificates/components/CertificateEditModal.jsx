import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from "../../../components/Forms";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { faCertificate, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useCertificatesStore } from "../../../hooks/useCertificatesStore";
import { useEffect, useState } from "react";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { ViewLoading } from "../../../components/Loaders";
import * as Yup from "yup";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables"
import getISODate from "../../../helpers/getISODate";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import Swal from "sweetalert2";

const CertificateEditModal = ({ id, ...props }) => {
    const {
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const {
        CertificateOrderType,
        CertificateStatusType,
        DefaultStatusType,
        StandardOrderType,
    } = enums();

    const formDefaultValues = {
        standardSelect: '',
        startDateInput: '',
        dueDateInput: '',
        commentsInput: '',
        prevAuditDateInput: '',
        prevAuditNoteInput: '',
        nextAuditDateInput: '',
        nextAuditNoteInput: '',
        hasNCsMinorCheck: false,
        hasNCsMajorCheck: false,
        hasNCsCriticalCheck: false,
        actionPlanDateInput: '',
        actionPlanDeliveredCheck: false,
        filenameInput: '',
        statusSelect: '',
    };
    const validationSchema = Yup.object({
        standardSelect: Yup.string()
            .required('Must select a standard'),
        startDateInput: Yup.date()
            .typeError('Start date has an invalid format')
            .required('Must specify start date'),
        dueDateInput: Yup.date()
            .typeError('Due date has an invalid format')
            .min(Yup.ref('startDateInput'), 'Due date can\'t be before Start date')
            .required('Must specify due date'),
        commentsInput: Yup.string()
            .max(500, 'The comments cannot exceed more than 500 characters'),
        prevAuditDateInput: Yup.date()
            .typeError('Must be a valid date')
            .when('hasNCsMinorCheck', {
                is: value => value === true,
                then: () => Yup.date().required('If a minor NC is present, the previous audit date is required'),
            })
            .when('hasNCsMajorCheck', {
                is: value => value === true,
                then: () => Yup.date().required('If a major NC is present, the previous audit date is required'),
            })
            .when('hasNCsCriticalCheck', {
                is: value => value === true,
                then: () => Yup.date().required('If a critical NC is present, the previous audit date is required'),
            }),
        prevAuditNoteInput: Yup.string()
            .max(100, 'The note cannot exceed more than 100 characters'),
        nextAuditDateInput: Yup.date()
            .typeError('Must be a valid date'),
        nextAuditNoteInput: Yup.string()
            .max(100, 'The note cannot exceed more than 100 characters'),
        actionPlanDateInput: Yup.date()
            .typeError('Must be a valid date'),
        certificateFileInput: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop(); 
                        const validTypes = ['pdf', 'jpg', 'png'];
                        if (!validTypes.includes(extension)) {
                            return ctx.createError({
                                message: 'Only files with png, jpg or pdf extensions are allowed'
                            });
                        }
                    }
                    return true;
                }
            }),
        statusSelect: Yup.string()
            .required('Must select a status'),
    });

    // CUSTOM HOOKS

    const {
        isOrganizationsLoading,
        organization
    } = useOrganizationsStore();

    const {
        isStandardsLoading,
        standards,
        standardsAsync,
    } = useStandardsStore();

    const {
        certificatesAsync,
        
        isCertificateLoading,
        isCertificateCreating,   
        isCertificateSaving,
        certificateSavedOk,     
        certificate,
        certificateAsync,
        certificateCreateAsync,
        certificateSaveAsync,
        certificateClear,
        certificatesErrorMessage,
    } = useCertificatesStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [statusOptions, setStatusOptions] = useState(null);

    useEffect(() => {
        
        if (!!certificate && showModal) {
            setInitialValues({
                standardSelect: certificate?.StandardID ?? '',
                startDateInput: !!certificate?.StartDate ? getISODate(certificate.StartDate) : '',
                dueDateInput: !!certificate?.DueDate ? getISODate(certificate.DueDate) : '',
                commentsInput: certificate?.Comments ?? '',
                prevAuditDateInput: !!certificate?.PrevAuditDate ? getISODate(certificate.PrevAuditDate) : '',
                prevAuditNoteInput: certificate?.PrevAuditNote ?? '',
                nextAuditDateInput: !!certificate?.NextAuditDate ? getISODate(certificate.NextAuditDate) : '',
                nextAuditNoteInput: certificate?.NextAuditNote ?? '',
                hasNCsMinorCheck: !!certificate?.HasNCsMinor ?? false,
                hasNCsMajorCheck: !!certificate?.HasNCsMajor ?? false,
                hasNCsCriticalCheck: !!certificate?.HasNCsCritical ?? false,
                actionPlanDateInput: !!certificate?.ActionPlanDate ? getISODate(certificate.ActionPlanDate) : '',
                actionPlanDeliveredCheck: !!certificate?.ActionPlanDelivered ?? false,
                certificateFileInput: '',
                statusSelect: certificate?.Status ?? ''
            });

            standardsAsync({
                status: DefaultStatusType.active,
                pageSize: 0,
                includeDeleted: false,
                order: StandardOrderType.name,
            });

            setStatusOptions([ //! Ver que cambien las opciones de acuerdo al status actual
                { label: '(status)', value: '' },
                { label: 'Active', value: CertificateStatusType.active },
                { label: 'Suspended', value: CertificateStatusType.suspended },
                { label: 'Expired', value: CertificateStatusType.expired },
                { label: 'Canceled', value: CertificateStatusType.canceled },
            ]);
        }
    }, [certificate]);

    useEffect(() => {
        if (!!certificateSavedOk && showModal) {
            Swal.fire('Certificate', `Certificate ${ !id ? 'created' : 'updated' } successfully`, 'success');
            certificateClear();
            setShowModal(false);

            certificatesAsync({
                organizationID: organization.ID,
                pageSize: 0,
                order: CertificateOrderType.dateDesc,
            });
        }
    }, [certificateSavedOk]);
    
    useEffect(() => {
        if (!!certificatesErrorMessage && showModal) {
            Swal.fire('Certificates', certificatesErrorMessage, 'danger');
            certificateClear();
            setShowModal(false);
        }
    }, [certificatesErrorMessage]);
    
    // METHODS

    const calculateActionPlanDate = (ncType, prevAuditDate) => {
        console.log('Calcular fecha de action plan: ', ncType, prevAuditDate);
    }

    const onShowModal = () => {

        if (!!id) {
            certificateAsync(id);
        } else {
            certificateCreateAsync({
                OrganizationID: organization.ID,
            });
        }

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {
        certificateClear();
        setShowModal(false);
    }; // onCloseModal

    const onFormSubmit = (values) => {
        const toSave = {
            ID: certificate.ID,
            StandardID: values.standardSelect,
            StartDate: values.startDateInput,
            DueDate: values.dueDateInput,
            Comments: values.commentsInput,
            PrevAuditDate: values.prevAuditDateInput,
            PrevAuditNote: values.prevAuditNoteInput,
            NextAuditDate: values.nextAuditDateInput,
            NextAuditNote: values.nextAuditNoteInput,
            Status: values.statusSelect,
        };

        certificateSaveAsync(toSave, values.certificateFileInput);
    }; // onFormSubmit

    return (
        <>
            <Button
                variant="link"
                className="text-dark p-0 mb-0"
                onClick={ onShowModal }
                title={ !!id ? "Edit certificate" : "Create new certificate" }
            >
                <FontAwesomeIcon icon={ !!id ? faEdit : faSquarePlus } size="xl" />
            </Button>
            <Modal show={ showModal } onHide={ onCloseModal } size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {
                            !!id ? (
                                <>
                                    <FontAwesomeIcon icon={ faEdit } className="px-3" />
                                    Edit certificate
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={ faSquarePlus } className="px-3" />
                                    Add certificate
                                </>
                            )
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    isCertificateLoading || isCertificateCreating ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!certificate && !!standards && (
                        <Formik
                            initialValues={ initialValues }
                            validationSchema={ validationSchema }
                            enableReinitialize
                            onSubmit={ onFormSubmit }
                        >
                            {formik => (
                                <Form>
                                    <Modal.Body>
                                        <Row>
                                            <Col xs="12">
                                                <AryFormikSelectInput
                                                    name="standardSelect"
                                                    label="Standard"
                                                    disabled={!!id}
                                                >
                                                    { !id && <option value="">(select)</option> }
                                                    {
                                                        standards.map(item =>
                                                            <option
                                                                key={item.ID}
                                                                value={item.ID}
                                                                className="text-capitalize"
                                                            >
                                                                {item.Name}
                                                            </option>
                                                        )
                                                    }
                                                </AryFormikSelectInput>
                                            </Col>
                                            <Col xs="12">
                                                <label className="form-label">Certificate file</label>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    {
                                                        !isNullOrEmpty(certificate.Filename) &&
                                                        <div>
                                                            <a
                                                                href={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/certificates/${certificate.Filename}`}
                                                                target="_blank"
                                                                className="btn btn-link text-dark mb-0 text-lg py-2 text-center"
                                                                title="View current file"
                                                            >
                                                                <FontAwesomeIcon icon={faCertificate} size="lg" />
                                                            </a>
                                                        </div>
                                                    }
                                                    <div className="w-100">
                                                        <input
                                                            type="file"
                                                            name="certificateFile"
                                                            accept="image/jpeg,image/png,application/pdf"
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                formik.setFieldValue('certificateFileInput', e.currentTarget.files[0]);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <AryFormikTextInput name="startDateInput"
                                                    type="date"
                                                    label="Start date"
                                                    placeholder="00/00/0000"
                                                />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <AryFormikTextInput name="dueDateInput"
                                                    type="date"
                                                    label="Due date"
                                                    placeholder="00/00/0000"
                                                />
                                            </Col>
                                            <Col xs="12">
                                                <AryFormikTextArea
                                                    name="commentsInput"
                                                    label="Comments"
                                                    rows="4"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <Row>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="prevAuditDateInput"
                                                            type="date"
                                                            label="Prev audit date"
                                                            placeholder="00/00/0000"
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextArea name="prevAuditNoteInput"
                                                            label="Prev audit note"
                                                            rows="3"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <label className="form-label">Non Conformities</label>
                                                <Row>
                                                    <Col xs="12">
                                                        <div className="form-check form-switch">
                                                            <input id="hasNCsMinorCheck" name="hasNCsMinorCheck"
                                                                type="checkbox" 
                                                                className="form-check-input"
                                                                onChange={ (e) => {
                                                                    const isChecked = e.target.checked;
                                                                    formik.setFieldValue('hasNCsMinorCheck', isChecked);
                                                                    if (isChecked && formik.values.prevAuditDateInput !== '') {
                                                                        //console.log('Calcular fecha de action plan');
                                                                        calculateActionPlanDate('minor', formik.values.prevAuditDateInput); 
                                                                    }
                                                                }}
                                                                checked={ formik.values.hasNCsMinorCheck}
                                                            />
                                                            <label
                                                                className="form-check-label text-secondary mb-0"
                                                                htmlFor="hasNCsMinorCheck"
                                                            >Has NCs Minor</label>
                                                        </div>
                                                    </Col>
                                                    <Col xs="12">
                                                        <div className="form-check form-switch">
                                                            <input id="hasNCsMajorCheck" name="hasNCsMajorCheck"
                                                                type="checkbox" 
                                                                className="form-check-input"
                                                                onChange={ (e) => {
                                                                    const isChecked = e.target.checked;
                                                                    formik.setFieldValue('hasNCsMajorCheck', isChecked);
                                                                    if (isChecked && formik.values.prevAuditDateInput !== '') {
                                                                        //console.log('Calcular fecha de action plan');
                                                                        calculateActionPlanDate('major', formik.values.prevAuditDateInput);
                                                                    }
                                                                }}
                                                                checked={ formik.values.hasNCsMajorCheck}
                                                            />
                                                            <label
                                                                className="form-check-label text-secondary mb-0"
                                                                htmlFor="hasNCsMajorCheck"
                                                            >Has NCs Major</label>
                                                        </div>
                                                    </Col>
                                                    <Col xs="12">
                                                        <div className="form-check form-switch">
                                                            <input id="hasNCsCriticalCheck" name="hasNCsCriticalCheck"
                                                                type="checkbox" 
                                                                className="form-check-input"
                                                                onChange={ (e) => {
                                                                    const isChecked = e.target.checked;
                                                                    formik.setFieldValue('hasNCsCriticalCheck', isChecked);
                                                                    if (isChecked && formik.values.prevAuditDateInput !== '') {
                                                                        //console.log('Calcular fecha de action plan');
                                                                        calculateActionPlanDate('critical', formik.values.prevAuditDateInput);
                                                                    }
                                                                }}
                                                                checked={ formik.values.hasNCsCriticalCheck}
                                                            />
                                                            <label
                                                                className="form-check-label text-secondary mb-0"
                                                                htmlFor="hasNCsCriticalCheck"
                                                            >Has NCs Critical (Only FSSC)</label>
                                                        </div>
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="actionPlanDateInput"
                                                            type="date"
                                                            label="Action plan date"
                                                            placeholder="00/00/0000"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <Row>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="nextAuditDateInput"
                                                            type="date"
                                                            label="Next audit date"
                                                            placeholder="00/00/0000"
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextArea name="nextAuditNoteInput"
                                                            label="Next audit note"
                                                            rows="3"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <AryFormikSelectInput
                                                    name="statusSelect"
                                                    label="Status"
                                                    // value={certificate.Status}
                                                >
                                                    {
                                                        !!statusOptions && statusOptions.map(item => 
                                                            <option
                                                                key={ item.value }
                                                                value={ item.value }
                                                            >
                                                                { item.label }
                                                            </option>
                                                        )
                                                    }
                                                </AryFormikSelectInput>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center w-100">
                                            <div className="text-secondary mb-3 mb-sm-0">
                                                <AryLastUpdatedInfo item={certificate} />
                                            </div>
                                            <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                                <button type="submit"
                                                    className="btn bg-gradient-dark mb-0"
                                                    disabled={isCertificateSaving}
                                                >
                                                    <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
                                                    Save
                                                </button>
                                                <button type="button"
                                                    className="btn btn-link text-secondary mb-0"
                                                    onClick={onCloseModal}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </Modal.Footer>
                                </Form>
                            )}
                        </Formik>
                    )   
                }
            </Modal>
        </>
    )
}

export default CertificateEditModal;