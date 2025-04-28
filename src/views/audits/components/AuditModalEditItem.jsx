import { useEffect, useRef, useState } from "react";
import { Alert, Card, Col, Modal, Row } from "react-bootstrap";
import { faExclamationTriangle, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from "../../../components/Forms";
import { useAuditAuditorsStore } from "../../../hooks/useAuditAuditorsStore";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useAuditsStore } from "../../../hooks/useAuditsStore";
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { ViewLoading } from "../../../components/Loaders";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import AuditAuditorsList from "./AuditAuditorsList";
import AuditDocumentsList from "./AuditDocumentsList";
import AuditStandardsList from "./AuditStandardsList";
import auditStatusProps from "../helpers/auditStatusProps";
import enums from "../../../helpers/enums";
import getISODate from "../../../helpers/getISODate";

import bgHeadModal from "../../../assets/img/bgWavesWhite.jpg";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import { useNotesStore } from "../../../hooks/useNotesStore";
import NotesListModal from "../../notes/components/NotesListModal";

const AuditModalEditItem = ({ id, show, onHide, ...props }) => {

    const {
        AuditStatusType,
        DefaultStatusType,
    } = enums();
    const formDefaultValues = {
        descriptionInput: '',
        startDateInput: '',
        endDateInput: '',
        extraInfoInput: '',
        statusSelect: AuditStatusType.scheduled,
        hasWitnessCheck: false,
        noteInput: '',
        standardsCountHidden: 0,
        auditorsCountHidden: 0,
    }; // formDefaultValues
    const validationSchema = Yup.object({
        descriptionInput: Yup.string()
            .max(1000, 'Audit description must be at most 1000 characters'),
        extraInfoInput: Yup.string()
            .max(1000, 'Extra info must be at most 1000 characters'),
        startDateInput: Yup.date()
            .typeError('Start date has an invalid format')
            .required('Must specify start date'),
        endDateInput: Yup.date()
            .typeError('End date has an invalid format')
            .required('Must specify end date'),
        statusSelect: Yup.string()
            // .oneOf(Object.values(AuditStatusType)
            //         .filter(ast => ast != AuditStatusType.nothing)
            //         .map(ast => ast + ''), 
            //    'Select a valid option')
            .required('Must select a status'),
        noteInput: Yup.string()
            .max(1000, 'The note must be at most 1000 characters'),
        standardsCountHidden: Yup.number()
            .when('statusSelect', {
                is: (statusSelect) => statusSelect > AuditStatusType.scheduled && statusSelect < AuditStatusType.canceled,
                then: schema => schema.min(1, 'For this status change, there must be at least one active standard assigned')
            }),
        auditorsCountHidden: Yup.number()
            .when('statusSelect', {
                is: (statusSelect) => statusSelect > AuditStatusType.scheduled && statusSelect < AuditStatusType.canceled,
                then: schema => schema.min(1, 'For this status change, there must be at least one active auditor assigned')
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

    const {
            noteCreateAsync,
        } = useNotesStore();

    // HOOKS

    const formikRef = useRef(null);

    const [showModal, setShowModal] = useState(!!show);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [statusOptions, setStatusOptions] = useState(false);
    const [showAddNote, setShowAddNote] = useState(false);
    const [saveNote, setSaveNote] = useState(''); 
    
    useEffect(() => {
        
        if (!!show) {
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

            let standardsActiveCount = !!audit.Standards 
                ? audit.Standards.filter(i => 
                    i.Status == DefaultStatusType.active 
                    && i.StandardStatus == DefaultStatusType.active)
                    .length
                : 0;
            const auditorsActiveCount = !!audit.Auditors
                ? audit.Auditors.filter(i => 
                    i.Status == DefaultStatusType.active)
                    .length
                : 0;

            setInitialValues({
                descriptionInput: audit.Description ?? '',
                startDateInput: !!audit.StartDate ? getISODate(audit.StartDate) : '',
                endDateInput: !!audit.EndDate ? getISODate(audit.EndDate) : '',
                extraInfoInput: audit.ExtraInfo ?? '',
                statusSelect: !!audit.Status && audit.Status != AuditStatusType.nothing
                    ? audit.Status
                    : AuditStatusType.scheduled,
                hasWitnessCheck: audit.HasWitness ?? false,
                noteInput: '',
                standardsCountHidden: standardsActiveCount, //audit.Standards?.length ?? 0,
                auditorsCountHidden: auditorsActiveCount //audit.Auditors?.length ?? 0,
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
                case AuditStatusType.canceled:
                    setStatusOptions([
                        { label: 'Scheduled', value: AuditStatusType.scheduled },
                        { label: 'Canceled', value: AuditStatusType.canceled },
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
            
            if (!organization || (!!audit.AuditCycle && organization.ID != audit.AuditCycle?.OrganizationID)) {
                organizationAsync(audit.AuditCycle.OrganizationID);
            }
            
            if (!auditCycle || (!!audit.AuditCycle && auditCycle.ID != audit.AuditCycle.ID)) {
                auditCycleAsync(audit.AuditCycle.ID);
            }
            
            setShowModal(show);            
        }

    }, [audit]);
    
    useEffect(() => {
        if (!!auditStandards && show && !!formikRef?.current) {
            const standardsActive = auditStandards.filter(item => 
                item.Status == DefaultStatusType.active 
                && item.StandardStatus == DefaultStatusType.active);
            formikRef.current.setFieldValue('standardsCountHidden', standardsActive.length);
        }
    }, [auditStandards]);

    useEffect(() => {
        if (!!auditAuditors && show && !!formikRef?.current) {
            formikRef.current.setFieldValue(
                'auditorsCountHidden', 
                auditAuditors.filter(aa => 
                    aa.Status == DefaultStatusType.active)
                    .length);
        }
    }, [auditAuditors]);

    useEffect(() => {
            if (!!auditSavedOk && show) {
                if (!isNullOrEmpty(saveNote)) {
                    noteCreateAsync({ OwnerID: audit.ID, Text: saveNote });
                    setSaveNote('');
                }
                Swal.fire('Audit', `Audit ${!id ? 'created' : 'updated'} successfully`, 'success');
                auditAsync(audit.ID); // Refrescar los datos de la audit
                // onCloseModal(); // Probando el evitar cerrar la modal al guardar
            }
        }, [auditSavedOk]);
        
    useEffect(() => {
        if (!!auditsErrorMessage && show) {
            Swal.fire('Audit', auditsErrorMessage, 'error');
            // onCloseModal(); // Probando el evitar cerrar la modal al ocurrir un error
        }
    }, [auditsErrorMessage]);

    // METHODS

    const onFormSubmit = (values) => {

        const newStatus = audit.Status == AuditStatusType.nothing
            ? AuditStatusType.scheduled
            : values.statusSelect;

        if (audit.Status != newStatus) { // Si cambió el status crear una nota
            const text = 'Status changed to ' + auditStatusProps[newStatus].label.toUpperCase();

            setSaveNote(`${text}${!isNullOrEmpty(values.noteInput) ? ': ' + values.noteInput : ''}`);
            //setSaveNote(text);
        }

        const toSave = {
            ID: audit.ID,
            Description: values.descriptionInput,
            StartDate: values.startDateInput,
            EndDate: values.endDateInput,
            ExtraInfo: values.extraInfoInput,
            Status: values.statusSelect,
            HasWitness: values.hasWitnessCheck,
        };

        // console.log('AuditModalEditItem.onFormSubmit: toSave', toSave);
        auditSaveAsync(toSave);
    };

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
                    auditClear();
                    setShowModal(false);

                    if (!!onHide) onHide(); // Desde el exterior se decide que limpiar los regristros Redux o no
                                            // asi como cargar nuevamente el listado de audits
                }
            })
        } else { // No se puede omitir la duplicación de este código porque Swal es asincrono
            auditClear();
            setShowModal(false);

            if (!!onHide) onHide(); // Desde el exterior se decide que limpiar los regristros Redux o no
        }
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
                                                                <AryFormikTextArea
                                                                    name="extraInfoInput"
                                                                    label="Extra info"
                                                                    helpText="Add any extra info for the audit"
                                                                />
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
                                                            {
                                                                !!audit.Notes && audit.Notes.length > 0 &&
                                                                <Col xs="12" sm="6" className="text-end">
                                                                    <NotesListModal notes={audit.Notes} buttonLabel="View notes" />
                                                                </Col>
                                                            }
                                                            <Col xs="12">
                                                                <AryFormikSelectInput
                                                                    name="statusSelect"
                                                                    label="Status"
                                                                    onChange={ (e) => {
                                                                        const selectedValue = e.target.value;

                                                                        formik.setFieldValue('statusSelect', selectedValue);
                                                                        setShowAddNote(audit.Status != selectedValue);
                                                                    }}
                                                                    helpText={ audit.Status == AuditStatusType.confirmed 
                                                                        || audit.Status == AuditStatusType.inProcess 
                                                                        || audit.Status == AuditStatusType.finished 
                                                                        || audit.Status == AuditStatusType.completed 
                                                                        || audit.Status == AuditStatusType.closed 
                                                                            ? 'Add a note for the status change' 
                                                                            : '' 
                                                                    }
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
                                                            {
                                                                showAddNote &&
                                                                <Col xs="12">
                                                                    <AryFormikTextInput
                                                                        name="noteInput"
                                                                        label="Note"
                                                                        helpText="Add any note for the audit status change"
                                                                    />
                                                                </Col>
                                                            }
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