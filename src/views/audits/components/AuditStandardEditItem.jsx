import { faEdit, faExclamationTriangle, faPlus, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Yup from "yup";
import { useAuditsStore } from "../../../hooks/useAuditsStore";
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";
import { useOrganizationStandardsStore } from "../../../hooks/useOrganizationStandardsStore";
import { useAuditCyclesStore } from "../../../hooks/useAuditCyclesStore";
import { useEffect, useState } from "react";
import { useAuditCycleStandardsStore } from "../../../hooks/useAuditCycleStandardsStore";
import enums from "../../../helpers/enums";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import { ViewLoading } from "../../../components/Loaders";
import { Form, Formik } from "formik";
import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";
import auditStepProps from "../helpers/auditStepProps";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import Swal from "sweetalert2";
import { setAuditStandards } from "../../../store/slices/auditStandardsSlice";

const AuditStandardEditItem = ({ id, ...props }) => {

    const {
        AuditStepType,
        DefaultStatusType
    } = enums();

    const formDefaultValues = {
        standardSelect: '',
        stepSelect: '',
        extraInfoInput: '',
        statusCheck: false,
    };

    const validationSchema = Yup.object({
        standardSelect: Yup.string()
            .required('Must select a standard'),
        stepSelect: Yup.string()
            .required('Must select the step'),
        extraInfoInput: Yup.string()
            .max(1000, 'Extra info must be at most 1000 characters'),
    });

    // CUSTOM HOOKS

    const {
        auditCycle
    } = useAuditCyclesStore();

    const {
        audit
    } = useAuditsStore();

    const {
        isAuditStandardLoading,
        isAuditStandardCreating,
        isAuditStandardSaving,
        auditStandardSavedOk,
        auditStandard,
        auditStandards,
        auditStandardsErrorMessage,

        auditStandardsAsync,
        auditStandardAsync,
        auditStandardCreateAsync,
        auditStandardSaveAsync,
        auditStandardClear,
    } = useAuditStandardsStore();

    const {
        isAuditCycleStandardsLoading,
        auditCycleStandards,
        auditCycleStandardsAsync,
    } = useAuditCycleStandardsStore();
        
    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    const [standardSelect, setStandardSelect] = useState(null);
    const [auditStepList, setAuditStepList] = useState([]);

    useEffect(() => {
        if (!!auditStandard && showModal) {
            setInitialValues({
                standardSelect: auditStandard?.StandardID ?? '',
                stepSelect: auditStandard?.Step ?? '',
                extraInfoInput: auditStandard?.ExtraInfo ?? '',
                statusCheck: auditStandard.Status == DefaultStatusType.active
                    || auditStandard.Status == DefaultStatusType.nothing,
            });

            auditCycleStandardsAsync({ 
                auditCycleID: audit.AuditCycleID,
                pageSize: 0,
            });

            setStandardSelect(auditStandard.StandardID);
        }
    }, [auditStandard]);

    useEffect(() => {

        if (showModal) {
            const firstStandardActive = auditStandards.find(standard => standard.Status == DefaultStatusType.active);

            if (!!firstStandardActive && firstStandardActive.Step == AuditStepType.special) {
                setAuditStepList([
                    { label: auditStepProps[AuditStepType.special].label , value: AuditStepType.special },
                ]);
            } else if (!!standardSelect && standardSelect != DefaultStatusType.nothing) {
                var auditCycleStandard = auditCycleStandards.find(i => i.StandardID == standardSelect);

                if (!!auditCycleStandard) {
                    const auditStandardsTmp = [];
                    if (auditCycleStandard.InitialStep == AuditStepType.stage1) {
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.stage1].label , value: AuditStepType.stage1 });
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.stage2].label , value: AuditStepType.stage2 });
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance1].label , value: AuditStepType.surveillance1 });
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance2].label , value: AuditStepType.surveillance2 });

                    } else if (auditCycleStandard.InitialStep == AuditStepType.stage2) {
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.stage2].label , value: AuditStepType.stage2 });
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance1].label , value: AuditStepType.surveillance1 });
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance2].label , value: AuditStepType.surveillance2 });

                    } else if (auditCycleStandard.InitialStep == AuditStepType.surveillance1) {
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance1].label , value: AuditStepType.surveillance1 });
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance2].label , value: AuditStepType.surveillance2 });

                    } else if (auditCycleStandard.InitialStep == AuditStepType.surveillance2) {
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance2].label , value: AuditStepType.surveillance2 });

                    } else if (auditCycleStandard.InitialStep == AuditStepType.recertification) {
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.recertification].label , value: AuditStepType.recertification });
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance1].label , value: AuditStepType.surveillance1 });
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.surveillance2].label , value: AuditStepType.surveillance2 });                    
                    }

                    if (!!auditStandards && auditStandards.length == 0) {
                        auditStandardsTmp.push({label: auditStepProps[AuditStepType.special].label , value: AuditStepType.special });
                    }

                    setAuditStepList(auditStandardsTmp);
                }
            }
        }
    }, [standardSelect]);
    
    
    useEffect(() => {
        if (!!auditStandardSavedOk && showModal) {
            Swal.fire('Audit standard', `Standard ${!id ? 'assigned' : 'updated'} successfully`, 'success');
            auditStandardsAsync({
                auditID: audit.ID,
                pageSize: 0,
            });
            onCloseModal();
        }
    }, [auditStandardSavedOk]);
    
    useEffect(() => {
        if (!!auditStandardsErrorMessage && showModal) {
            Swal.fire('Audit standard', auditStandardsErrorMessage, 'error');
            onCloseModal();
        }
    }, [auditStandardsErrorMessage]);
    
    // METHODS

    const onShowModal = () => {

        if (!id) {
            auditStandardCreateAsync({
                AuditID: audit.ID,
            });
        } else {
            auditStandardAsync(id);
        }

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {
        auditStandardClear();
        setShowModal(false);
    }; // onCloseModal

    const onFormSubmit = (values) => {
        const toSave = {
            ID: auditStandard.ID,
            StandardID: !!id ? auditStandard.StandardID : values.standardSelect,
            Step: values.stepSelect ?? '',
            ExtraInfo: values.extraInfoInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        auditStandardSaveAsync(toSave);
    }; // onFormSubmit

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link p-0 mb-0"
                title={!!id ? 'Edit standard associated' : 'Associate an standard'}
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className="text-dark" size="lg" />
            </button>
            <Modal show={showModal} onHide={onCloseModal}>
                <Modal.Header>
                    <Modal.Title>
                        <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className="px-3" />
                        { !!id ? 'Edit standard association' : 'Associate standard' }
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditStandardLoading || isAuditStandardCreating || isAuditCycleStandardsLoading ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!auditStandard && showModal &&
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
                                                onChange={ (e) => {
                                                    setStandardSelect(e.target.value);
                                                    formik.setFieldValue('standardSelect', e.target.value);
                                                }}
                                            >
                                                { !id && <option value="">(select)</option> }
                                                {
                                                    auditCycleStandards
                                                        // .filter(item => (item.Status === DefaultStatusType.active))
                                                        .map(item =>
                                                            <option
                                                                key={item.StandardID}
                                                                value={item.StandardID}
                                                                className="text-capitalize"
                                                                disabled={item.Status != DefaultStatusType.active || item.StandardStatus != DefaultStatusType.active}
                                                                title={item.Status != DefaultStatusType.active || item.StandardStatus != DefaultStatusType.active ? 'Inactive' : 'Select'}
                                                            >
                                                                {item.StandardName}
                                                            </option>
                                                        )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikSelectInput
                                                name="stepSelect"
                                                label="Step"
                                            >
                                                <option value="">(select)</option>
                                                { auditStepList.map(item =>
                                                    <option
                                                        key={item.value}
                                                        value={item.value}
                                                        className="text-capitalize"
                                                    >
                                                        {item.label}
                                                    </option>
                                                )}
                                                {/* {
                                                    auditStepProps.map(item =>
                                                        <option
                                                            key={item.id}
                                                            value={item.id}
                                                            className="text-capitalize"
                                                        >
                                                            {item.label === '-' ? '(select)' : item.label}
                                                        </option>
                                                    )
                                                } */}
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                name="extraInfoInput"
                                                label="Extra info"
                                            />
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
                                        {
                                            !!id && !!auditStandard && auditStandard.Status != DefaultStatusType.active ?
                                            <Col xs="12">
                                                <Alert variant="warning">
                                                    <FontAwesomeIcon icon={ faExclamationTriangle } className="text-white me-2" size="lg" />
                                                    <span className="text-sm text-white">
                                                        This standard is inactive
                                                    </span>
                                                </Alert>
                                            </Col> : null
                                        }
                        
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                        <div className="text-secondary mb-3 mb-sm-0">
                                            <AryLastUpdatedInfo item={ auditStandard } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isAuditStandardSaving }
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

export default AuditStandardEditItem