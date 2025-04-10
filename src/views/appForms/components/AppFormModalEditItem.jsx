import { useEffect, useRef, useState } from "react";
import { Card, Col, Modal, Nav, Row } from "react-bootstrap";

import { faBuilding, faChevronLeft, faChevronRight, faGear, faLandmark, faMagnifyingGlass, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

import { useAppFormsStore } from "../../../hooks/useAppFormsStore";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";

import { clearAppFormController, setContactsList, setNacecodesList, setSitesList, setStandardData, useAppFormController } from "../context/appFormContext";

import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";
import { ViewLoading } from "../../../components/Loaders";
import AppFormEditNaceCodes from "./AppFormEditNaceCodes";
import AppFormStepOrganization from "./AppFormStepOrganization";
import AppFormPreview from "./AppFormPreview";
import appFormStatusOptions from "../helpers/appFormStatusOptions";
import appFormValidationSchema from "../helpers/appFormValidationSchema";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import bgHeadModal from "../../../assets/img/bgWavesWhite.jpg";
import enums from "../../../helpers/enums";
import FormLoading from "../../../components/Loaders/FormLoading";
import standardBaseProps from "../../standards/helpers/standardBaseProps";

import AryFormDebug from "../../../components/Forms/AryFormDebug";
import AppFormStepStandard from "./AppFormStepStandard";
import AppFormStepGeneral from "./AppFormStepGeneral";
import navOptions from "../helpers/appFormNavOptions";
import AppFormNavPrevNext from "./AppFormNavPrevNext";

const AppFormModalEditItem = ({ id, show, onHide, ...props }) => {    
    const [ controller, dispatch ] = useAppFormController();
    const { 
        standardData,
        contactsList,
        nacecodesList,
        sitesList,
    } = controller;
    const { 
        AppFormOrderType,
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
        commentsInput: '',
        // salesCommentsInput: '',
        // reviewJustificationInput: '',
        // reviewCommentsInput: '',
        // Hidden
        contactsCountHidden: 0,
        nacecodesCountHidden: 0,
        sitesCountHidden: 0,
    }; // formDefaultValues

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

    const validationSchema = appFormValidationSchema(appForm?.Status ?? AppFormStatusType.nothing);

    // HOOKS

    const formikRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [navOption, setNavOption] = useState(null);
    const [initialValues, setInitialValues] = useState(formDefaultValues);        
    const [statusOptions, setStatusOptions] = useState([]);
    const [originalStatus, setOriginalStatus] = useState(null);
    const [statusChangedWith, setStatusChangedWith] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [showAddComments, setShowAddComments] = useState(false);

    useEffect(() => {

        if (!!show) {

            setShowModal(true);

            if (!!id) {
                appFormAsync(id);
            } else if (!!auditCycle && !!organization) {
                appFormCreateAsync({
                    AuditCycleID: auditCycle.ID,
                    OrganizationID: organization.ID,
                });
            } else {
                Swal.fire('App Form', 'You must specify the App Form ID or the audit cycle and the organization', 'warning');
                //onCloseModal();
                actionsForCloseModal();
            }

            // Limpiando valores del AppFormContext

            setSitesList(dispatch, []);
            setContactsList(dispatch, []);
            setNacecodesList(dispatch, []);
            setStandardData(dispatch, {
                standardBase: StandardBaseType.nothing,
            });

            setOriginalStatus(null);
        }
    }, [show]);

    useEffect(() => {

        if (!!appForm && !!show) { //* Aquí se debe de iniciar todo del context 
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
                commentsInput: '',
                // salesCommentsInput: appForm.SalesComments ?? '',
                // reviewJustificationInput: appForm.ReviewJustification ?? '',
                // reviewCommentsInput: appForm.ReviewComments ?? '',
                // Hidden
                contactsCountHidden: !!appForm.Contacts ? appForm.Contacts.length : 0,
                nacecodesCountHidden: !!appForm.Nacecodes ? appForm.Nacecodes.length : 0,
                sitesCountHidden: !!appForm.Sites ? appForm.Sites.length : 0,
            });

            if (!organization || organization.ID != appForm.OrganizationID) {
                organizationAsync(appForm.OrganizationID);
            }

            if (!auditCycle || auditCycle.ID != appForm.AuditCycleID) {
                auditCycleAsync(appForm.AuditCycleID);
            }

            if (!!appForm.Contacts && appForm.Contacts.length > 0) {
                setContactsList(dispatch, appForm.Contacts);
            }

            if (!!appForm.Nacecodes && appForm.Nacecodes.length > 0) {
                setNacecodesList(dispatch, appForm.Nacecodes);
            }

            if (!!appForm.Sites && appForm.Sites.length > 0) {
                setSitesList(dispatch, appForm.Sites);
            }

            setStandardData(dispatch, {
                ...standardData,
                standardBase: appForm.Standard?.StandardBase ?? StandardBaseType.nothing,
            });

            setStatusOptions(appFormStatusOptions(appForm.Status == AppFormStatusType.nothing 
                ? AppFormStatusType.new 
                : appForm.Status
            ));

            setOriginalStatus(appForm.Status);
            setShowAddComments(false);
            //setStandardSelected(appForm.Standard?.StandardBase);

            setNavOption(navOptions.organization);
            // setShowModal(true);
        }
    }, [appForm]);

    useEffect(() => {
        if (!!appFormSavedOk) {
            Swal.fire('App Form', 'Changes made successfully', 'success');
            
            // appFormsAsync({
            //     auditCycleID: auditCycle.ID,
            //     pageSize: 0,
            //     order: AppFormOrderType.createdDesc,
            // });

            // onCloseModal();
            actionsForCloseModal();
        }
    }, [appFormSavedOk]);

    useEffect(() => {
        if (!!appFormsErrorMessage) {
            Swal.fire('App Form', appFormsErrorMessage, 'error');
        }
    }, [appFormsErrorMessage]);

    useEffect(() => {        
        if (!!contactsList && formikRef?.current != null) {
            formikRef.current.setFieldValue('contactsCountHidden', contactsList.length);
        }
    }, [contactsList]);

    useEffect(() => {
        if (!!nacecodesList && formikRef?.current != null) {
            formikRef.current.setFieldValue('nacecodesCountHidden', nacecodesList.length);
        }
    }, [nacecodesList]);

    useEffect(() => {
        if (!!sitesList && formikRef?.current != null) {
            formikRef.current.setFieldValue('sitesCountHidden', sitesList.length);
        }
    }, [sitesList]);
    
    // METHODS 

    const onStandardSelectChange = (e) => {
        const selectedValue = e.target.value;
        formikRef.current.setFieldValue('standardSelect', selectedValue);
        setStandardData(dispatch, {
            ...standardData,
            standardBase: selectedValue,
        });
    };

    const onFormSubmit = (values) => {
        let status = AppFormStatusType.nothing;

        if (appForm.Status == AppFormStatusType.nothing) {
            status = AppFormStatusType.new;
        }

        if (originalStatus != status) {
            console.log('originalStatus != status', originalStatus, status);
            
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

        appFormSaveAsync(toSave);
    }; // onFormSubmit

    const onCloseModal = () => {

        if (hasChanges) {
            Swal.fire({
                title: 'Discard changes?',
                text: 'Are you sure you want to discard changes? The changes will be lost.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, discard changes!'
            }).then((result) => {
                if (result.isConfirmed) {
                    actionsForCloseModal();
                }
            })
        } else { 
            actionsForCloseModal();
        }
    }; // onCloseModal

    const actionsForCloseModal = () => {
        if (!!onHide) onHide();

        appFormClear();
        setShowModal(false);
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
                        useEffect(() => {
                            setHasChanges(formik.dirty);
                        }, [formik.dirty]);
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
                                                            <AryFormikSelectInput
                                                                name="standardSelect"
                                                                label="Standard"
                                                                onChange={ onStandardSelectChange}
                                                                disabled={ !!id }
                                                            >
                                                                <option value="">Select a standard</option>
                                                                { auditCycle.AuditCycleStandards.map((standard) => (
                                                                    <option key={standard.ID} value={standard.StandardBase}>{standard.StandardName}</option>
                                                                )) }
                                                            </AryFormikSelectInput>
                                                        </Col>
                                                    </Row>
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
                                                            <AppFormNavPrevNext
                                                                navOption={navOption} 
                                                                setNavOption={setNavOption} 
                                                            />
                                                            {
                                                                navOption == navOptions.organization &&
                                                                <AppFormStepOrganization formik={ formik } />
                                                            }
                                                            { 
                                                                navOption == navOptions.standard &&
                                                                <AppFormStepStandard formik={ formik } />
                                                            }
                                                            {
                                                                navOption == navOptions.general &&
                                                                <AppFormStepGeneral formik={ formik } />
                                                            }
                                                            <AppFormNavPrevNext 
                                                                navOption={navOption} 
                                                                setNavOption={setNavOption} 
                                                            />
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
                                                                        setShowAddComments(true);
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
                                                        showAddComments &&
                                                        <Row>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="commentsInput"
                                                                    label="Comments"
                                                                    helpText="Add any comments for the status change"
                                                                />
                                                            </Col>
                                                        </Row>  
                                                    }
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <Card>
                                                <Card.Body className="p-3">
                                                    <AppFormPreview formik={formik} />
                                                    <AryFormDebug formik={formik} />
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
                                            <button 
                                                type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isAppFormSaving || !hasChanges }
                                            >
                                                {
                                                    isAppFormSaving 
                                                        ? <FontAwesomeIcon icon={ faSpinner } className="me-1" size="lg" spin />
                                                        : <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                }
                                                Save
                                            </button>
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