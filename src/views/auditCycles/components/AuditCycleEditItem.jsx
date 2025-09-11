import { useEffect, useState } from 'react';

import { Col, Modal, Row } from 'react-bootstrap';
import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import Swal from 'sweetalert2';

import { AryFormikSelectInput, AryFormikTextInput } from '../../../components/Forms';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { ViewLoading } from '../../../components/Loaders';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import AuditCycleStandardsList from './AuditCycleStandardsList';
import enums from '../../../helpers/enums';
import getISODate from '../../../helpers/getISODate';

const AuditCycleEditItem = ({ id, ...props }) => {

    const {
        AuditCyclePeriodicityType,
        DefaultStatusType,
    } = enums();

    const formDefaultValues = {
        nameInput: '',
        startDateInput: '',
        endDateInput: '',
        periodicitySelect: '',
        extraInfoInput: '',
        statusCheck: false,
    };

    const validationSchema = Yup.object({
        nameInput: Yup.string()
            .required('Name is required')
            .max(50, 'Name must be at most 50 characters'),        
        startDateInput: Yup.date()
            .typeError('Start date has an invalid format')
            .required('Must specify start date'),
        endDateInput: Yup.date()
            .typeError('End date has an invalid format')
            .required('Must specify end date')
            .min(Yup.ref('startDateInput'), 'End date can\'t be before Start date'),
        extraInfoInput: Yup.string()
            .max(1000, 'Extra info must be at most 1000 characters'),
    });

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
            isAuditCycleLoading,
            isAuditCycleCreating,
            isAuditCycleSaving,
            auditCycleSavedOk,
            auditCycle,
            auditCyclesErrorMessage,
    
            auditCyclesAsync,
            auditCycleAsync,
            auditCycleCreateAsync,
            auditCycleSaveAsync,
            // auditCycleClear,
        } = useAuditCyclesStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        if (!!auditCycle && showModal) {
            setInitialValues({
                nameInput: auditCycle?.Name ?? '',
                startDateInput: !!auditCycle?.StartDate ? getISODate(auditCycle.StartDate) : '',
                endDateInput: !!auditCycle?.EndDate ? getISODate(auditCycle.EndDate) : '',
                periodicitySelect: auditCycle?.Periodicity ?? '',
                extraInfoInput: auditCycle?.ExtraInfo ?? '',
                statusCheck: auditCycle.Status === DefaultStatusType.active,
            });
        }
    }, [auditCycle]);

    useEffect(() => {
        if (!!auditCycleSavedOk && showModal) {
            Swal.fire('Cycle', `Cycle ${!id ? 'assigned' : 'updated'} successfully`, 'success');
            auditCyclesAsync({
                organizationID: organization.ID,
                pageSize: 0,
            });
            // auditCycleClear();
            setShowModal(false);
        }
    }, [auditCycleSavedOk]);
    
    useEffect(() => {
        if (!!auditCyclesErrorMessage && showModal) {
            Swal.fire('Cycle', auditCyclesErrorMessage, 'error');
            // auditCycleClear();
            onCloseModal();
        }
    }, [auditCyclesErrorMessage]);
    

    // METHODS

    const onShowModal = () => {

        if (!id) {
            auditCycleCreateAsync({
                OrganizationID: organization.ID,
            });
        } else {
            if (!!auditCycle && auditCycle.ID !== id)  {
                auditCycleAsync(id);
            } else {
                setInitialValues({
                    nameInput: auditCycle?.Name ?? '',
                    startDateInput: !!auditCycle?.StartDate ? getISODate(auditCycle.StartDate) : '',
                    endDateInput: !!auditCycle?.EndDate ? getISODate(auditCycle.EndDate) : '',
                    periodicitySelect: auditCycle?.Periodicity ?? '',
                    extraInfoInput: auditCycle?.ExtraInfo ?? '',
                    statusCheck: auditCycle.Status === DefaultStatusType.active,
                });
            }
        }

        setShowModal(true);
    };

    const onCloseModal = () => {

        // auditCycleClear();
        setShowModal(false);
    };

    const onFormSubmit = (values) => {
        const toSave = {
            ID: auditCycle.ID,
            Name: values.nameInput,
            StartDate: values.startDateInput,
            EndDate: values.endDateInput,
            Periodicity: values.periodicitySelect ?? '',
            ExtraInfo: values.extraInfoInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        auditCycleSaveAsync(toSave);
    }; // onFormSubmit

    return (
        <div {...props}>
            <button
                type="button"                
                className="btn btn-link p-0 mb-0"
                title={!!id ? 'Edit current audit cycle' : 'Add new audit cycle'}
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={!!id ? faEdit : faPlus} size="xl" className="text-dark" />
            </button>
            <Modal show={showModal} onHide={onCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={ !!id ? faEdit : faPlus } size="lg" className="text-dark me-2" />
                        { !!id ? 'Edit audit cycle' : 'Add new audit cycle' }
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditCycleLoading || isAuditCycleCreating ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!auditCycle && showModal &&
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={ onFormSubmit }
                    >
                        {formik => (
                            <Form>
                                <Modal.Body>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                name="nameInput"
                                                label="Cycle name"
                                                placeholder="Cycle 1"
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
                                            <AuditCycleStandardsList />
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikSelectInput
                                                name="periodicitySelect"
                                                label="Periodicity"
                                                onChange={ (e) => {
                                                    const selectedValue = e.target.value;
                                                    formik.setFieldValue('periodicitySelect', selectedValue);                                                    
                                                }}
                                                helpText="the frequency with which audits are performed"
                                            >
                                                { Object.keys(AuditCyclePeriodicityType).map((key) => (
                                                    <option 
                                                        key={key} 
                                                        value={AuditCyclePeriodicityType[key]}
                                                        className="text-capitalize"
                                                    >
                                                        {key === 'nothing' ? '(select)' : key}
                                                    </option>
                                                ))}
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                name="extraInfoInput"
                                                label="Extra info"
                                            />
                                        </Col>
                                        <Col xs="12" md="6" className="mb-3">
                                            <div className="form-check form-switch">
                                                <input id="statusCheck" name="statusCheck"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        formik.setFieldValue('statusCheck', isChecked);
                                                    }}
                                                    checked={formik.values.statusCheck}
                                                />
                                                <label
                                                    className="form-check-label text-secondary mb-0"
                                                    htmlFor="statusCheck"
                                                >
                                                    Active cycle
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                        <div className="text-secondary mb-3 mb-sm-0">
                                            <AryLastUpdatedInfo item={ auditCycle } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isAuditCycleSaving }
                                            >
                                                <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
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
                        )}
                    </Formik>
                }
            </Modal>
    </div>
    )
}

export default AuditCycleEditItem