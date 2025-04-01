import { faEdit, faLandmark, faPlus, faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import enums from "../../../helpers/enums";
import { useAuditsStore } from "../../../hooks/useAuditsStore";
import { useAuditAuditorsStore } from "../../../hooks/useAuditAuditorsStore";
import { useAuditorsStore } from "../../../hooks/useAuditorsStore";
import Swal from "sweetalert2";
import { Col, ListGroup, Modal, Row } from "react-bootstrap";
import { ViewLoading } from "../../../components/Loaders";
import { Field, Form, Formik } from "formik";
import { AryFormikSelectInput, AryFormikTextInput } from "../../../components/Forms";
import AryLastUpdatedInfo from "../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import * as Yup from "yup";
import isNullOrEmpty from "../../../helpers/isNullOrEmpty";
import { useAuditStandardsStore } from "../../../hooks/useAuditStandardsStore";

const AuditAuditorEditItem = ({ id, ...props }) => {

    const {
        DefaultStatusType,
    } = enums();

    const formDefaultValues = {
        auditorSelect: '',
        isLeaderCheck: false,
        isWitnessCheck: false,
        extraInfoInput: '',
        statusCheck: false,
        standardsCountHidden: 0,
    };

    const validationSchema = Yup.object({
        auditorSelect: Yup.string()
            .required('Must select an auditor'),
        // isLeaderCheck: Yup.boolean()
        //     .required('Must select a leader'),
        isWitnessCheck: Yup.boolean()
            .when('isLeaderCheck', {
                is: true,
                then: schema => schema.oneOf([false], 'The auditor can not be both lead and witness'),
                    
            }),
        extraInfoInput: Yup.string()
            .max(500, 'Extra info must be at most 500 characters'),
        standardsCountHidden: Yup.number()
            .min(1, 'Must have at least one standard'),
    });

    // CUSTOM HOOKS

    const {
        audit
    } = useAuditsStore();

    const {
        auditStandards,
    } = useAuditStandardsStore();

    const {
        isAuditAuditorLoading,
        isAuditAuditorCreating,
        isAuditAuditorSaving,
        auditAuditorSavedOk,
        auditAuditor,
        auditAuditorsErrorMessage,

        auditAuditorsAsync,
        auditAuditorAsync,
        auditAuditorCreateAsync,
        auditAuditorSaveAsync,
        auditAuditorClear,

        auditStandardAddAsync,
        auditStandardDelAsync,
    } = useAuditAuditorsStore();

    const {
        isAuditorsLoading,
        auditors,
        auditorsAsync,
    } = useAuditorsStore();

    // HOOKS

    const formikRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    const [standardSelect, setStandardSelect] = useState('');
    const [standardsList, setStandardsList] = useState([]);
    //const [isForUpdateStandard, setIsForUpdateStandard] = useState(false);
    //const [standardsCount, setStandardsCount] = useState(0);

    useEffect(() => {

        if (!!auditAuditor && showModal) {
            const standardsActiveCount = audit.Standards.filter(i => i.Status == DefaultStatusType.active).length;
            const oneStandardActive = audit.Standards.find(i => i.Status == DefaultStatusType.active && standardsActiveCount == 1);            
            const standard = auditAuditor.AuditStandards?.find(i => !!oneStandardActive && i.ID == oneStandardActive.ID); 

            setInitialValues({
                auditorSelect: auditAuditor?.AuditorID ?? '',
                isLeaderCheck: auditAuditor?.IsLeader ?? false,
                isWitnessCheck: auditAuditor?.IsWitness ?? false,
                extraInfoInput: auditAuditor?.Comments ?? '',
                statusCheck: auditAuditor.Status == DefaultStatusType.active
                    || auditAuditor.Status == DefaultStatusType.nothing,
                standardsCountHidden: auditAuditor.AuditStandards?.length > 0 
                    ? auditAuditor.AuditStandards?.length
                    : (!standard && !!oneStandardActive ? 1 : 0),
            });

            if (!auditors || auditors.length === 0) {
                auditorsAsync({
                    status: DefaultStatusType.active,
                    pageSize: 0,
                });
            }

            // Cargar lista de standards asociado al auditAuditor
            if (auditAuditor.AuditStandards != null) {
                setStandardsList(auditAuditor.AuditStandards.map(i => ({
                    ID: i.ID,
                    StandardName: i.StandardName,
                })));
            } else {
                setStandardsList([]);
            }

            setStandardSelect(!standard && !!oneStandardActive ? oneStandardActive.ID : '');
        } else if (!!auditAuditor && showModal && isForUpdateStandard) {
            // setStandardsCount(auditAuditor?.AuditStandards?.length ?? 0);
            formikRef.current.setFieldValue('standardsCountHidden', auditAuditor?.AuditStandards?.length ?? 0);
        }

    }, [auditAuditor]);
    
    useEffect(() => {
        if (!!auditAuditorSavedOk && showModal) {
            Swal.fire('Auditor', `Auditor ${!id ? 'added' : 'updated'} successfully`, 'success');
            auditAuditorsAsync({
                auditID: audit.ID,
                pageSize: 0,
            });
            //setShowModal(false);
            onCloseModal();
        }
    }, [auditAuditorSavedOk]);
    
    useEffect(() => {
        if (!!auditAuditorsErrorMessage && showModal) {
            Swal.fire('Auditor', auditAuditorsErrorMessage, 'error');
            //setShowModal(false);
        }
    }, [auditAuditorsErrorMessage]);
    
    // METHODS

    const onShowModal = () => {
        
        if (!id) {
            auditAuditorCreateAsync({
                AuditID: audit.ID,
            });
        } else {
            auditAuditorAsync(id);
        }

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {
        auditAuditorClear();
        setShowModal(false);
    }; // onCloseModal

    const onFormSubmit = (values) => {

        const auditorSelected = auditors.find(i => i.ID == values.auditorSelect);
        //console.log(auditorSelected?.IsLeadAuditor, values.isLeaderCheck);
        if (!!auditorSelected && !auditorSelected.IsLeadAuditor && values.isLeaderCheck) {
            Swal.fire('Error', 'The selected auditor could not be lead auditor', 'error');
            return;
        }

        addStandardSelected(); // por si hay algun standard seleccionado

        const toSave = {
            ID: auditAuditor.ID,
            AuditorID: values.auditorSelect,
            IsLeader: values.isLeaderCheck,
            IsWitness: values.isWitnessCheck,
            Comments: values.extraInfoInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        // console.log('onFormSubmit', toSave);

        auditAuditorSaveAsync(toSave);
    }; // onFormSubmit

    // AUDIT STANDARDS

    const addStandardSelected = () => {
        // console.log('addStandardSelected', standardSelect);

        if (!isNullOrEmpty(standardSelect)) {
            
            // // validar que el standard seleccionado no sea una que ya este asignado
            // if (!!auditAuditor?.AuditStandards && auditAuditor.AuditStandards.length > 0) {
            //     const existStandard = auditAuditor.AuditStandards.find(i => i.ID == standardSelect);
            //     //console.log('existStandard', existStandard);
            //     if (!!existStandard) {
            //         // Swal.fire('Error', 'The standard is already assigned', 'error');
            //         // console.log('El standard seleccionado ya está asignado');
            //         return;
            //     }
            // }

            auditStandardAddAsync(standardSelect)
                .then(data => {
                    // console.log('data', data);
                    if (!!data) {
                        //auditAuditorAsync(auditAuditor.ID); // Refrescar la lista de standards
                        //setIsForUpdateStandard(true); // Para que no actualice los initialValues
                        setStandardSelect(''); // reiniciar el select
                        const currentStandard = audit.Standards.find(i => i.ID == standardSelect);
                        setStandardsList([
                            ...standardsList,
                            {
                                ID: currentStandard.ID,
                                StandardName: currentStandard.StandardName,
                            }
                        ].sort((a, b) => a.StandardName.localeCompare(b.StandardName)));
                        formikRef.current.setFieldValue('standardsCountHidden', standardsList.length + 1);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }; // addStandardSelected

    const delStandard = (auditStandardID) => {
        // console.log('delStandard', auditStandardID);

        if (!!auditStandardID) {
            auditStandardDelAsync(auditStandardID)
                .then(data => {
                    // console.log('data', data);
                    if (!!data) {
                        // auditAuditorAsync(auditAuditor.ID); // Refrescar la lista de standards
                        // setIsForUpdateStandard(true); // Para que no actualice los initialValues
                        setStandardsList(standardsList.filter(i => i.ID != auditStandardID));                        
                        formikRef.current.setFieldValue('standardsCountHidden', standardsList.length - 1 < 0 ? 0 : standardsList.length - 1);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }; // delStandard

    const onStandardSelectChange = (e) => {
        setStandardSelect(e.target.value); // Creo que aquí con esto es suficiente        
        const standardsCount = formikRef.current.values.standardsCountHidden;

        // Para contar el numero de standards o si al menos esta uno seleccionado
        if (!isNullOrEmpty(e.target.value)) {
            //setStandardsCount(standardsCount + 1);
            formikRef.current.setFieldValue('standardsCountHidden', standardsCount + 1);
            //console.log('onStandardSelectChange', standardsCount + 1);
        } else {
            //setStandardsCount(standardsCount - 1);
            formikRef.current.setFieldValue('standardsCountHidden', standardsCount - 1 < 0 ? 0 : standardsCount - 1);
            //console.log('onStandardSelectChange', standardsCount - 1);
        }

    }; // onStandardSelectChange

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link p-0 mb-0"
                title={!!id ? 'Edit auditor assigned' : 'Assign an auditor'}
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className="text-dark" size="lg" />
            </button>
            <Modal show={showModal} onHide={onCloseModal}>
                <Modal.Header>
                    <Modal.Title>
                        <FontAwesomeIcon icon={ !!id ? faEdit : faPlus } className="px-3" />
                        { !!id ? 'Edit auditor associated' : 'Associate new auditor' }
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditAuditorLoading || isAuditAuditorCreating ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!auditAuditor && showModal &&
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={onFormSubmit}
                        innerRef={formikRef}
                    >
                        {formik => (
                            <Form>
                                <Modal.Body>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikSelectInput
                                                name="auditorSelect"
                                                label="Auditor"
                                                disabled={!!id}
                                            >
                                                { !id && <option value="">(select auditor)</option> }
                                                {
                                                    auditors
                                                        // .filter(item => item.Status === DefaultStatusType.active)
                                                        .map(item =>
                                                            <option
                                                                key={item.ID}
                                                                value={item.ID}
                                                                className="text-capitalize"
                                                                disabled={item.Status != DefaultStatusType.active}
                                                            >
                                                                {item.FullName}
                                                                {item.IsLeadAuditor ? ' (Lead auditor)' : ''}
                                                            </option>
                                                        )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12">
                                            <Row>
                                                <Col xs="12" sm="8">
                                                    <div className="mb-3">
                                                        <label className="form-label">Standard</label>
                                                        <select 
                                                            className="form-select" 
                                                            value={standardSelect} 
                                                            onChange={onStandardSelectChange}
                                                        >
                                                            <option value="">(select standard)</option>
                                                            {
                                                                !!audit && audit.Standards && audit.Standards.length > 0 && 
                                                                audit.Standards.map(standard => (
                                                                    <option 
                                                                        key={standard.ID} 
                                                                        value={standard.ID}
                                                                        disabled={ standard.Status != DefaultStatusType.active }
                                                                    >
                                                                        {standard.StandardName}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </Col>
                                                <Col xs="12" sm="4">
                                                    <div className="d-grid gap-1">
                                                        <label className="form-label">&nbsp;</label>
                                                        <button 
                                                            type='button' 
                                                            className="btn bg-gradient-secondary text-white"
                                                            onClick={addStandardSelected}
                                                        >
                                                            Add another
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs="12">
                                            <label className="form-label">Standards assigned</label>
                                            <div className="bg-gray-100 rounded-3 mb-3 p-2">
                                                { !!auditAuditor && !!standardsList && standardsList.length > 0 ? ( 
                                                    <ListGroup>
                                                        {
                                                            standardsList.map(item => 
                                                                <ListGroup.Item key={item.ID} className="bg-transparent border-0 py-1 ps-0 text-xs">
                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                        <span>
                                                                            <FontAwesomeIcon icon={ faLandmark } className="me-2" />
                                                                            <span className="font-weight-bold">
                                                                                {item.StandardName}
                                                                            </span>
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-link p-0 mb-0 text-secondary"
                                                                            onClick={() => delStandard(item.ID)}
                                                                            title="Delete standard"
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrashCan} size="lg" />
                                                                        </button>
                                                                    </div>
                                                                </ListGroup.Item>
                                                            )
                                                        }
                                                    </ListGroup>
                                                ) : (
                                                    <p className="text-center text-secondary text-xs">
                                                        (no standards assigned, select the standard or press de Add Another button to assign more than one)
                                                    </p>
                                                )}
                                            </div>
                                            <Field name="standardsCountHidden" type="hidden" value={ formik.values.standardsCountHidden } />
                                            {
                                                formik.touched.standardsCountHidden && formik.errors.standardsCountHidden &&
                                                <span className="text-danger text-xs">{formik.errors.standardsCountHidden}</span>
                                            }
                                        </Col>
                                        <Col xs="12">
                                            <div className="form-check form-switch mb-3">
                                                <input id="isLeaderCheck" name="isLeaderCheck"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange={ formik.handleChange }
                                                    checked={ formik.values.isLeaderCheck }
                                                />
                                                <label 
                                                    className="form-check-label text-secondary mb-0" 
                                                    htmlFor="isLeaderCheck"
                                                >
                                                    Is Lead auditor
                                                </label>
                                            </div>
                                        </Col>
                                        <Col xs="12">
                                            <div className="form-check form-switch mb-3">
                                                <input id="isWitnessCheck" name="isWitnessCheck"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange={ formik.handleChange }
                                                    checked={ formik.values.isWitnessCheck }
                                                />
                                                <label 
                                                    className="form-check-label text-secondary mb-0" 
                                                    htmlFor="isWitnessCheck"
                                                >
                                                    Is Witness
                                                </label>
                                            </div>
                                            {
                                                formik.touched.isWitnessCheck && formik.errors.isWitnessCheck &&
                                                <span className="text-danger text-xs">{formik.errors.isWitnessCheck}</span>
                                            }
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                name="extraInfoInput"
                                                label="Extra Info"
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
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-start align-items-sm-center w-100">
                                        <div className="text-secondary mb-3 mb-sm-0">
                                            <AryLastUpdatedInfo item={ auditAuditor } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isAuditAuditorSaving }
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

export default AuditAuditorEditItem;