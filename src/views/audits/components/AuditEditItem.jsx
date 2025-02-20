import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import enums from '../../../helpers/enums';
import * as Yup from "yup";
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { ViewLoading } from '../../../components/Loaders';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';
import getISODate from '../../../helpers/getISODate';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import Swal from 'sweetalert2';
import AuditStandardsList from './AuditStandardsList';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import AuditDocumentsList from './AuditDocumentsList';

const AuditEditItem = ({ id, ...props }) => {

    const {
        AuditStatusType,
    } = enums();

    const formDefaultValues = {
        descriptionInput: '',
        startDateInput: '',
        endDateInput: '',
        statusSelect: AuditStatusType.scheduled,
        hasWitnessCheck: false,
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
            .required('Must select a status'),
    }); 

    // CUSTOM HOOKS

    const {
        auditCycle
    } = useAuditCyclesStore();

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

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [showAllFiles, setShowAllFiles] = useState(false);

    useEffect(() => {
        if (!!audit && showModal) {
            setInitialValues({
                descriptionInput: audit?.Description ?? '',
                startDateInput: !!audit?.StartDate ? getISODate(audit.StartDate) : '',
                endDateInput: !!audit?.EndDate ? getISODate(audit.EndDate) : '',
                statusSelect: audit?.Status ??  AuditStatusType.nothing,
                hasWitnessCheck: audit?.HasWitness ?? false,
            });
        }
    }, [audit]);
    
    useEffect(() => {
        if (!!auditSavedOk && showModal) {
            Swal.fire('Audit', `Audit ${!id ? 'created' : 'updated'} successfully`, 'success');
            auditsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
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
        setShowModal(false);
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
                <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className="text-dark" size="lg" />
            </button>
            <Modal show={showModal} onHide={onCloseModal} size="lg">
                <Modal.Header>
                    <Modal.Title>
                        <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className="px-3" />
                        { !!id ? "Audit" : "Add audit" } 
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditLoading || isAuditCreating ? (
                    <Modal.Body>
                        <ViewLoading />
                    </Modal.Body>
                    ) : !!audit && showModal && 
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={onFormSubmit}
                    >
                        {formik => (
                            <Form>
                                <Modal.Body>
                                    <Row>
                                        <Col xs="12" sm="5">
                                            <Row>
                                                <Col xs="12">
                                                    <AuditStandardsList />
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
                                                            Object.keys(AuditStatusType).map(key =>
                                                                <option
                                                                    key={key}
                                                                    value={ AuditStatusType[key] }
                                                                    className="text-capitalize"
                                                                >
                                                                    {key == 'nothing' ? '(select)': key}
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
                                                        disabled={ isAuditSaving }
                                                    >
                                                        <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                        Save
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs="12" sm="7">
                                            <div className="bg-gray-100 rounded-3 p-2">
                                                <h5>Audit documents</h5>
                                                <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
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
                        )}
                    </Formik>
                }
            </Modal>
        </>
    )
}

export default AuditEditItem