import { addDays, set } from "date-fns";
import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from "../../../components/Forms";
import { Button, Col, Image, Modal, Row } from "react-bootstrap";
import { certificateStatusProps } from "../helpers/certificateStatusProps";
import { faBan, faCertificate, faEdit, faRotateRight, faSave } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useCertificatesStore } from "../../../hooks/useCertificatesStore";
import { useEffect, useState } from "react";
import { useNotesStore } from "../../../hooks/useNotesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { useOrganizationStandardsStore } from "../../../hooks/useOrganizationStandardsStore";
import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { ViewLoading } from "../../../components/Loaders";
import * as Yup from "yup";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import defaultStatusProps from "../../../helpers/defaultStatusProps";
import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables"
import getISODate from "../../../helpers/getISODate";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import NotesListModal from "../../notes/components/NotesListModal";
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
        // DefaultValidityStatusType,
        StandardOrderType,
    } = enums();
    
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

    const formDefaultValues = {
        standardSelect: '',
        startDateInput: '',
        dueDateInput: '',
        commentsInput: '',
        crnInput: '',
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
        noteInput: '',
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
        crnInput: Yup.string()
            .max(10, 'The Certificate Registration Number cannot exceed more than 10 characters'),
        prevAuditDateInput: Yup.date()
            .typeError('Must be a valid date')
            .required('Must specify previous audit date'),
            // .when('hasNCsCriticalCheck', {
            //     is: value => value === true,
            //     then: () => Yup.date().required('If a critical NC is present, the previous audit date is required'),
            // }),
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
        qrCodeFileInput: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop(); // value.name.split('.').slice(-1)[0]; // https://stackoverflow.com/questions/651563/getting-the-last-element-of-a-split-string-array
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
        statusSelect: Yup.string()
            .required('Must select a status'),
        noteInput: Yup.string()
            .max(250, 'The note cannot exceed more than 250 characters')
            .when('statusSelect', {
                is: value => !!certificate && value != certificate.Status,
                then: () => Yup.string().required('Must specify a note'),
            }),
    });

    // CUSTOM HOOKS

    const {
        isOrganizationsLoading,
        organization
    } = useOrganizationsStore();

    // const {
    //     isStandardsLoading,
    //     standards,
    //     standardsAsync,
    // } = useStandardsStore();
    const {
        isOrganizationStandardsLoading,
        organizationStandards,
        organizationStandardsAsync,
        organizationStandardsErrorMessage,
    } = useOrganizationStandardsStore();

    const {
        isNoteCreating,
        noteCreatedOk,
        note,
        noteCreateAsync,
    } =useNotesStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [statusOptions, setStatusOptions] = useState(null);
    const [showAddNote, setShowAddNote] = useState(false);

    const [qrCodePreview, setQrCodePreview] = useState(null);
    const [newQRCode, setNewQRCode] = useState(false);
    
    useEffect(() => {
        
        if (!!certificate && showModal) {
            setInitialValues({
                standardSelect: certificate?.StandardID ?? '',
                startDateInput: !!certificate?.StartDate ? getISODate(certificate.StartDate) : '',
                dueDateInput: !!certificate?.DueDate ? getISODate(certificate.DueDate) : '',
                commentsInput: certificate?.Comments ?? '',
                crnInput: certificate?.CRN ?? '',
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
                qrCodeFileInput: '',
                statusSelect: certificate?.Status ?? ''
            });

            // standardsAsync({
            //     status: DefaultStatusType.active,
            //     pageSize: 0,
            //     includeDeleted: false,
            //     order: StandardOrderType.name,
            // });

            switch (certificate?.Status) {
                case CertificateStatusType.active:
                    setStatusOptions([
                        { label: 'Active', value: CertificateStatusType.active },
                        { label: 'Suspended', value: CertificateStatusType.suspended },
                        { label: 'Expired', value: CertificateStatusType.expired },
                        { label: 'Canceled', value: CertificateStatusType.canceled },
                    ]);
                    break;
                case CertificateStatusType.suspended:
                    setStatusOptions([
                        { label: 'Active', value: CertificateStatusType.active },
                        { label: 'Suspended', value: CertificateStatusType.suspended },
                        { label: 'Expired', value: CertificateStatusType.expired },
                        { label: 'Canceled', value: CertificateStatusType.canceled },
                    ]);
                    break;
                case CertificateStatusType.expired:
                    setStatusOptions([
                        { label: 'Active', value: CertificateStatusType.active },
                        { label: 'Expired', value: CertificateStatusType.expired },
                    ]);
                    break;
                case CertificateStatusType.canceled:
                    setStatusOptions([                        
                        { label: 'Active', value: CertificateStatusType.active },                        
                        { label: 'Canceled', value: CertificateStatusType.canceled },
                    ]);
                    break;
                default:
                    setStatusOptions([
                        { label: '(status)', value: '' },
                        { label: 'Active', value: CertificateStatusType.active },
                        { label: 'Suspended', value: CertificateStatusType.suspended },
                        { label: 'Expired', value: CertificateStatusType.expired },
                        { label: 'Canceled', value: CertificateStatusType.canceled },
                    ]);
                    break;
            }

            organizationStandardsAsync({
                organizationID: organization.ID,
                status: DefaultStatusType.active,
                pageSize: 0,
            });

            setNewQRCode(isNullOrEmpty(certificate.QRFile));
            
            setShowAddNote(false);
        }
    }, [certificate]);

    useEffect(() => {
        if (showModal && !!organizationStandards && organizationStandards.length == 0) {
            Swal.fire('Certificate', `A standard must first have to be assigned`, 'warning');
        }
    }, [organizationStandards]);
    

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
            Swal.fire('Certificates', certificatesErrorMessage, 'error');
            certificateClear();
            setShowModal(false);
        }
    }, [certificatesErrorMessage]);
    
    // METHODS

    const calculateActionPlanDate = (prevAuditDate, hasNCsMinor, hasNCsMajor, hasNCsCritical) => {

        if (!!prevAuditDate &&
            (!!hasNCsMinor || !!hasNCsMajor || !!hasNCsCritical)
        ) {
            const days = hasNCsMajor ||  hasNCsCritical
                ? 15 
                : hasNCsMinor ? 28 : 0 ;
            const actionPlanDate = addDays(new Date(prevAuditDate), days);
            return actionPlanDate ?? null;
        }

        return null;
    } // calculateActionPlanDate

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
            CRN: values.crnInput,
            PrevAuditDate: values.prevAuditDateInput,
            PrevAuditNote: values.prevAuditNoteInput,
            NextAuditDate: values.nextAuditDateInput,
            NextAuditNote: values.nextAuditNoteInput,
            hasNCsMinor: values.hasNCsMinorCheck,
            hasNCsMajor: values.hasNCsMajorCheck,
            hasNCsCritical: values.hasNCsCriticalCheck,
            actionPlanDate: values.actionPlanDateInput,
            actionPlanDelivered: values.actionPlanDeliveredCheck,
            Status: values.statusSelect,
        };

        if (certificate.Status != values.statusSelect) {            
            const text = "Status changed to " + certificateStatusProps[values.statusSelect].label.toUpperCase();
            noteCreateAsync({
                OwnerID: certificate.ID,
                Text: `${text}${!isNullOrEmpty(values.noteInput) ? ': ' + values.noteInput : ''}`,                    
            });
        }

        certificateSaveAsync(toSave, values.certificateFileInput, values.qrCodeFileInput);
    }; // onFormSubmit

    return (
        <>
            <Button
                variant="link"
                className="text-dark p-0 mb-0"
                onClick={ onShowModal }
                title={ !!id ? "Edit certificate" : "Add certificate" }
            >
                <FontAwesomeIcon icon={ !!id ? faEdit : faSquarePlus } size="xl" />
            </Button>
            <Modal show={ showModal } onHide={ onCloseModal } size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={ !!id ? faEdit : faSquarePlus } className="px-3" />
                        { !!id ? "Edit certificate" : "Add certificate" }
                    </Modal.Title>
                </Modal.Header>
                {
                    isCertificateLoading || isCertificateCreating ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!certificate && !!organizationStandards && (
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
                                            <Col xs="12" sm="8">
                                                <Row>
                                                    <Col xs="12">
                                                        <AryFormikSelectInput
                                                            name="standardSelect"
                                                            label="Standard"
                                                            disabled={!!id}
                                                            helpText={ !id ? 'Select a standard to assign' : certificate.Standard.Name }
                                                        >
                                                            { !id && <option value="">(select)</option> }
                                                            {
                                                                organizationStandards.map(item =>
                                                                    <option
                                                                        key={item.StandardID}
                                                                        value={item.StandardID}
                                                                        className="text-capitalize"
                                                                    >
                                                                        {item.StandardName}
                                                                    </option>
                                                                )
                                                            }
                                                        </AryFormikSelectInput>
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextInput name="crnInput"
                                                            label="Certificate Registration Number"
                                                            placeholder="MEX-0-0000-000000"
                                                        />
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
                                                </Row>
                                            </Col>
                                            <Col xs="12" sm="4">
                                                <div className="d-flex justify-content-between">
                                                    <label className="form-label">QR Code</label>
                                                    {
                                                        !newQRCode && !!certificate.QRFile &&
                                                        <div className="d-flex justify-content-end gap-3">
                                                            <button
                                                                type="button"
                                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                                onClick={() => setNewQRCode(true)}
                                                                title="Upload new QR Code"
                                                            >
                                                                <FontAwesomeIcon icon={faRotateRight} size="lg" />
                                                            </button>
                                                            {/* <button
                                                                type="button"
                                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                                onClick={onDeleteFile}
                                                                title="Delete QR code file"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                                            </button> */}
                                                        </div>
                                                    }
                                                    {
                                                        !!newQRCode && !isNullOrEmpty(certificate.QRFile) &&
                                                        <div className="text-end">
                                                            <button
                                                                type="button"
                                                                className="btn btn-link p-0 mb-0 text-secondary"
                                                                onClick={ () => {
                                                                    setNewQRCode(false);
                                                                    setQrCodePreview(null);
                                                                    formik.setFieldValue("qrCodeFileInput", '');
                                                                }}
                                                                title="Cancel upload new QR Code"
                                                            >
                                                                <FontAwesomeIcon icon={faBan} size="lg" />
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                                {
                                                !!newQRCode ? (
                                                    <>
                                                        {
                                                            !!qrCodePreview && 
                                                            <div>
                                                                <Image src={qrCodePreview}
                                                                    thumbnail
                                                                    fluid
                                                                    className="mb-3"
                                                                />
                                                            </div>
                                                        }
                                                        <input
                                                            type="file"
                                                            name="qrFile"
                                                            accept="image/png,image/jpeg,image/jpg"
                                                            className="form-control mb-3"
                                                            onChange={(e) => {
                                                                const fileReader = new FileReader();
                                                                fileReader.onload = () => {
                                                                    if (fileReader.readyState === 2) {
                                                                        setQrCodePreview(fileReader.result);                                                                        
                                                                    }
                                                                };
                                                                fileReader.readAsDataURL(e.target.files[0]);
                                                                formik.setFieldValue('qrCodeFileInput', e.currentTarget.files[0]);
                                                            }}
                                                        />
                                                        {
                                                            formik.touched.qrCodeFileInput && formik.errors.qrCodeFileInput &&
                                                            <span className="text-danger text-xs">{formik.errors.qrCodeFileInput}</span>
                                                        }
                                                    </>
                                                ) : !!certificate.QRFile && (
                                                    <div>
                                                        <Image 
                                                            src={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/certificates/${certificate.QRFile}`}
                                                            thumbnail
                                                            fluid
                                                            className="mb-3"
                                                        />
                                                    </div>
                                                )
                                            }
                                            </Col>
                                        </Row>
                                        <Row>
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
                                                            onBlur={ (e) => {
                                                                formik.handleBlur(e);

                                                                const actionPlanDate = calculateActionPlanDate(
                                                                    new Date(e.currentTarget.value),
                                                                    formik.values.hasNCsMinorCheck,
                                                                    formik.values.hasNCsMajorCheck,
                                                                    formik.values.hasNCsCriticalCheck
                                                                );

                                                                if (!!actionPlanDate) {
                                                                    formik.setFieldValue('actionPlanDateInput', actionPlanDate.toISOString().split('T')[0]);
                                                                }
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <AryFormikTextArea name="prevAuditNoteInput"
                                                            label="Prev audit note"
                                                            rows="4"
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
                                                                        const actionPlanDate = calculateActionPlanDate(
                                                                            formik.values.prevAuditDateInput,
                                                                            e.currentTarget.value,
                                                                            formik.values.hasNCsMajorCheck,
                                                                            formik.values.hasNCsCriticalCheck
                                                                        );
                                                                        if (!!actionPlanDate) {
                                                                            formik.setFieldValue('actionPlanDateInput', actionPlanDate.toISOString().split('T')[0]);
                                                                        }
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
                                                                        const actionPlanDate = calculateActionPlanDate(
                                                                            formik.values.prevAuditDateInput,
                                                                            formik.values.hasNCsMinorCheck,
                                                                            e.currentTarget.value,
                                                                            formik.values.hasNCsCriticalCheck
                                                                        );
                                                                        if (!!actionPlanDate) {
                                                                            formik.setFieldValue('actionPlanDateInput', actionPlanDate.toISOString().split('T')[0]);
                                                                        }
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
                                                                        const actionPlanDate = calculateActionPlanDate(
                                                                            formik.values.prevAuditDateInput,
                                                                            formik.values.hasNCsMinorCheck,
                                                                            formik.values.hasNCsMajorCheck,
                                                                            e.currentTarget.value,
                                                                        )
                                                                        if (!!actionPlanDate) {
                                                                            formik.setFieldValue('actionPlanDateInput', actionPlanDate.toISOString().split('T')[0]);
                                                                        }
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
                                                            helpText="Must be natural days"
                                                        />
                                                    </Col>
                                                    <Col xs="12">
                                                        <div className="form-check form-switch">
                                                            <input id="actionPlanDeliveredCheck" name="actionPlanDeliveredCheck"
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    formik.setFieldValue('actionPlanDeliveredCheck', isChecked);

                                                                }}
                                                                checked={ formik.values.actionPlanDeliveredCheck}
                                                            />
                                                            <label
                                                                className="form-check-label text-secondary mb-0"
                                                                htmlFor="actionPlanDeliveredCheck"
                                                            >
                                                                Action Plan has been delivered
                                                            </label>
                                                        </div>
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
                                                            rows="4"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="4">
                                                <AryFormikSelectInput
                                                    name="statusSelect"
                                                    label="Status"
                                                    onChange={ (e) => {
                                                        const selectedValue = e.target.value;
                                                        formik.setFieldValue('statusSelect', selectedValue);
                                                        
                                                        // si cambió de status, solicita añadir nota
                                                        // console.log(selectedValue, certificate.Status);
                                                        if (selectedValue != certificate.Status) {
                                                            // console.log('mostrar nota');
                                                            setShowAddNote(true);
                                                        } else {
                                                            // console.log('no mostrar nota');
                                                            setShowAddNote(false);
                                                        }
                                                    }}
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
                                                {
                                                    !!certificate.Notes && certificate.Notes.length > 0 &&
                                                    <NotesListModal notes={certificate.Notes} buttonLabel="View notes" />
                                                }
                                            </Col>
                                            <Col xs="12" sm="8">
                                                {
                                                    showAddNote && 
                                                    <AryFormikTextArea name="noteInput"
                                                        label="Note"
                                                        helpText="Add a note for the status change"
                                                    />
                                                }
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