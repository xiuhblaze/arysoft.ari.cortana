import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';
import { Col, Modal, Row } from 'react-bootstrap';
import { faEdit, faExclamationTriangle, faPlus, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Field, Form, Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuditAuditorsStore } from '../../../hooks/useAuditAuditorsStore';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { useAuditStandardsStore } from '../../../hooks/useAuditStandardsStore';
import { useEffect, useRef, useState } from 'react';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { ViewLoading } from '../../../components/Loaders';
import * as Yup from "yup";
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import AuditAuditorsList from './AuditAuditorsList';
import AuditDocumentsList from './AuditDocumentsList';
import AuditStandardsList from './AuditStandardsList';
import enums from '../../../helpers/enums';
import getISODate from '../../../helpers/getISODate';
import Swal from 'sweetalert2';

const AuditEditItem = ({ id, onClose, iconClassName, ...props }) => {
    const {
        AuditStatusType,
    } = enums();
    const formDefaultValues = {
        descriptionInput: '',
        startDateInput: '',
        endDateInput: '',
        statusSelect: AuditStatusType.scheduled,
        hasWitnessCheck: false,
        standardsCountHidden: 0,
        auditorsCountHidden: 0,
    };
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

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [statusOptions, setStatusOptions] = useState(false); 

    useEffect(() => {
        if (!!audit && showModal) {
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
                // case AuditStatusType.scheduled:
                //     setstatusOptions([
                //         { label: 'Scheduled', value: AuditStatusType.scheduled },
                //         { label: 'In progress', value: AuditStatusType.inProgress },
                //         { label: 'Completed', value: AuditStatusType.completed },
                //     ]);
                //     break;
                // case AuditStatusType.inProgress:
                //     setstatusOptions([
                //         { label: 'In progress', value: AuditStatusType.inProgress },
                //         { label: 'Completed', value: AuditStatusType.completed },
                //     ]);
                //     break;
                // case AuditStatusType.completed:
                //     setstatusOptions([
                //         { label: 'Completed', value: AuditStatusType.completed },
                //     ]);
                //     break;
                default:
                    setStatusOptions([
                        { label: '(select)', value: AuditStatusType.nothing },
                        { label: 'Scheduled', value: AuditStatusType.scheduled },
                        { label: 'Confirmed', value: AuditStatusType.confirmed },
                        { label: 'In process', value: AuditStatusType.inProcess },
                        { label: 'Finished', value: AuditStatusType.finished },
                        { label: 'Completed', value: AuditStatusType.completed },
                        { label: 'Closed', value: AuditStatusType.closed },
                        { label: 'Canceled', value: AuditStatusType.canceled },
                    ]);
                    break;
            } // switch

            if (!organization) {
                console.log('AuditEditItem: loading organization');
                organizationAsync(audit.AuditCycle.OrganizationID);
            }

            if (!auditCycle) {
                console.log('AuditEditItem: loading audit cycle');
                auditCycleAsync(audit.AuditCycle.ID);
            }
        }
    }, [audit]);

    useEffect(() => {
        if (!!auditStandards && showModal) {
            formikRef.current.setFieldValue('standardsCountHidden', auditStandards.length);
        }
    }, [auditStandards]);

    useEffect(() => {
        if (!!auditAuditors && showModal) {
            formikRef.current.setFieldValue('auditorsCountHidden', auditAuditors.length);
        }
    }, [auditAuditors]);
    
    useEffect(() => {
        if (!!auditSavedOk && showModal) {
            Swal.fire('Audit', `Audit ${!id ? 'created' : 'updated'} successfully`, 'success');
            if (!!onClose) {
                onClose();
            } else {
                auditsAsync({
                    auditCycleID: auditCycle.ID,
                    pageSize: 0,
                });
            }            
            auditClear();            
            setShowModal(false);
        }
    }, [auditSavedOk]);
    
    useEffect(() => {
        if (!!auditsErrorMessage && showModal) {
            Swal.fire('Audit', auditsErrorMessage, 'error');
            auditClear();
            onCloseModal();
        }
    }, [auditsErrorMessage]);
    
    // METHODS

    const onShowModal = () => {

        if (!!id) {
            auditAsync(id);
        } else {
            auditCreateAsync({
                AuditCycleID: auditCycle.ID,
            });
        }
        setShowModal(true);
    }; // onShowModal

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

                    if (!!onClose) {
                        onClose();
                    } else {
                        auditsAsync({
                            auditCycleID: auditCycle.ID,
                            pageSize: 0,
                        });
                    }
                    auditClear();
                    setShowModal(false);
                }
            })
        } else { // No se puede omitir la duplicación de este código porque Swal es asincrono
            if (!!onClose) {
                onClose();
            } else {
                auditsAsync({
                    auditCycleID: auditCycle.ID,
                    pageSize: 0,
                });
            }
            auditClear();
            setShowModal(false);
        }
    }; // onCloseModal

    const onFormSubmit = (values) => {
        const toSave = {
            ID: audit.ID,
            Description: values.descriptionInput,
            StartDate: values.startDateInput,
            EndDate: values.endDateInput,
            Status: values.statusSelect,
            HasWitness: values.hasWitnessCheck,
        };

        // console.log(toSave);
        auditSaveAsync(toSave);
    };

    return (
        <>
            <button
                type="button"
                className="btn btn-link p-0 mb-0"
                title={!!id ? "Edit audit" : "New audit"}
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className={ iconClassName ?? 'text-dark' } size="lg" />   
            </button>
            <Modal show={showModal} onHide={onCloseModal} size="lg">
                <Modal.Header>
                    <Modal.Title>
                        <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className="px-3" />
                        { !!id ? "Audit" : "Add audit" } 
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditLoading || isAuditCreating || isAuditCycleLoading || isOrganizationLoading ? (
                    <Modal.Body>
                        <ViewLoading />
                    </Modal.Body>
                    ) : !!audit && !!organization && !!auditCycle && showModal && 
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
                                    <Row>
                                        <Col xs="12" sm="5">
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
                                                            // Object.keys(AuditStatusType).map(key =>
                                                            //     <option
                                                            //         key={key}
                                                            //         value={ AuditStatusType[key] }
                                                            //         className="text-capitalize"
                                                            //     >
                                                            //         {key == 'nothing' ? '(select)': key}
                                                            //     </option>
                                                            // )
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
                                        </Col>
                                        <Col xs="12" sm="7">
                                            <div className="bg-gray-100 rounded-3 p-2">
                                                <h5>Audit documents</h5>
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
                        )}}
                    </Formik>
                }
            </Modal>
        </>
    )
}

export default AuditEditItem