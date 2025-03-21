import { Field, Form, Formik } from "formik";
import { Alert, Card, Col, Modal, Row } from "react-bootstrap";
import { useAuditsStore } from "../../../hooks/useAuditsStore";
import { useEffect, useRef, useState } from "react";
import { ViewLoading } from "../../../components/Loaders";
import * as Yup from "yup";
import enums from "../../../helpers/enums";
import { useAuditAuditorsStore } from "../../../hooks/useAuditAuditorsStore";
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import Swal from "sweetalert2";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import AuditStandardsList from "./AuditStandardsList";
import AuditAuditorsList from "./AuditAuditorsList";
import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";
import getISODate from "../../../helpers/getISODate";
import { faExclamationTriangle, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import AuditDocumentsList from "./AuditDocumentsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import auditStatusProps from "../helpers/auditStatusProps";
import bgHeadModal from "../../../assets/img/bgWavesWhite.jpg";

const AuditModalEditItem = ({ id, show, onHide, ...props }) => {

    const {
        AuditStatusType
    } = enums();
    const formDefaultValues = {
        descriptionInput: '',
        startDateInput: '',
        endDateInput: '',
        statusSelect: AuditStatusType.scheduled,
        hasWitnessCheck: false,
        standardsCountHidden: 0,
        auditorsCountHidden: 0,
    }; // formDefaultValues
    const validationSchema = Yup.object({
            descriptionInput: Yup.string()
                .max(1000, ''),
            startDateInput: Yup.date()
                .typeError('Start date has an invalid format')
                .required('Must specify start date'),
            endDateInput: Yup.date()
                .typeError('End date has an invalid format')
                .required('Must specify end date'),
            statusSelect: Yup.string()
                .oneOf(Object.values(AuditStatusType)
                        .filter(ast => ast != AuditStatusType.nothing)
                        .map(ast => ast + ''), 
                    'Select a valid option')
                .required('Must select a status'),
            standardsCountHidden: Yup.number()
                .min(1, 'Must have at least one standard'),
            auditorsCountHidden: Yup.number()
                .when('statusSelect', {
                    is: (statusSelect) => statusSelect > AuditStatusType.scheduled,
                    then: schema => schema.min(1, 'From the Confirmed status, there must be at least one auditor assigned')
                }),
        }); 

    // CUSTOM HOOKS

    const {
        isOrganizationLoading,
        organization,
        organizationAsync,
    } = useOrganizationsStore();

    const {
        isAuditCycleLoading,
        auditCycle,
        auditCycleAsync,
    } = useAuditCyclesStore();

    const {
        auditStandards
    } = useAuditStandardsStore();

    const {
        auditAuditors
    } = useAuditAuditorsStore();

    const {
        isAuditLoading,
        isAuditCreating,
        isAuditSaving,
        auditSavedOk,
        audit,
        auditsErrorMessage,

        auditsAsync,
        auditAsync,
        auditCreateAsync,
        auditSaveAsync,
        auditClear,
    } = useAuditsStore();

    // HOOKS

    const formikRef = useRef(null);

    const [showModal, setShowModal] = useState(!!show);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [statusOptions, setStatusOptions] = useState(false);
    
    useEffect(() => {
        // console.log('AuditModalEditItem', id);
    }, []);
    

    useEffect(() => {
        
        if (!!show) {
            // console.log('AuditModalEditItem Show', id);
            if (!!id) {
                auditAsync(id);
            } else if (!!auditCycle) {
                //* Crear nuevo audit
                auditCreateAsync({
                    AuditCycleID: auditCycle.ID,
                });
            } else {
                Swal.fire('Audit', 'You must specify the ID or the audit cycle', 'warning');
                onCloseModal();
            }
        }
    }, [show]);

    useEffect(() => {

        if (!!audit && !!show) {
            setInitialValues({
                descriptionInput: audit?.Description ?? '',
                startDateInput: !!audit?.StartDate ? getISODate(audit.StartDate) : '',
                endDateInput: !!audit?.EndDate ? getISODate(audit.EndDate) : '',
                statusSelect: !!audit?.Status && audit?.Status != AuditStatusType.nothing
                    ? audit?.Status
                    : AuditStatusType.scheduled,
                hasWitnessCheck: audit?.HasWitness ?? false,
                standardsCountHidden: audit?.Standards?.length ?? 0,
                auditorsCountHidden: audit?.Auditors?.length ?? 0,
            });

            switch (audit.Status) {
                case AuditStatusType.scheduled:
                    setStatusOptions([
                        { label: 'Scheduled', value: AuditStatusType.scheduled },
                        { label: 'Confirmed', value: AuditStatusType.confirmed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                case AuditStatusType.confirmed:
                    setStatusOptions([
                        { label: 'Confirmed', value: AuditStatusType.confirmed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                
                case AuditStatusType.inProcess:
                    setStatusOptions([
                        { label: 'In process', value: AuditStatusType.inProcess },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                case AuditStatusType.finished:
                    setStatusOptions([
                        { label: 'Finished', value: AuditStatusType.finished },
                        { label: 'Completed', value: AuditStatusType.completed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                case AuditStatusType.completed:
                    setStatusOptions([
                        { label: 'Completed', value: AuditStatusType.completed },
                        { label: 'Closed', value: AuditStatusType.closed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
                case AuditStatusType.closed:
                    setStatusOptions([
                        { label: 'Closed', value: AuditStatusType.closed },
                    ]);
                    break;
                default:
                    setStatusOptions([
                        { label: '(select)', value: AuditStatusType.nothing },
                        { label: 'Scheduled', value: AuditStatusType.scheduled },
                        { label: 'Confirmed', value: AuditStatusType.confirmed },
                        // { label: 'In process', value: AuditStatusType.inProcess },
                        // { label: 'Finished', value: AuditStatusType.finished },
                        { label: 'Completed', value: AuditStatusType.completed },
                        { label: 'Closed', value: AuditStatusType.closed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
            } // switch
            
            if (!organization || organization.ID != audit.AuditCycle?.OrganizationID) {
                //console.log('AuditEditItem: loading organization');
                organizationAsync(audit.AuditCycle.OrganizationID);
            }
            
            if (!auditCycle || auditCycle.ID != audit.AuditCycle.ID) {
                //console.log('AuditEditItem: loading audit cycle');
                auditCycleAsync(audit.AuditCycle.ID);
            }
            
            setShowModal(show);            
        }

    }, [audit]);
    
    useEffect(() => {
        if (!!auditStandards && show && !!formikRef?.current) {
            formikRef.current.setFieldValue('standardsCountHidden', auditStandards.length);
        }
    }, [auditStandards]);

    useEffect(() => {
        if (!!auditAuditors && show && !!formikRef?.current) {
            formikRef.current.setFieldValue('auditorsCountHidden', auditAuditors.length);
        }
    }, [auditAuditors]);

    useEffect(() => {
            if (!!auditSavedOk && show) {
                Swal.fire('Audit', `Audit ${!id ? 'created' : 'updated'} successfully`, 'success');
                onCloseModal();
            }
        }, [auditSavedOk]);
        
        useEffect(() => {
            if (!!auditsErrorMessage && show) {
                Swal.fire('Audit', auditsErrorMessage, 'error');
                onCloseModal();
            }
        }, [auditsErrorMessage]);

    // METHODS

    const onFormSubmit = (values) => {

        const toSave = {
            ID: audit.ID,
            Description: values.descriptionInput,
            StartDate: values.startDateInput,
            EndDate: values.endDateInput,
            Status: values.statusSelect,
            HasWitness: values.hasWitnessCheck,
        };

        //console.log(toSave);
        auditSaveAsync(toSave);
    };

    const onCloseModal = () => {
        
        auditClear();
        setShowModal(false); //* IMPORTANTE: Único lugar donde se cierra el modal

        if (!!onHide) onHide(); // Desde el exterior se decide que limpiar los regristros Redux o no
                                // asi como cargar nuevamente el listado de audits

    };  // onCloseModal

    return (
        <Modal {...props} show={showModal} onHide={ onCloseModal } 
            size="xl" 
            contentClassName="bg-gray-100 border-0 shadow-lg"
            fullscreen="sm-down"
        >
            { 
                isAuditLoading || isAuditCreating || isOrganizationLoading || isAuditCycleLoading ? (
                    <Modal.Body>
                        <ViewLoading />
                    </Modal.Body>
                ) : !!audit &&
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={onFormSubmit}
                        innerRef={formikRef}
                    >
                        {formik => {
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
                                            <h4 className="text-white mx-4 pb-5" style={{ zIndex: 1 }}>Audit</h4>
                                            <span className={`mask bg-gradient-${auditStatusProps[audit.Status].variant} opacity-6`} />
                                        </div>                                        
                                        <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                                            <Row className="gx-4">
                                                <Col xs="12" className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <div 
                                                            className={`icon icon-md icon-shape bg-gradient-${ auditStatusProps[audit.Status].variant } border-radius-md d-flex align-items-center justify-content-center me-2 position-relative`} 
                                                            title={ auditStatusProps[audit.Status].label }
                                                            style={{ minWidth: '48px' }}
                                                        >
                                                            <FontAwesomeIcon icon={ auditStatusProps[audit.Status].icon  } className="opacity-10 text-white" aria-hidden="true" size="lg" /> 
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
                                                        <div className={`badge bg-gradient-${auditStatusProps[audit.Status].variant} text-white`}>
                                                            { auditStatusProps[audit.Status].label }
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        <Row className="mt-4">
                                            <Col xs="12" sm="5">
                                                <Card>
                                                    <Card.Body className="p-3">
                                                        <Row>
                                                            <Col xs="12">
                                                                <AuditStandardsList />
                                                                <Field name="standardsCountHidden" type="hidden" value={ formik.values.standardsCountHidden } />
                                                                {
                                                                    formik.touched.standardsCountHidden && formik.errors.standardsCountHidden &&
                                                                    <span className="text-danger text-xs">{formik.errors.standardsCountHidden}</span>
                                                                }
                                                            </Col>
                                                            <Col xs="12">
                                                                <AuditAuditorsList />
                                                                <Field name="auditorsCountHidden" type="hidden" value={ formik.values.auditorsCountHidden } />
                                                                {
                                                                    formik.touched.auditorsCountHidden && formik.errors.auditorsCountHidden &&
                                                                    <span className="text-danger text-xs">{formik.errors.auditorsCountHidden}</span>
                                                                }
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput
                                                                    name="descriptionInput"
                                                                    label="Audit description"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <AryFormikTextInput
                                                                    name="startDateInput"
                                                                    type="date"
                                                                    label="Start date"
                                                                />
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <AryFormikTextInput
                                                                    name="endDateInput"
                                                                    type="date"
                                                                    label="End date"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikSelectInput
                                                                    name="statusSelect"
                                                                    label="Status"
                                                                >
                                                                    {
                                                                        !!statusOptions && statusOptions.map(item =>
                                                                            <option
                                                                                key={item.value}
                                                                                value={item.value}
                                                                            >
                                                                                {item.label}
                                                                            </option>
                                                                        )
                                                                    }
                                                                </AryFormikSelectInput>
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <div className="form-check form-switch mb-3">
                                                                    <input id="hasWitnessCheck" name="hasWitnessCheck"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        onChange={ formik.handleChange }
                                                                        checked={ formik.values.hasWitnessCheck }
                                                                    />
                                                                    <label 
                                                                        className="form-check-label text-secondary mb-0" 
                                                                        htmlFor="hasWitnessCheck"
                                                                    >
                                                                        Has witness
                                                                    </label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12" className="d-flex justify-content-end">
                                                                <button type="submit"
                                                                    className="btn bg-gradient-dark mb-0"
                                                                    disabled={ isAuditSaving || !hasChanges }
                                                                >
                                                                    {
                                                                        isAuditSaving 
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
                                            <Col xs="12" sm="7">
                                                <div className="bg-gray-100 rounded-3 p-2">
                                                    <h5>Documents</h5>
                                                    {
                                                        audit.Status == AuditStatusType.nothing &&
                                                        <div className="alert alert-primary">
                                                            <div className="d-flex justify-content-start align-items-center">
                                                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-white me-3" size="lg" />
                                                                <span className="text-white text-xs">
                                                                    This audit has <span className="font-weight-bold">not been saved</span> even once; 
                                                                    save it first so you can add documents
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                                        <AuditDocumentsList showAllFiles={ showAllFiles } />
                                                    </div>
                                                    <Row>
                                                        <Col xs="12" className="d-flex justify-content-end">
                                                            <div className="form-check form-switch">
                                                                <input id="showAllFilesCheck" name="showAllFilesCheck"
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    onChange={ () => setShowAllFiles(!showAllFiles) }
                                                                    checked={ showAllFiles }
                                                                />
                                                                <label 
                                                                    className="form-check-label text-secondary mb-0" 
                                                                    htmlFor="showAllFilesCheck"
                                                                >
                                                                    Show all files
                                                                </label>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                            <div className="text-secondary mb-3 mb-sm-0">
                                                <AryLastUpdatedInfo item={ audit } />
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
                            );
                        }}
                    </Formik>                    
            }
        </Modal>
    )
}

export default AuditModalEditItem