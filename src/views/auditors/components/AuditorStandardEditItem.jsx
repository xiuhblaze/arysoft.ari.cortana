import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import * as Yup from "yup";
import Swal from 'sweetalert2';

import { ViewLoading } from '../../../components/Loaders'
import { useAuditorStandardsStore } from '../../../hooks/useAuditorStandardsStore'
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import enums from '../../../helpers/enums';
import { useStandardsStore } from '../../../hooks/useStandardsStore';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput, AryFormikTextArea } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';

const AuditorStandardEditItem = ({ id, ...props }) => {

    const {
        AuditorStandardOrderType,
        DefaultStatusType,
        StandardOrderType,
    } = enums();

    const formDefaultValues = {
        standardSelect: '',
        comentsInput: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        standardSelect: Yup.string()
            .required('Must select a standard'),
        comentsInput: Yup.string()
            .max(1000, 'The comments cannot exceed more than 1000 characters'),
    });

    // CUSTOM HOOKS

    const {
        auditor,
        auditorAsync,
    } = useAuditorsStore();

    const {
        isAuditorStandardLoading,
        isAuditorStandardCreating,
        isAuditorStandardSaving,
        auditorStandardSavedOk,
        auditorStandard,
        auditorStandardsErrorMessage,

        auditorStandardAsync,
        auditorStandardCreateAsync,
        auditorStandardSaveAsync,
        auditorStandardClear,
    } = useAuditorStandardsStore();

    const {
        isStandardsLoading,
        standards,
        standardsAsync,
    } = useStandardsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
      
        if (!!auditorStandard && showModal) {
            setInitialValues({
                standardSelect: auditorStandard?.StandardID ?? '',
                commentsInput: auditorStandard?.Comments ?? '',
                statusCheck: auditorStandard.Status === DefaultStatusType.active,
            });

            standardsAsync({
                status: DefaultStatusType.active,
                pageSize: 0,
                includeDeleted: false,
                order: StandardOrderType.name,
            });
        }
    }, [auditorStandard]);

    useEffect(() => {
        if (!!auditorStandardSavedOk && showModal) {
            Swal.fire('Standard', `Standard ${!id ? 'assigned' : 'updated'} successfully`, 'success');            
            auditorAsync(auditor.ID);
            auditorStandardClear();
            setShowModal(false);
        }
    }, [auditorStandardSavedOk]);
    
    useEffect(() => {
        if (!!auditorStandardsErrorMessage && showModal) {
            Swal.fire('Standard', auditorStandardsErrorMessage, 'error');
            auditorStandardClear();
            onCloseModal();
        }
    }, [auditorStandardsErrorMessage]);
    
    // METHODS

    const onShowModal = () => {

        if (!id) {
            auditorStandardCreateAsync({
                AuditorID: auditor.ID,
            });
        } else {
            auditorStandardAsync(id);
        }

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {

        auditorStandardClear();
        setShowModal(false);        
    }; // onCloseModal

    const onFormSubmit = (values) => {

        const toSave = {
            ID: auditorStandard.ID,
            StandardID: !!id ? auditorStandard.StandardID : values.standardSelect,
            Comments: values.commentsInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        auditorStandardSaveAsync(toSave);
    }; // onFormSubmit

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link mb-0 p-0 text-lg"
                title={ !!id ? 'Edit standard assigned' : 'Assigned standard' }
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={!!id ?faEdit : faPlus} className="text-dark" />
            </button>
            <Modal show={showModal} onHide={onCloseModal} >
                <Modal.Header>
                    <Modal.Title>
                        {
                            !!id ? (
                                <>
                                    <FontAwesomeIcon icon={faEdit} className="px-3" />
                                    Edit standard assigned
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} className="px-3" />
                                    Assign standard
                                </>
                            )
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditorStandardLoading || isAuditorStandardCreating || isStandardsLoading ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!auditorStandard && showModal && 
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
                                                <option value="">(select)</option>
                                                {
                                                    standards.map(item =>
                                                        <option
                                                            key={item.ID}
                                                            value={item.ID}
                                                            className="text-capitalize"
                                                        >
                                                            {item.Name}
                                                        </option>
                                                    )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextArea name="commentsInput"
                                                label="Comments"
                                            />
                                        </Col>
                                        <Col xs="12" md="6">
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
                                            <AryLastUpdatedInfo item={auditorStandard} />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={isAuditorStandardSaving}
                                            >
                                                <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
                                                Save
                                            </button>
                                            <button type="button"
                                                className="btn btn-link text-secondary mb-0"
                                                onClick={onCloseModal}>
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

export default AuditorStandardEditItem