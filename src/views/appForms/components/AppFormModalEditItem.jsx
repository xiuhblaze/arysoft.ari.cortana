import { useEffect, useState } from "react";
import { Card, Col, Modal, Row } from "react-bootstrap";

import { faMagnifyingGlass, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
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

const AppFormModalEditItem = ({ id, show, onHide, ...props }) => {

    const { StandardBaseType } = enums();

    // Faltan (no van directamente en el formulario):
    // - NACE codes
    // - Contacts
    // - Sites

    const formDefaultValues = {
        standardSelect: '',
        // 9K
        activitiesScopeInput: '',
        processServicesCountInput: '',
        processServicesDescriptionInput: '',
        legalRequirementsInput: '',
        anyCriticalComplaintCheck: false,
        criticalComplaintCommentsInput: '',
        automatinLevelInput: '',
        // General
        isDesignResponsabilityCheck: false,
        designResponsabilityJustificationInput: '',
        auditLanguageSelect: '', // Hacer un props general para los select de idioma
        currentCertificationsExpirationInput: '',
        currentStandardsInput: '',
        currentCertificationsByInput: '',
        outsourcedProcessInput: '',
        anyConsultancyCheck: false,
        anyConsultancyByInput: '',
        statusSelect: '',
    }; // formDefaultValues

    const validationSchema = Yup.object({
        standardSelect: Yup.string()
            .required('Standard is required'),
        activitiesScopeInput: Yup.string()
            .when('standardSelect', {
                is: (standardSelect) => standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Activities scope is required'),
                otherwise: schema => schema.notRequired(),
            }),
        processServicesCountInput: Yup.number()
            .when('standardSelect', {
                is: (standardSelect) => standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Process services count is required'),
                otherwise: schema => schema.notRequired(),
            }),
        processServicesDescriptionInput: Yup.string()
            .when('standardSelect', {
                is: (standardSelect) => standardSelect == StandardBaseType.iso9k,
                then: schema => schema.required('Process services description is required'),
                otherwise: schema => schema.notRequired(),
            }),
    });

    // CUSTOM HOOKS

    const {
        isOrganizationLoading,
        organization,
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

    const [showModal, setShowModal] = useState(false);
    // const [step, setStep] = useState(1); // TODO: Para ver si se puede implementar a futuro
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [standardSelected, setStandardSelected] = useState(null);

    useEffect(() => {
        if (!!show) {
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
            }

            // setShowModal(true); //? Este no va a ir aquí, sino que va a ir en el useEffect de la appForm
        }
    }, [show]);

    useEffect(() => {
        if (!!appForm && !!show) {

            console.log('AppFormModalEditItem: useEffect: appForm, cargar formulario ');

            if (!organization || organization.ID != appForm.OrganizationID) {
                organizationAsync(appForm.OrganizationID);
            }

            if (!auditCycle || auditCycle.ID != appForm.AuditCycleID) {
                auditCycleAsync(appForm.AuditCycleID);
            }

            setShowModal(true);
        }
    }, [appForm]);

    useEffect(() => {
        if (!!standardSelected) {
            console.log('AppFormModalEditItem: useEffect: standardSelected', standardSelected);
        }
    }, [standardSelected]);
    
    // METHODS

    const onFormSubmit = (values) => {
        console.log('AppFormModalEditItem: onFormSubmit: values', values);
    }; // onFormSubmit

    const onCloseModal = () => {
        setShowModal(false);
        console.log('AppFormModalEditItem: onCloseModal: Para hacer algo antes de cerrar el modal');
        if (!!onHide) onHide();
    }; // onCloseModal
    
    return (
        <Modal {...props} show={showModal} onHide={ onCloseModal }
            size="xl"
            contentClassName="bg-gray-100 border-0 shadow-lg"
            fullscreen="sm-down"
        >
            { 
                isAppFormLoading || isAppFormCreating || isOrganizationLoading || isAuditCycleLoading ? (
                    <Modal.Body>
                        <ViewLoading />
                    </Modal.Body>
                ) : !!appForm &&
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={onFormSubmit}
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
                                        <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>App Form</h4>
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
                                                        standardSelected == StandardBaseType.iso9k &&
                                                        <Row>
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
                                                    <h6>Preview</h6>
                                                    <hr className="horizontal dark mt-0" />
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