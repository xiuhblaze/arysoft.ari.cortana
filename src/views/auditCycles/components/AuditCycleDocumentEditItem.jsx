import { faEdit, faFile, faPlus, faSave } from '@fortawesome/free-solid-svg-icons'
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

const AuditCycleDocumentEditItem = ({ id, documentType, auditCycle, ...props }) => {
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
                        const extension = value.name.split(/[.]+/).pop(); // value.name.split('.').slice(-1)[0]; // https://stackoverflow.com/questions/651563/getting-the-last-element-of-a-split-string-array
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

    // const {
    //     auditCycle,
    // } = useAuditCyclesStore();

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
            setInitialValues({
                standardSelect: auditCycleDocument?.StandardID ?? '',
                versionInput: auditCycleDocument?.Version ?? '',
                commentsInput: auditCycleDocument?.Comments ?? '',
                otherDescriptionInput: auditCycleDocument?.OtherDescription ?? '',
                statusCheck: auditCycleDocument?.Status === DefaultStatusType.active,
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
            auditCycleDocumentClear();
            setShowModal(false);
        }
    }, [auditCycleDocumentSavedOk]);

    useEffect(() => {
        if (!!auditCycleDocumentsErrorMessage && showModal) {
            Swal.fire('Document', auditCycleDocumentsErrorMessage, 'error');
            auditCycleDocumentClear();
            onCloseModal();
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

        auditCycleDocumentClear();
        setShowModal(false);
    }; // onCloseModal

    const onFormSubmit = (values) => {
        const toSave = {
            ID: auditCycleDocument.ID,
            StandardID: values.standardSelect == '' ? null : values.standardSelect,
            Version: values.versionInput,
            Comments: values.commentsInput,
            DocumentType: documentType,
            OtherDescription: values.otherDescriptionInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

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
                        { !!id ? 'Edit document' : 'Add document' }
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
                                            <p className="text-secondary font-weight-bold mb-0">
                                                { auditCycle.Name }
                                                <span className="mx-2">-</span>
                                                { auditCycleDocumentTypeProps[documentType].label }
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikSelectInput
                                                name="standardSelect"
                                                label="Standard"
                                                helpText="Leave blank to assign to all standards"
                                            >
                                                <option value="">(select)</option>
                                                {
                                                    organizationStandards
                                                        // .filter(item => (item.Status === DefaultStatusType.active))
                                                        .map(item =>
                                                            <option
                                                                key={item.StandardID}
                                                                value={item.StandardID}
                                                                className="text-capitalize"
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
                                                    !isNullOrEmpty(auditCycleDocument.Filename) &&
                                                    <div>
                                                        <a
                                                            href={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}/${auditCycleDocument.Filename}`}
                                                            target="_blank"
                                                            className="btn btn-link text-dark mb-0 text-lg py-2 text-center"
                                                            title="View current file"
                                                        >
                                                            <FontAwesomeIcon icon={faFile} size="lg" />
                                                        </a>
                                                    </div>
                                                }
                                                <div className="w-100">
                                                    <input
                                                        id="Filename"
                                                        type="file"
                                                        name="documentFile"
                                                        accept=".png, .jpg, .pdf, .doc, .docx, .xls, .xlsx, .zip, .rar, .7z"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            formik.setFieldValue('fileInput', e.currentTarget.files[0]);
                                                        }}
                                                    />
                                                    <div className="text-xs text-secondary mt-1 me-2">If a file exists, the new one will overwrite the current one</div>
                                                    {
                                                        formik.touched.documentFileInput && formik.errors.photoFileInput &&
                                                        <span className="text-danger text-xs">{formik.errors.photoFileInput}</span>
                                                    }
                                                </div>
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
                                                    label="Other description"
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

export default AuditCycleDocumentEditItem