import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import { Col, ListGroup, Modal, Row } from 'react-bootstrap';
import { faEdit, faFile, faLandmark, faPlus, faSave, faSpinner, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Form, Formik } from 'formik';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { useAuditDocumentsStore } from '../../../hooks/useAuditDocumentsStore';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { useEffect, useRef, useState } from 'react';
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
import { set } from 'date-fns';

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
        fileInput: '',
        commentsInput: '',
        otherDescriptionInput: '',
        isWitnessIncludedCheck: false,
        statusCheck: false,
        standardsCountHidden: 0,
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
        commentsInput: Yup.string()
            .max(500, 'Comments must be at most 500 characters'),
        otherDescriptionInput: Yup.string()
            .max(100, 'Other description must be at most 100 characters'),
        standardsCountHidden: Yup.number()
            .min(1, 'Must have at least one standard'),
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

        auditStandardAddAsync,
        auditStandardDelAsync,
    } = useAuditDocumentsStore();

    // HOOKS

    const formikRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);

    const [standardSelect, setStandardSelect] = useState('');
    const [standardsList, setStandardsList] = useState([]);

    useEffect(() => {
        
        //if (!!auditDocument && showModal && !isForUpdateStandard) {
        if (!!auditDocument && showModal) {
            const standardsActiveCount = audit.Standards.filter(i => i.Status == DefaultStatusType.active).length;
            const oneStandardActive = audit.Standards.find(i => i.Status == DefaultStatusType.active && standardsActiveCount == 1);            
            const standard = auditDocument.AuditStandards?.find(i => !!oneStandardActive && i.ID == oneStandardActive.ID); 

            setInitialValues({
                fileInput: '',
                commentsInput: auditDocument?.Comments ?? '',
                otherDescriptionInput: auditDocument?.OtherDescription ?? '',
                isWitnessIncludedCheck: auditDocument?.isWitnessIncluded ?? false,
                statusCheck: auditDocument.Status == DefaultStatusType.active
                    || auditDocument.Status == DefaultStatusType.nothing,
                standardsCountHidden: auditDocument.AuditStandards?.length > 0 
                    ? auditDocument.AuditStandards?.length
                    : (!standard && !!oneStandardActive ? 1 : 0),
            });

            // Cargar lista de standards asociado al auditDocument
            if (auditDocument.AuditStandards != null) {
                setStandardsList(auditDocument.AuditStandards.map(i => ({
                    ID: i.ID,
                    StandardName: i.StandardName,
                })));
            } else {
                setStandardsList([]);
            }

            // setStandardsCount(auditDocument?.AuditStandards?.length ?? 0);
            setStandardSelect(!standard && !!oneStandardActive ? oneStandardActive.ID : '');
        } else if (!!auditDocument && showModal && isForUpdateStandard) {
            // setStandardsCount(auditDocument?.AuditStandards?.length ?? 0);
            formikRef.current.setFieldValue('standardsCountHidden', auditDocument?.AuditStandards?.length ?? 0);
        }
    }, [auditDocument]);
    
    useEffect(() => {
        if (!!auditDocumentSavedOk && showModal) {
            Swal.fire('Document', `Document ${!id ? 'added' : 'updated'} successfully`, 'success');
            auditDocumentsAsync({
                auditID: audit.ID,
                pageSize: 0,
            });
            onCloseModal();
        }
    }, [auditDocumentSavedOk]);
    
    useEffect(() => {
        if (!!auditDocumentsErrorMessage && showModal) {
            Swal.fire('Document', auditDocumentsErrorMessage, 'error');
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

        if (!isAuditDocumentSaving) {
            auditDocumentClear();
            setShowModal(false);
        }
    }; // onCloseModal

    const onFormSubmit = (values) => {

        addStandardSelected(); // por si hay algun standard seleccionado

        const toSave = {
            ID: auditDocument.ID,
            DocumentType: documentType,
            Comments: values.commentsInput,
            OtherDescription: values.otherDescriptionInput,
            isWitnessIncluded: !!values.isWitnessIncludedCheck ?? false,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };
        auditDocumentSaveAsync(toSave, values.fileInput);
    }; // onFormSubmit

    // AUDIT STANDARDS

    const addStandardSelected = () => {

        if (standardSelect == 'all') {
            const tmpStandardsList = [];

            audit.Standards.forEach(auditStandard => {
                const item = standardsList.find(i => i.ID == auditStandard.ID);
                if (!item) { // Si no existe lo agregamos

                    tmpStandardsList.push({ // Estoy confiando en que la asignación va a ser correcta
                        ID: auditStandard.ID,
                        StandardName: auditStandard.StandardName,
                    });

                    auditStandardAddAsync(auditStandard.ID);
                } 
            });

            if (tmpStandardsList.length > 0) {
                setStandardSelect('');
                setStandardsList([
                    ...standardsList,
                    ...tmpStandardsList,
                ].sort((a, b) => a.StandardName.localeCompare(b.StandardName)));
                formikRef.current.setFieldValue('standardsCountHidden', standardsList.length + tmpStandardsList.length);
            }
        } else if (!isNullOrEmpty(standardSelect)) {
            const item = standardsList.find(i => i.ID == standardSelect);

            if (!item) {
                auditStandardAddAsync(standardSelect)
                    .then(data => {
                        if (!!data) {
                            const currentStandard = audit.Standards.find(i => i.ID == standardSelect);
                            setStandardSelect(''); // reiniciar el select
                            setStandardsList([
                                ...standardsList,
                                {
                                    ID: currentStandard.ID,
                                    StandardName: currentStandard.StandardName,
                                }
                            ].sort((a, b) => a.StandardName.localeCompare(b.StandardName)));
                            formikRef.current.setFieldValue('standardsCountHidden', standardsList.length + 1);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
            }
        }
    }; // addStandardSelected

    const delStandard = (auditStandardID) => {

        if (!!auditStandardID) {
            auditStandardDelAsync(auditStandardID)
                .then(data => {
                    if (!!data) {
                        //setIsForUpdateStandard(true); // Para que no actualice los initialValues
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

        // console.log('onStandardSelectChange', formikRef.current.values.standardsCountHidden);
        const standardsCount = formikRef.current.values.standardsCountHidden;

        // Para contar el numero de standards o si al menos esta uno seleccionado
        if (!isNullOrEmpty(e.target.value)) {
            formikRef.current.setFieldValue('standardsCountHidden', standardsCount + 1);
        } else {
            formikRef.current.setFieldValue('standardsCountHidden', standardsCount - 1 < 0 ? 0 : standardsCount - 1);
        }
    }; // onStandardSelectChange

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
                        innerRef={formikRef}
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
                                                    <div className="mb-3">
                                                        <label className="form-label">Standard</label>
                                                        <select 
                                                            className="form-select" 
                                                            value={standardSelect} 
                                                            onChange={onStandardSelectChange}
                                                        >
                                                            <option value="">(select standard)</option>
                                                            {
                                                                !!audit && !!audit.Standards && audit.Standards.length > 0 && 
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
                                                            <option value="all">All</option>
                                                        </select>
                                                    </div>
                                                </Col>
                                                <Col xs="4">
                                                    <div className="d-grid gap-1">
                                                        <label className="form-label">&nbsp;</label>
                                                        <button 
                                                            type='button' 
                                                            className="btn btn-link text-dark"
                                                            onClick={addStandardSelected}
                                                            title="This action will add the selected standard to the list and leave the select field empty to select another standard"
                                                        >
                                                            Add another
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs="12">
                                            <label className="form-label">Standards assigned</label>
                                            { !!auditDocument && !!standardsList && standardsList.length > 0 ? (
                                                <ListGroup className="mb-3">
                                                    {
                                                        standardsList.map(item => 
                                                            <ListGroup.Item key={item.ID} className="border-0 py-1 ps-0 text-xs">
                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                    <span>
                                                                        <FontAwesomeIcon icon={ faLandmark } className="me-2" />
                                                                        {item.StandardName}
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
                                            <Field name="standardsCountHidden" type="hidden" value={ formik.values.standardsCountHidden } />
                                            {
                                                formik.touched.standardsCountHidden && formik.errors.standardsCountHidden &&
                                                <span className="text-danger text-xs">{formik.errors.standardsCountHidden}</span>
                                            }
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
                                                {
                                                    isAuditDocumentSaving 
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

export default AuditDocumentEditItem