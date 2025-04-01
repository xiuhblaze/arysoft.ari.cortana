import { useEffect, useRef, useState } from "react";
import { Card, Col, Modal, Nav, Row } from "react-bootstrap";

import { faBuilding, faGear, faLandmark, faMagnifyingGlass, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { useAppFormsStore } from "../../../hooks/useAppFormsStore";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";

import bgHeadModal from "../../../assets/img/bgWavesWhite.jpg";
import { ViewLoading } from "../../../components/Loaders";
import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import enums from "../../../helpers/enums";
import standardBaseProps from "../../standards/helpers/standardBaseProps";
import AppFormPreview from "./AppFormPreview";
import FormLoading from "../../../components/Loaders/FormLoading";
import appFormStatusOptions from "../helpers/appFormStatusOptions";
import appFormValidationSchema from "../helpers/appFormValidationSchema";
import AryFormDebug from "../../../components/Forms/AryFormDebug";
import AppFormEditNaceCodes from "./AppFormEditNaceCodes";
import AppFormOrganizationStep from "./AppFormOrganizationStep";

const AppFormModalEditItem = ({ id, show, onHide, ...props }) => {
    const navOptions = {
        organization: 'Organization',
        standard: 'Standard',
        general: 'General',
    };

    const { 
        AppFormStatusType,
        StandardBaseType,
        OrganizationStatusType,
    } = enums();

    // Faltan (no van directamente en el formulario):
    // - NACE codes -> YA
    // - Contacts
    // - Sites -> Aqui voy

    const formDefaultValues = {
        standardSelect: '',
        // 9K
        activitiesScopeInput: '',
        processServicesCountInput: '',
        processServicesDescriptionInput: '',
        legalRequirementsInput: '',
        anyCriticalComplaintCheck: false,
        criticalComplaintCommentsInput: '',
        automationLevelInput: '',
        isDesignResponsibilityCheck: false,
        designResponsibilityJustificationInput: '',
        // General
        auditLanguageSelect: '', // Hacer un props general para los select de idioma
        currentCertificationsExpirationInput: '',
        currentStandardsInput: '',
        currentCertificationsByInput: '',
        outsourcedProcessInput: '',
        anyConsultancyCheck: false,
        anyConsultancyByInput: '',
        statusSelect: '',
        // Validations
        salesCommentsInput: '',
        reviewJustificationInput: '',
        reviewCommentsInput: '',
        // Hidden
        sitesCountHidden: 0,
        nacecodeCountHidden: 0,
    }; // formDefaultValues

    const validationSchema = appFormValidationSchema();

    // CUSTOM HOOKS

    const {
        isOrganizationLoading,
        organization,
        organizations,
        organizationsErrorMessage,

        organizationAsync,
        organizationsAsync,
    } = useOrganizationsStore();

    const {
        isAuditCycleLoading,
        auditCycle,
        auditCycleAsync,
    } = useAuditCyclesStore();

    const {
        isAppFormLoading,
        isAppFormCreating,
        isAppFormSaving,
        appFormSavedOk,
        appForm,
        appFormsErrorMessage,
        
        appFormsAsync,
        appFormAsync,
        appFormCreateAsync,
        appFormSaveAsync,
        appFormClear,
    } = useAppFormsStore();

    // HOOKS

    const formikRef = useRef(null);

    const anyCriticalComplaintRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [navOption, setNavOption] = useState(null);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [standardSelected, setStandardSelected] = useState(null);
    const [appFormPreviewData, setAppFormPreviewData] = useState({
        standard: '',
        organization: '',
        mainSiteAddress: '',
        legalEntity: '',
    });
    const [showAnyCriticalComplaintComments, setShowAnyCriticalComplaintComments] = useState(false);
    const [statusOptions, setStatusOptions] = useState([]);
    const [originalStatus, setOriginalStatus] = useState(null);
    const [statusChangedWith, setStatusChangedWith] = useState(null);

    useEffect(() => {
//console.log('AppFormModalEditItem', show, id);
        if (!!show) {

            setShowModal(true);

            if (!!id) {
                appFormAsync(id);
                // setStep(2);
            } else if (!!auditCycle && !!organization) {
                appFormCreateAsync({ // O mostrar un primer paso para seleccionar la organización y el ciclo de auditoría
                    AuditCycleID: auditCycle.ID,
                    OrganizationID: organization.ID,
                });
                // setStep(2);
            } else {
                Swal.fire('App Form', 'You must specify the App Form ID or the audit cycle and the organization', 'warning');
                onCloseModal();
                // setStep(1);

                // Cargar lista de organizaciones para seleccionar, 
                // una vez seleccionada, cargar lista de ciclos de auditoría para seleccionar
                organizationsAsync({
                    includeDeleted: false,
                    order: OrganizationOrderType.name,
                    pageSize: 0,
                });
            }

            //! Aquí también va a ser cosa de reiniciar valores
            setOriginalStatus(null);
        }
    }, [show]);

    useEffect(() => {

        if (!!appForm && !!show) {
            setInitialValues({
                standardSelect: appForm.Standard?.StandardBase ?? '',
                // 9K
                activitiesScopeInput: appForm.ActivitiesScope ?? '',
                processServicesCountInput: appForm.ProcessServicesCount ?? '',
                processServicesDescriptionInput: appForm.ProcessServicesDescription ?? '',
                legalRequirementsInput: appForm.LegalRequirements ?? '',
                anyCriticalComplaintCheck: appForm.AnyCriticalComplaint ?? false,
                criticalComplaintCommentsInput: appForm.CriticalComplaintComments ?? '',
                automationLevelInput: appForm.AutomationLevel ?? '',
                isDesignResponsibilityCheck: appForm.IsDesignResponsibility ?? false,
                designResponsibilityJustificationInput: appForm.DesignResponsibilityJustify ?? '',
                // General
                auditLanguageSelect: appForm.AuditLanguage ?? 'es',
                currentCertificationsExpirationInput: appForm.CurrentCertificationsExpiration ?? '',
                currentStandardsInput: appForm.CurrentStandards ?? '',
                currentCertificationsByInput: appForm.CurrentCertificationsBy ?? '',
                outsourcedProcessInput: appForm.OutsourcedProcess ?? '',
                anyConsultancyCheck: appForm.AnyConsultancy ?? false,
                anyConsultancyByInput: appForm.AnyConsultancyBy ?? '',
                statusSelect: !!appForm?.Status && appForm.Status != AppFormStatusType.nothing
                    ? appForm.Status
                    : AppFormStatusType.new,
                // Validations
                salesCommentsInput: appForm.SalesComments ?? '',
                reviewJustificationInput: appForm.ReviewJustification ?? '',
                reviewCommentsInput: appForm.ReviewComments ?? '',
                // Hidden
                sitesCountHidden: !!appForm.Sites ? appForm.Sites.length : 0,
                nacecodeCountHidden: !!appForm.Nacecodes ? appForm.Nacecodes.length : 0,
            });

            if (!organization || organization.ID != appForm.OrganizationID) {
                organizationAsync(appForm.OrganizationID);
            }

            if (!auditCycle || auditCycle.ID != appForm.AuditCycleID) {
                auditCycleAsync(appForm.AuditCycleID);
            }

            setStatusOptions(appFormStatusOptions(appForm.Status == AppFormStatusType.nothing 
                ? AppFormStatusType.new 
                : appForm.Status
            ));

            setOriginalStatus(appForm.Status);
            setStandardSelected(appForm.Standard?.StandardBase);

            setNavOption(navOptions.organization);
            // setShowModal(true);
        }
    }, [appForm]);

    useEffect(() => {
        if (!!appFormSavedOk) {
            Swal.fire('App Form', 'Changes made successfully', 'success');
            appFormClear();
            onCloseModal();
        }
    }, [appFormSavedOk]);

    useEffect(() => {
        if (!!appFormsErrorMessage) {
            Swal.fire('App Form', appFormsErrorMessage, 'error');
        }
    }, [appFormsErrorMessage]);
    

    // useEffect(() => {
    //     if (!!organizationsErrorMessage) {
    //         Swal.fire('App Form', organizationsErrorMessage, 'error');
    //         //TODO: Ver con que acción continuar
    //     }
    // }, [organizationsErrorMessage]);
    
    // METHODS

    const auditLanguageOptions = [
        { value: '', label: '(select a language)' },
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
    ];

    const onFormSubmit = (values) => {
        let status = AppFormStatusType.nothing;

        if (appForm.Status == AppFormStatusType.nothing) {
            status = AppFormStatusType.new;
        }

        const standard = auditCycle.AuditCycleStandards.find(acs => acs.StandardBase == values.standardSelect);

        const toSave = {
            ID: appForm.ID,
            StandardID: standard.StandardID,
            // 9K
            ActivitiesScope: values.activitiesScopeInput,
            ProcessServicesCount: values.processServicesCountInput,
            ProcessServicesDescription: values.processServicesDescriptionInput,
            LegalRequirements: values.legalRequirementsInput,
            AnyCriticalComplaint: values.anyCriticalComplaintCheck,
            CriticalComplaintComments: values.criticalComplaintCommentsInput,
            AutomationLevel: values.automationLevelInput,
            IsDesignResponsibility: values.isDesignResponsibilityCheck,
            DesignResponsibilityJustify: values.designResponsibilityJustificationInput, // Corregir
            // General
            AuditLanguage: values.auditLanguageSelect,
            CurrentCertificationsExpiration: values.currentCertificationsExpirationInput,
            CurrentStandards: values.currentStandardsInput,
            CurrentCertificationsBy: values.currentCertificationsByInput,
            OutsourcedProcess: values.outsourcedProcessInput,
            AnyConsultancy: values.anyConsultancyCheck,
            AnyConsultancyBy: values.anyConsultancyByInput,
            Status: status,
            // Validations
            SalesComments: values.salesCommentsInput,
            ReviewJustification: values.reviewJustificationInput,
            ReviewComments: values.reviewCommentsInput,            
        } // toSave

        
        //console.log('AppFormModalEditItem: onFormSubmit: toSave', toSave);
        appFormSaveAsync(toSave);
    }; // onFormSubmit

    const onCloseModal = () => {
        setShowModal(false);
        //console.log('AppFormModalEditItem: onCloseModal: Para hacer algo antes de cerrar el modal');

        // TODO: Limpiar valores
        setStandardSelected(null);
        setShowAnyCriticalComplaintComments(false);
        setStatusChangedWith(null);

        if (!!onHide) onHide();
    }; // onCloseModal

    // Sites
    
    const onSitesChange = (count) => {

        formikRef.current.setFieldValue('sitesCountHidden', count);
    };

    // Nacecodes

    const onNacecodesChange = (count) => {

        formikRef.current.setFieldValue('nacecodeCountHidden', count);
    };
    
    return (
        <Modal {...props} show={showModal} onHide={ onCloseModal }
            size="xl"
            contentClassName="bg-gray-100 border-0 shadow-lg"
            fullscreen="sm-down"
        >
            { 
                isAppFormLoading || isAppFormCreating || isOrganizationLoading || isAuditCycleLoading ? (
                    <Modal.Body>
                        <div 
                            className="page-header min-height-150 border-radius-xl"
                            style={{
                                backgroundImage: `url(${bgHeadModal})`,
                                backgroundPositionY: '50%'
                            }}
                        >
                            <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>Loading...</h4>
                            <span className={`mask bg-gradient-secondary opacity-6`} />
                        </div>
                        <ViewLoading />
                    </Modal.Body>
                ) : !!appForm &&
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={onFormSubmit}
                    innerRef={formikRef}
                >
                    {(formik) => {
                        return (
                            <Form>
                                <Modal.Body>
                                    <div 
                                        className="page-header min-height-150 border-radius-xl"
                                        style={{
                                            backgroundImage: `url(${bgHeadModal})`,
                                            backgroundPositionY: '50%'
                                        }}
                                    >
                                        <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>Application Form</h4>
                                        <span className={`mask bg-gradient-info opacity-6`} />
                                    </div>
                                    <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                                        <Row className="gx-4">
                                            <Col xs="12" className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <div 
                                                        className={`icon icon-md icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center me-2 position-relative`} 
                                                        title="Change this!!!"
                                                        style={{ minWidth: '48px' }}
                                                    >
                                                        <FontAwesomeIcon icon={ faMagnifyingGlass  } className="opacity-10 text-white" aria-hidden="true" size="lg" /> 
                                                    </div>
                                                    <div className="h-100">
                                                        <h5 className="flex-wrap mb-1">
                                                            { organization.Name }
                                                        </h5>
                                                        <p className="mb-0 font-weight-bold text-sm">
                                                            { auditCycle.Name }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <div className={`badge bg-gradient-info text-white`}>
                                                        New
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <Row className="mt-4">
                                        <Col xs="12" sm="6">
                                            <Card>
                                                <Card.Body className="p-3">
                                                    <Row>
                                                        <Col xs="12">
                                                            <Nav
                                                                variant="pills"
                                                                className="nav-fill p-1 mb-3"
                                                                activeKey={ navOption }
                                                                onSelect={ selectKey => setNavOption(selectKey) }
                                                            >
                                                                <Nav.Item className="d-flex justify-content-between align-items-center">
                                                                    <Nav.Link eventKey={navOptions.organization} className="mb-0 px-3 py-1">
                                                                        <FontAwesomeIcon icon={ faBuilding } className="me-2" />
                                                                        Organization
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="d-flex justify-content-between align-items-center">
                                                                    <Nav.Link eventKey={navOptions.standard} className="mb-0 px-3 py-1">
                                                                        <FontAwesomeIcon icon={ faLandmark } className="me-2" />
                                                                        Standard
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item className="d-flex justify-content-between align-items-center">
                                                                    <Nav.Link eventKey={navOptions.general} className="mb-0 px-3 py-1">
                                                                        <FontAwesomeIcon icon={ faGear } className="me-2" />
                                                                        General
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            </Nav>
                                                            {
                                                                navOption == navOptions.organization &&
                                                                <AppFormOrganizationStep 
                                                                    formik={ formik } 
                                                                    onSitesChange={ onSitesChange }
                                                                />
                                                            }
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12">
                                                            <AryFormikSelectInput
                                                                name="standardSelect"
                                                                label="Standard"
                                                                onChange={ (e) => {
                                                                    const selectedValue = e.target.value;
                                                                    formik.setFieldValue('standardSelect', selectedValue);
                                                                    setStandardSelected(selectedValue);
                                                                }}
                                                            >
                                                                <option value="">Select a standard</option>
                                                                { auditCycle.AuditCycleStandards.map((standard) => (
                                                                    <option key={standard.ID} value={standard.StandardBase}>{standard.StandardName}</option>
                                                                )) }
                                                            </AryFormikSelectInput>

                                                        </Col>
                                                    </Row>
                                                    { 
                                                        (!standardSelected || standardSelected == StandardBaseType.nothing) && 
                                                        <Row>
                                                            <Col xs="12">
                                                                <FormLoading />
                                                            </Col>
                                                        </Row>
                                                    }
                                                    {
                                                        standardSelected == StandardBaseType.iso9k &&
                                                        <Row>
                                                            <Col xs="12">
                                                                <div className="mb-3">
                                                                    <div className="bg-light border-radius-md p-3 pb-0">
                                                                        <AppFormEditNaceCodes 
                                                                            onChange={ onNacecodesChange }
                                                                        />
                                                                    </div>
                                                                    <Field name="nacecodeCountHidden" type="hidden" value={ formik.values.nacecodeCountHidden } />
                                                                    {
                                                                        formik.touched.nacecodeCountHidden && formik.errors.nacecodeCountHidden &&
                                                                        <span className="text-danger text-xs">{formik.errors.nacecodeCountHidden}</span>
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="activitiesScopeInput"
                                                                    label="Process activities/scope"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="4">
                                                                <AryFormikTextInput
                                                                    name="processServicesCountInput"
                                                                    label="Num Process/services"
                                                                    placeholder="0"
                                                                    className="text-end"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="8">
                                                                <AryFormikTextInput
                                                                    name="processServicesDescriptionInput"
                                                                    label="Process/services description"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="legalRequirementsInput"
                                                                    label="Legal requirements associated with product/service"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                                                                    <Row>
                                                                        <Col xs="12">
                                                                            <div className="form-check form-switch">
                                                                                <input type="checkbox" 
                                                                                    id="anyCriticalComplaintCheck" 
                                                                                    className="form-check-input" 
                                                                                    onChange={ (e) => {
                                                                                        const isChecked = e.target.checked;
                                                                                        formik.setFieldValue('anyCriticalComplaintCheck', isChecked);
                                                                                        setShowAnyCriticalComplaintComments(isChecked);
                                                                                    }}
                                                                                    checked={ formik.values.anyCriticalComplaintCheck }
                                                                                />
                                                                                <label 
                                                                                    className="form-check-label"
                                                                                    htmlFor="anyCriticalComplaintCheck"
                                                                                >
                                                                                    Any critical complaint?
                                                                                </label>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row ref={ anyCriticalComplaintRef }
                                                                        style={{
                                                                            maxHeight: showAnyCriticalComplaintComments
                                                                                ? `${anyCriticalComplaintRef?.current?.scrollHeight ?? 0}px`
                                                                                : '0px',
                                                                            overflow: 'hidden',
                                                                            transition: 'max-height 0.5s ease-in-out',
                                                                        }}
                                                                    >
                                                                        <Col xs="12">
                                                                            <AryFormikTextInput
                                                                                name="criticalComplaintCommentsInput"
                                                                                label="Critical complaint comments"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="automationLevelInput"
                                                                    label="Process automation level"
                                                                    helpText="Degree of implementation of processes in which labor is little involved"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                                                                    <Row>
                                                                        <Col xs="12">
                                                                            <div className="form-check form-switch">
                                                                                <input type="checkbox" 
                                                                                    id="isDesignResponsibilityCheck" 
                                                                                    className="form-check-input" 
                                                                                    onChange={ (e) => {
                                                                                        const isChecked = e.target.checked;
                                                                                        formik.setFieldValue('isDesignResponsibilityCheck', isChecked);
                                                                                    }}
                                                                                    checked={ formik.values.isDesignResponsibilityCheck }
                                                                                />
                                                                                <label 
                                                                                    className="form-check-label"
                                                                                    htmlFor="isDesignResponsibilityCheck"
                                                                                >
                                                                                    Design responsibility
                                                                                </label>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs="12">
                                                                            <AryFormikTextInput
                                                                                name="designResponsibilityJustificationInput"
                                                                                label="Design responsibility justification"
                                                                                helpText="If you're NOT responsible for design, explain why and who is in charge of this process"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    }
                                                    <Row>
                                                        <Col xs="12">
                                                            <AryFormikSelectInput
                                                                name="auditLanguageSelect"
                                                                label="Audit language"
                                                            >
                                                                { auditLanguageOptions.map((option) => (
                                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                                )) }
                                                            </AryFormikSelectInput>
                                                        </Col>
                                                    </Row>
                                                    <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                                                        <Row>
                                                            <Col xs="12" className="mb-3">
                                                                <h6 className="text-sm text-dark mb-0">Current certifications</h6>
                                                                <p className="text-xs text-dark mb-0">
                                                                    You can specify if there is more than one certification separated by commas
                                                                </p>
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="currentStandardsInput"
                                                                    label="Current standards"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="currentCertificationsByInput"
                                                                    label="Certified by"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="currentCertificationsExpirationInput"
                                                                    label="Expiration date"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <Row>
                                                        <Col xs="12">
                                                            <AryFormikTextInput
                                                                name="outsourcedProcessInput"
                                                                label="Outsourced process related with product/service"
                                                                helpText="It refers to those that are part of the main process of the company and are subcontracted by a supplier as an extension of the company"
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12">
                                                            <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <div className="form-check form-switch">
                                                                            <input type="checkbox" 
                                                                                id="anyConsultancyCheck" 
                                                                                className="form-check-input" 
                                                                                onChange={ (e) => {
                                                                                    const isChecked = e.target.checked;
                                                                                    formik.setFieldValue('anyConsultancyCheck', isChecked);
                                                                                }}
                                                                                checked={ formik.values.anyConsultancyCheck }
                                                                            />
                                                                            <label 
                                                                                className="form-check-label"
                                                                                htmlFor="anyConsultancyCheck"
                                                                            >
                                                                                Do you received any consultancy?
                                                                            </label>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col xs="12">
                                                                        <AryFormikTextInput
                                                                            name="anyConsultancyByInput"
                                                                            label="By who"
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                    </Row>                                                    
                                                    <Row>
                                                        <Col xs="12">
                                                            <AryFormikSelectInput
                                                                name="statusSelect"
                                                                label="Status"
                                                                onChange={ (e) => {
                                                                    const selectedValue = e.target.value;
                                                                    formik.setFieldValue('statusSelect', selectedValue);

                                                                    if (originalStatus != selectedValue) {
                                                                        setStatusChangedWith(selectedValue);
                                                                    }
                                                                }}
                                                            >
                                                                <option value="">(select a status)</option>
                                                                { statusOptions.map((option) => (
                                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                                )) }
                                                            </AryFormikSelectInput>
                                                        </Col>
                                                    </Row>
                                                    {
                                                        originalStatus == AppFormStatusType.salesReview &&
                                                        !!statusChangedWith && 
                                                            (statusChangedWith == AppFormStatusType.applicantReview ||
                                                            statusChangedWith == AppFormStatusType.salesRejected) &&
                                                        <Row>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="salesCommentsInput"
                                                                    label="Comments for sales"
                                                                    helpText="Comments for the status change"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    }
                                                    {
                                                        originalStatus == AppFormStatusType.applicantReview &&
                                                        !!statusChangedWith && 
                                                            (statusChangedWith == AppFormStatusType.active || 
                                                            statusChangedWith == AppFormStatusType.applicantRejected) &&
                                                        <Row>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="reviewCommentsInput"
                                                                    label="Comments for applicant"
                                                                    helpText="Comments for the status change"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="reviewJustificationInput"
                                                                    label="Justification for applicant"
                                                                    helpText="Justification for the status change"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    }
                                                    <Row>
                                                        <Col xs="12" className="d-flex justify-content-end">
                                                            <button 
                                                                type="submit"
                                                                className="btn bg-gradient-dark mb-0"
                                                                disabled={ isAppFormSaving }
                                                            >
                                                                {
                                                                    isAppFormSaving 
                                                                        ? <FontAwesomeIcon icon={ faSpinner } className="me-1" size="lg" spin />
                                                                        : <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                                }
                                                                Save
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <Card>
                                                <Card.Body className="p-3">
                                                    <AppFormPreview appForm={ appFormPreviewData } />
                                                    <h6>Preview</h6>
                                                    <hr className="horizontal dark mt-0" />
                                                    <Row className="justify-content-end">
                                                        <Col xs="8">
                                                            <h6 className="text-info text-gradient text-sm">
                                                                { !!standardSelected ? standardBaseProps[standardSelected].label : '-' }
                                                            </h6>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="4" className="text-sm text-end font-weight-bold text-dark">Organization</Col>
                                                        <Col xs="8" className="text-sm text-dark">{ organization.Name }</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="4" className="text-sm text-end font-weight-bold text-dark">Main site address</Col>
                                                        <Col xs="8"></Col>  
                                                    </Row>
                                                    <Row>
                                                        <Col xs="4" className="text-sm text-end font-weight-bold text-dark">Legal entity</Col>
                                                        <Col xs="8">CASA771312</Col>
                                                    </Row>
                                                    <hr className="horizontal dark mt-0" />
                                                    <div className="text-xs">
                                                        { process.env.NODE_ENV == 'development' && <AryFormDebug formik={ formik } /> }
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                        <div className="text-secondary mb-3 mb-sm-0">
                                            <AryLastUpdatedInfo item={ appForm } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="button"
                                                className="btn btn-link text-secondary mb-0"
                                                onClick={ onCloseModal }
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </Modal.Footer>
                            </Form>
                        )
                    }}
                </Formik>
            }
        </Modal>
    );
};

export default AppFormModalEditItem;