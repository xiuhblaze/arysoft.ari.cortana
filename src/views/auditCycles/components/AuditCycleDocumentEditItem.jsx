import { faEdit, faFile, faPlus, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useAuditCycleDocumentsStore } from '../../../hooks/useAuditCycleDocumentsStore'
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore'
import { Col, Modal, Row } from 'react-bootstrap'
import * as Yup from "yup";
import { useOrganizationStandardsStore } from '../../../hooks/useOrganizationStandardsStore'
import { ViewLoading } from '../../../components/Loaders'
import { Form, Formik } from 'formik'
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo'
import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms'
import enums from '../../../helpers/enums'
import envVariables from '../../../helpers/envVariables'
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore'
import isNullOrEmpty from '../../../helpers/isNullOrEmpty'
import auditCycleDocumentTypeProps from '../helpers/auditCycleDocumentTypeProps'
import Swal from 'sweetalert2'
import getRandomNumber from '../../../helpers/getRandomNumber'

const AuditCycleDocumentEditItem = ({ id, documentType, ...props }) => {
    const {
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
    } = envVariables();

    const { 
        AuditCycleDocumentType,
        DefaultStatusType ,
    } = enums();

    const formDefaultValues = {
        standardSelect: '',
        fileInput: '',
        versionInput: '',        
        commentsInput: '',  
        otherDescriptionInput: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({      
        fileInput: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop()?.toLowerCase() ?? '';
                        const validTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', '7z'];
                        if (!validTypes.includes(extension)) {
                            return ctx.createError({
                                message: 'Only files with png, jpg, pdf, png, doc, docx, xls, xlsx, zip, rar or 7z extensions are allowed'
                            });
                        }
                    }
                    return true;
                }
            }),  
        versionInput: Yup.string()
            .max(10, 'Version must be at most 10 characters'),
        commentsInput: Yup.string()
            .max(500, 'Comments must be at most 500 characters'),
        otherDescriptionInput: Yup.string()
            .max(100, 'Other description must be at most 100 characters'),
    });

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        auditCycle,
    } = useAuditCyclesStore();

    const {
        organizationStandards
    } = useOrganizationStandardsStore();

    const {
        isAuditCycleDocumentLoading,
        isAuditCycleDocumentCreating,
        isAuditCycleDocumentSaving,
        auditCycleDocumentSavedOk,
        auditCycleDocument,
        auditCycleDocumentsErrorMessage,

        auditCycleDocumentsAsync,
        auditCycleDocumentAsync,
        auditCycleDocumentCreateAsync,
        auditCycleDocumentSaveAsync,
        auditCycleDocumentClear,
    } = useAuditCycleDocumentsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        if (!!auditCycleDocument && showModal) {
            const oneStandardActive = auditCycle.AuditCycleStandards.find(i => i.Status == DefaultStatusType.active);
            const standardSelect = auditCycle.AuditCycleStandards.filter(acs => acs.Status == DefaultStatusType.active).length == 1 && !!oneStandardActive
                ? oneStandardActive.StandardID 
                : '';

            setInitialValues({
                standardSelect: auditCycleDocument?.StandardID ?? standardSelect,
                versionInput: auditCycleDocument?.Version ?? '',
                commentsInput: auditCycleDocument?.Comments ?? '',
                otherDescriptionInput: auditCycleDocument?.OtherDescription ?? '',
                statusCheck: auditCycleDocument?.Status == DefaultStatusType.active 
                    || auditCycleDocument?.Status == DefaultStatusType.nothing,
                fileInput: '',
            });
        }
    }, [auditCycleDocument]);

    useEffect(() => {
        if (!!auditCycleDocumentSavedOk && showModal) {
            Swal.fire('Document', `Document ${ !id ? 'added' : 'updated'} successfully`, 'success');  
            auditCycleDocumentsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
            onCloseModal();
        }
    }, [auditCycleDocumentSavedOk]);

    useEffect(() => {
        if (!!auditCycleDocumentsErrorMessage && showModal) {
            Swal.fire('Document', auditCycleDocumentsErrorMessage, 'error');
            // onCloseModal();
        }
    }, [auditCycleDocumentsErrorMessage]);
    
    // METHODS

    const onShowModal = () => {

        if (!id) {
            auditCycleDocumentCreateAsync({
                AuditCycleID: auditCycle.ID,
            });
        } else {
            auditCycleDocumentAsync(id);
        }

        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {

        if (!isAuditCycleDocumentSaving) {
            auditCycleDocumentClear();
            setShowModal(false);
        }
    }; // onCloseModal

    const onFormSubmit = (values) => {
        //console.log(values);
        const toSave = {
            ID: auditCycleDocument.ID,
            StandardID: values.standardSelect,
            Version: values.versionInput,
            Comments: values.commentsInput,
            DocumentType: documentType,
            OtherDescription: values.otherDescriptionInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };
        //console.log(toSave);
        auditCycleDocumentSaveAsync(toSave, values.fileInput);
    }; // onFormSubmit
    
    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link p-0 mb-0"
                title={!!id ? 'Edit document information' : 'Add new document'}
                onClick={ onShowModal }
            >
                <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className="text-dark" size="lg" />
            </button>
            <Modal show={showModal} onHide={onCloseModal}>
                <Modal.Header>
                    <Modal.Title>
                        <FontAwesomeIcon icon={ !!id ? faEdit : faPlus } className="px-3" />
                        { !!id ? 'Edit document info' : 'Add document file' }
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditCycleDocumentLoading || isAuditCycleDocumentCreating ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!auditCycleDocument && showModal &&
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
                                            <div className="alert alert-light mb-1">
                                                <h6 className="mb-0"> 
                                                    { auditCycle.Name }
                                                    <span className="mx-2">-</span>
                                                    { auditCycleDocumentTypeProps[documentType].label }
                                                </h6>
                                                { 
                                                    !isNullOrEmpty(auditCycleDocumentTypeProps[documentType].helpText)
                                                    && <p className="text-xs mb-0">{ auditCycleDocumentTypeProps[documentType].helpText }</p>
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikSelectInput
                                                name="standardSelect"
                                                label="Standard"
                                                helpText="Leave blank to assign to all standards"
                                            >
                                                <option value="">(all standards)</option>
                                                {
                                                    //organizationStandards
                                                    auditCycle.AuditCycleStandards
                                                        // .filter(item => (item.Status === DefaultStatusType.active))
                                                        .map(item =>
                                                            <option
                                                                key={item.StandardID}
                                                                value={item.StandardID}
                                                                className="text-capitalize"
                                                                disabled={ item.Status != DefaultStatusType.active }
                                                            >
                                                                {item.StandardName}
                                                            </option>
                                                        )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12">
                                            <label className="form-label">Document file</label>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                {
                                                    isNullOrEmpty(auditCycleDocument.Filename) ? (
                                                        <div className="w-100">
                                                            <input
                                                                id="Filename"
                                                                type="file"
                                                                name="fileInput"
                                                                accept=".png, .jpg, .pdf, .doc, .docx, .xls, .xlsx, .zip, .rar, .7z"
                                                                className="form-control"
                                                                onChange={(e) => {
                                                                    formik.setFieldValue('fileInput', e.currentTarget.files[0]);
                                                                }}
                                                                onBlur={(e) => {
                                                                    formik.handleBlur(e);
                                                                }}
                                                            />
                                                            {/* <div className="text-xs text-secondary mt-1 me-2">If a file exists, the new one will overwrite the current one</div> */}
                                                            {
                                                                formik.touched.fileInput && formik.errors.fileInput &&
                                                                <span className="text-danger text-xs">{formik.errors.fileInput}</span>
                                                            }
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <a
                                                                href={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}/${auditCycleDocument.Filename}?v=${getRandomNumber(4)}`}
                                                                target="_blank"
                                                                className="btn btn-link text-dark mb-0 py-2 text-center"
                                                                title="View current file"
                                                            >
                                                                <FontAwesomeIcon icon={faFile} size="xl" />
                                                                <span className=" text-sm ms-2">
                                                                    { auditCycleDocument.Filename }
                                                                </span>
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextInput
                                                name="versionInput"
                                                label="Version"
                                                placeholder="1.0"
                                            />
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextArea
                                                name="commentsInput"
                                                label="Comments"
                                                rows="4"
                                            />
                                        </Col>
                                        {
                                            documentType == AuditCycleDocumentType.other &&
                                            <Col xs="12">
                                                <AryFormikTextInput
                                                    name="otherDescriptionInput"
                                                    label="Description for other document type"
                                                    rows="4"
                                                />
                                            </Col>
                                        }
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
                                            <AryLastUpdatedInfo item={ auditCycleDocument } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isAuditCycleDocumentSaving }
                                            >
                                                {
                                                    isAuditCycleDocumentSaving 
                                                        ? <FontAwesomeIcon icon={ faSpinner } className="me-1" size="lg" spin />
                                                        : <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                }
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

export default AuditCycleDocumentEditItem