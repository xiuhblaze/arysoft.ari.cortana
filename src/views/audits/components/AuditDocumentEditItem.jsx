import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import { Col, ListGroup, Modal, Row } from 'react-bootstrap';
import { faEdit, faFile, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { useAuditDocumentsStore } from '../../../hooks/useAuditDocumentsStore';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { useEffect, useState } from 'react';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import { ViewLoading } from '../../../components/Loaders';
import * as Yup from "yup";
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import auditDocumentTypeProps from '../helpers/auditDocumentTypeProps';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import getRandomNumber from '../../../helpers/getRandomNumber';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import Swal from 'sweetalert2';
import AuditDocumentStandardsList from './AuditDocumentStandardsList';

const AuditDocumentEditItem = ({ id, documentType, ...props }) => {
    const {
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
    } = envVariables();

    const {
        AuditDocumentType,
        DefaultStatusType,
    } = enums();

    const formDefaultValues = {
        standardSelect: '',
        fileInput: '',
        commentsInput: '',
        otherDescriptionInput: '',
        isWitnessIncludedCheck: false,
        statusCheck: false,
    };

    const validationSchema = Yup.object({
        // standardSelect: Yup.string()
        //     .required('Must select a standard'),
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
        auditCycle
    } = useAuditCyclesStore();

    const {
        audit
    } = useAuditsStore();

    const {
        isAuditDocumentLoading,
        isAuditDocumentCreating,
        isAuditDocumentSaving,
        auditDocumentSavedOk,
        auditDocument,
        auditDocumentsErrorMessage,

        auditDocumentsAsync,
        auditDocumentAsync,
        auditDocumentCreateAsync,
        auditDocumentSaveAsync,
        auditDocumentClear,
    } = useAuditDocumentsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        if (!!auditDocument && showModal) {
            const oneStandardActive = audit.Standards.find(i => i.Status == DefaultStatusType.active);
            const standardSelect = audit.Standards.filter(acs => acs.Status == DefaultStatusType.active).length == 1 && !!oneStandardActive
                ? oneStandardActive.StandardID 
                : '';

            setInitialValues({
                standardSelect: auditDocument?.StandardID ?? standardSelect,
                fileInput: '',
                commentsInput: auditDocument?.Comments ?? '',
                otherDescriptionInput: auditDocument?.OtherDescription ?? '',
                isWitnessIncludedCheck: auditDocument?.isWitnessIncluded ?? false,
                statusCheck: auditDocument.Status == DefaultStatusType.active
                    || auditDocument.Status == DefaultStatusType.nothing,
            });
        }
    }, [auditDocument]);
    
    useEffect(() => {
        if (!!auditDocumentSavedOk && showModal) {
            Swal.fire('Document', `Document ${!id ? 'added' : 'updated'} successfully`, 'success');
            auditDocumentsAsync({
                auditID: audit.ID,
                pageSize: 0,
            });
            // auditDocumentClear();
            // setShowModal(false);
            onCloseModal();
        }
    }, [auditDocumentSavedOk]);
    
    useEffect(() => {
        if (!!auditDocumentsErrorMessage && showModal) {
            Swal.fire('Document', auditDocumentsErrorMessage, 'error');
            // auditDocumentClear();
            onCloseModal();
        }
    }, [auditDocumentsErrorMessage]);

    // METHODS

    const onShowModal = () => {
        
        if (!id) {
            auditDocumentCreateAsync({
                AuditID: audit.ID,
            });
        } else {
            auditDocumentAsync(id);
        }

        setShowModal(true);
    };
    
    const onCloseModal = () => {
        auditDocumentClear();
        setShowModal(false);
    };

    const onFormSubmit = (values) => {
        //console.log('onFormSubmit', values);

        const toSave = {
            ID: auditDocument.ID,
            StandardID: values.standardSelect, // id ? auditDocument.StandardID : values.standardSelect,
            DocumentType: documentType,
            Comments: values.commentsInput,
            OtherDescription: values.otherDescriptionInput,
            isWitnessIncluded: !!values.isWitnessIncludedCheck ?? false,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        //console.log(toSave);
        auditDocumentSaveAsync(toSave, values.fileInput);
    };

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link p-0 mb-0"
                title={!!id ? 'Edit document information' : 'Add new document'}
                onClick={onShowModal}
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
                    isAuditDocumentLoading || isAuditDocumentCreating ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>                        
                    ) : !!auditDocument && showModal && 
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
                                                { auditDocumentTypeProps[documentType].label }
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <Row>
                                                <Col xs="8">
                                                    <AryFormikSelectInput
                                                        name="standardSelect"
                                                        label="Standard"
                                                        helpText="Select the standard associated with the document"
                                                    >
                                                        <option value="">(all standards)</option>
                                                        {
                                                            !!audit && !!audit.Standards && audit.Standards.length > 0 && 
                                                            audit.Standards.map(standard => (
                                                                <option 
                                                                    key={standard.StandardID} 
                                                                    value={standard.StandardID}
                                                                    disabled={ standard.Status != DefaultStatusType.active }
                                                                >
                                                                    {standard.StandardName}
                                                                </option>
                                                            ))
                                                        }
                                                    </AryFormikSelectInput>
                                                </Col>
                                                <Col xs="4">
                                                    {/* //! AQUI VOY, HAY QUE MEJORAR COSAS!!! */}
                                                    <div class="d-grid gap-2">
                                                        <label className="form-label">Add another standard</label>
                                                        <button 
                                                            type='button' 
                                                            className="btn bg-gradient-secondary text-white"
                                                        >
                                                            Add another
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs="12">
                                            <AuditDocumentStandardsList />
                                        </Col>
                                        <Col xs="12">
                                            <label className="form-label">Document file</label>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                {
                                                    isNullOrEmpty(auditDocument.Filename) ? (
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
                                                                href={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/Cycles/${auditCycle.ID}/${audit.ID}/${auditDocument.Filename}?v=${getRandomNumber(4)}`}
                                                                target="_blank"
                                                                className="btn btn-link text-dark mb-0 py-2 text-center"
                                                                title="View current file"
                                                            >
                                                                <FontAwesomeIcon icon={faFile} size="xl" />
                                                                <span className=" text-sm ms-2">
                                                                    { auditDocument.Filename }
                                                                </span>
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                                
                                            </div>
                                        </Col>
                                        <Col xs="12">
                                            <AryFormikTextArea
                                                name="commentsInput"
                                                label="Comments"
                                                rows="4"
                                            />
                                        </Col>
                                        {
                                            documentType == AuditDocumentType.other &&
                                            <Col xs="12">
                                                <AryFormikTextInput
                                                    name="otherDescriptionInput"
                                                    label="Description for other document type"
                                                    rows="4"
                                                />
                                            </Col>
                                        }
                                        <Col xs="12" md="6">
                                            <div className="form-check form-switch mb-3">
                                                <input id="isWitnessIncludedCheck" name="isWitnessIncludedCheck"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange={ formik.handleChange }
                                                    checked={ formik.values.isWitnessIncludedCheck }
                                                />
                                                <label 
                                                    className="form-check-label text-secondary mb-0" 
                                                    htmlFor="isWitnessIncludedCheck"
                                                >
                                                    Is witness included in the document
                                                </label>
                                            </div>
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
                                            {
                                                !!auditDocument?.UploadedBy &&
                                                <ListGroup>
                                                    <ListGroup.Item className="border-0 py-0 ps-0 text-xs">
                                                        <strong className="me-2">Uploaded by:</strong>
                                                        { auditDocument.UploadedBy }
                                                    </ListGroup.Item>                                                    
                                                </ListGroup>
                                            }
                                            <AryLastUpdatedInfo item={ auditDocument } />
                                        </div>
                                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isAuditDocumentSaving }
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

export default AuditDocumentEditItem