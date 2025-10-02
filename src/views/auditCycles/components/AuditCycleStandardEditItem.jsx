import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Yup from "yup";
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { useAuditCycleStandardsStore } from '../../../hooks/useAuditCycleStandardsStore';
import { useOrganizationStandardsStore } from '../../../hooks/useOrganizationStandardsStore';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Col, Modal, Row } from 'react-bootstrap';
import { ViewLoading } from '../../../components/Loaders';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput } from '../../../components/Forms';
import enums from '../../../helpers/enums';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import auditStepProps from '../../audits/helpers/auditStepProps';
import { useAuthStore } from '../../../hooks/useAuthStore';

const AuditCycleStandardEditItem = ({ id, ...props }) => {

    const {
        AuditCycleType,
        AuditStepType,
        DefaultStatusType,
        StandardOrderType,
    } = enums();

    const formDefaultValues = {
        standardSelect: '',
        initialStepSelect: '',
        cycleTypeSelect: '',
        statusCheck: false,
    }; // formDefaultValues

    const validationSchema = Yup.object({
        standardSelect: Yup.string()
            .required('Must select a standard'),
        cycleTypeSelect: Yup.string()
            .required('Must select the cycle type'),
        initialStepSelect: Yup.string()
            .required('Must select the initial step'),
    });

    // CUSTOM HOOKS

    const { ROLES, hasRole } = useAuthStore();

    const {
        auditCycle,
    } = useAuditCyclesStore();

    const {
        isAuditCycleStandardLoading,
        isAuditCycleStandardCreating,
        isAuditCycleStandardSaving,
        auditCycleStandardSavedOk,
        auditCycleStandard,
        auditCycleStandardsErrorMessage,

        auditCycleStandardsAsync,
        auditCycleStandardAsync,
        auditCycleStandardCreateAsync,
        auditCycleStandardSaveAsync,
        auditCycleStandardClear,
    } = useAuditCycleStandardsStore();

    const {
        isOrganizationStandardsLoading,
        organizationStandards,
        organizationStandardsAsync,
    } = useOrganizationStandardsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [cycleTypeSelect, setCycleTypeSelect] = useState(null);
    const [auditCycleStepList, setAuditCycleStepList] = useState([]);

    useEffect(() => {
        if (!!auditCycleStandard && showModal) {
            setInitialValues({
                standardSelect: auditCycleStandard?.StandardID ?? '',
                initialStepSelect: auditCycleStandard?.InitialStep ?? '',
                cycleTypeSelect: auditCycleStandard?.CycleType ?? '',
                statusCheck: auditCycleStandard.Status === DefaultStatusType.active 
                    || auditCycleStandard.Status === DefaultStatusType.nothing,
            });

            if (!organizationStandards) {
                organizationStandardsAsync({
                    status: DefaultStatusType.active,
                    pageSize: 0,
                    includeDeleted: false,
                    order: StandardOrderType.name,
                });
            }

            setCycleTypeSelect(auditCycleStandard.CycleType);
        }
    }, [auditCycleStandard]);

    useEffect(() => {
        if (!!cycleTypeSelect && cycleTypeSelect != AuditCycleType.nothing) {
            
            if (cycleTypeSelect == AuditCycleType.initial) {
                setAuditCycleStepList([
                    { label: auditStepProps[AuditStepType.stage1].label , value: AuditStepType.stage1 },
                    { label: auditStepProps[AuditStepType.stage2].label , value: AuditStepType.stage2 }, // Puede que inicie en ST2 y no se aplique ST1
                ]);
            } else if (cycleTypeSelect == AuditCycleType.recertification) {
                setAuditCycleStepList([
                    { label: auditStepProps[AuditStepType.recertification].label, value: AuditStepType.recertification},
                ]);
            } else if (cycleTypeSelect == AuditCycleType.transfer) {
                setAuditCycleStepList([
                    { label: auditStepProps[AuditStepType.recertification].label, value: AuditStepType.recertification},
                    { label: auditStepProps[AuditStepType.surveillance1].label, value: AuditStepType.surveillance1},
                    { label: auditStepProps[AuditStepType.surveillance2].label, value: AuditStepType.surveillance2},
                ]);
            } else {
                setAuditCycleStepList([]);
            }            
        } else {
            setAuditCycleStepList([]);
        }
    }, [cycleTypeSelect]);

    useEffect(() => {
        if (!!auditCycleStandardSavedOk && showModal) {
            Swal.fire('Audit cycle standard', `Standard ${!id ? 'assigned' : 'updated'} successfully`, 'success');
            auditCycleStandardsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
                includeDeleted: hasRole(ROLES.admin),
            });
            onCloseModal();
        }
    }, [auditCycleStandardSavedOk]);    

    useEffect(() => {
        if (auditCycleStandardsErrorMessage && showModal) {
            Swal.fire('Audit cycle standard', auditCycleStandardsErrorMessage, 'error');
            onCloseModal();
        }        
    }, [auditCycleStandardsErrorMessage]);
    
    // METHODS

    const onShowModal = () => {

        if (!id) {
            auditCycleStandardCreateAsync({
                AuditCycleID: auditCycle.ID,
            });
        } else {
            auditCycleStandardAsync(id);
        }

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {

        auditCycleStandardClear();
        setShowModal(false);
    }; // onCloseModal

    const onFormSubmit = (values) => {

        const toSave = {
            ID: auditCycleStandard.ID,
            StandardID: !!id ? auditCycleStandard.StandardID : values.standardSelect,
            InitialStep: values.initialStepSelect ?? '',
            CycleType: values.cycleTypeSelect ?? '',
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        // console.log('onFormSubmit', toSave);

        auditCycleStandardSaveAsync(toSave);
    }; // onFormSubmit

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link p-0 mb-0"
                title={!!id ? 'Edit standard association' : 'Associate standard'}
                onClick={ onShowModal }
            >
                <FontAwesomeIcon icon={!!id ? faEdit : faPlus} size="lg" className="text-dark" />
            </button>
            <Modal show={showModal} onHide={onCloseModal}>
                <Modal.Header>
                    <Modal.Title>
                        <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className="px-3" />
                        { !!id ? 'Edit assigned standard' : 'Assign standard' }
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditCycleStandardLoading || isAuditCycleStandardCreating || isOrganizationStandardsLoading ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!auditCycleStandard && !!organizationStandards && showModal &&
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
                                        <Col xs="12">
                                            <AryFormikSelectInput
                                                name="standardSelect"
                                                label="Standard"
                                                disabled={!!id}
                                            >
                                                { !id && <option value="">(select)</option> }
                                                {
                                                    organizationStandards
                                                        .map(item =>
                                                            <option
                                                                key={item.StandardID}
                                                                value={item.StandardID}
                                                                className="text-capitalize"
                                                                disabled={ item.Status != DefaultStatusType.active || item.StandardStatus != DefaultStatusType.active }
                                                                title={ item.Status != DefaultStatusType.active || item.StandardStatus != DefaultStatusType.active ? 'Inactive' : 'Select' }
                                                            >
                                                                {item.StandardName}
                                                            </option>
                                                        )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <AryFormikSelectInput
                                                name="cycleTypeSelect"
                                                label="Cycle type"
                                                onChange={ e => {
                                                    setCycleTypeSelect(e.target.value);
                                                    formik.setFieldValue('cycleTypeSelect', e.target.value);
                                                }}
                                            >
                                                {
                                                    Object.keys(AuditCycleType).map(key =>
                                                        <option
                                                            key={key}
                                                            value={AuditCycleType[key]}
                                                            className="text-capitalize"
                                                        >
                                                            {key === 'nothing' ? '(select)' : key}
                                                        </option>
                                                    )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <AryFormikSelectInput
                                                name="initialStepSelect"
                                                label="Initial step"
                                            >
                                                <option value="">(select)</option>
                                                {
                                                    auditCycleStepList.map(item =>
                                                        <option
                                                            key={item.value}
                                                            value={item.value}
                                                            className="text-capitalize"
                                                        >
                                                            {item.label}
                                                        </option>
                                                    )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12" md="6" xxl="4">
                                            <div className="form-check form-switch mb-3">
                                                <input id="statusCheck" name="statusCheck"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange={ formik.handleChange }
                                                    checked={ formik.values.statusCheck }
                                                />
                                                <label 
                                                    className="form-check-label text-secondary mb-0" 
                                                    htmlFor="statusCheck"
                                                >
                                                    Active
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                        <div className="text-secondary mb-3 mb-sm-0">
                                            <AryLastUpdatedInfo item={ auditCycleStandard } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isAuditCycleStandardSaving }
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

export default AuditCycleStandardEditItem