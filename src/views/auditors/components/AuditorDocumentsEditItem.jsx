import { useEffect, useState } from 'react'
import { faEdit, faFileCirclePlus, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Modal, Row } from 'react-bootstrap';
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { useAuditorDocumentsStore } from '../../../hooks/useAuditorDocumentsStore';
import { ViewLoading } from '../../../components/Loaders';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import getISODate from '../../../helpers/getISODate';
import enums from '../../../helpers/enums';
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import Swal from 'sweetalert2';

const AuditorDocumentsEditItem = ({ catAuditorDocumentID, auditorDocumentID, ...props }) => {
    const NEW_ITEM = 'auditorDocument.new';
    const UPDATE_ITEM = 'auditorDocument.update';

    const { 
        AuditorDocumentType,
        CatAuditorDocumentSubCategoryType,
        DefaultStatusType,
    } = enums();

    const subCategory = [
        { label: '-' },
        { label: 'CIV' },
        { label: 'K' },
        { label: 'L' },
    ];

    const formDefaultValues = {
        startDateInput: '',
        dueDateInput: '',
        observationsInput: '',
        typeSelect: '',
        documentFileInput: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        startDateInput: Yup.date()
            .typeError('Start date has an invalid format')
            .required('Must specify start date'),
        dueDateInput: Yup.date()
            .typeError('Due date has an invalid format')
            .required('Must specify due date')
            .min(Yup.ref('startDateInput'), 'Due date can\'t be before Start date'),
        observationsInput: Yup.string()
            .max(500, 'The observations cannot exceed more than 500 characters'),
        documentFileInput: Yup.mixed()
            .test({
                name: 'is-type-valid',
                message: 'Some file error', // <- este solo es visible si el último return es false
                test: (value, ctx) => {
                    if (!!value) {
                        const extension = value.name.split(/[.]+/).pop(); // value.name.split('.').slice(-1)[0]; // https://stackoverflow.com/questions/651563/getting-the-last-element-of-a-split-string-array
                        const validTypes = ['pdf', 'jpg', 'jpeg', 'png'];
                        if (!validTypes.includes(extension)) {
                            return ctx.createError({
                                message: 'Only files with png, jpg or pdf extensions are allowed'
                            });
                        }
                    }
                    return true;
                }
            }),

    });

    // CUSTOM HOOKS

    const { 
        auditor,
        auditorAsync,
    } = useAuditorsStore();

    const {
        isCatAuditorDocumentLoading,
        catAuditorDocument,
        catAuditorDocumentAsync,
        catAuditorDocumentClear,
    } = useCatAuditorDocumentsStore();

    const {
        isAuditorDocumentLoading,
        isAuditorDocumentCreating,
        auditorDocumentCreatedOk,
        isAuditorDocumentSaving,
        auditorDocumentSavedOk,
        auditorDocument,
        auditorDocumentsErrorMessage,

        auditorDocumentAsync,
        auditorDocumentCreateAsync,
        auditorDocumentSaveAsync,
        auditorDocumentClear,
    } = useAuditorDocumentsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    // const [activeCheck, setActiveCheck] = useState(false);

    useEffect(() => {
        if (!!auditorDocument && showModal) {

            setInitialValues({
                startDateInput: !!auditorDocument?.StartDate ? getISODate(auditorDocument.StartDate) : '',
                dueDateInput: !!auditorDocument?.DueDate ? getISODate(auditorDocument.DueDate) : '',
                observationsInput: auditorDocument?.Observations ?? '',
                typeSelect: auditorDocument?.Type ?? '',
                documentFileInput: '',
                statusCheck: auditorDocument?.Status === DefaultStatusType.active || auditorDocument?.Status == DefaultStatusType.nothing,
            });

            // setActiveCheck(auditorDocument?.Status === DefaultStatusType.active);
        }
    }, [auditorDocument]);

    useEffect(() => {
        if (!!auditorDocumentSavedOk && showModal) {
            Swal.fire('Document', 'Documento updated successfully', 'success');
            auditorDocumentClear();
            catAuditorDocumentClear();
            setShowModal(false);

            auditorAsync(auditor.ID);
        }
    }, [auditorDocumentSavedOk]);

    useEffect(() => {
        if (!!auditorDocumentsErrorMessage && showModal) {
            Swal.fire('Document', auditorDocumentsErrorMessage, 'error');
            onCloseModal();
        }
    }, [auditorDocumentsErrorMessage]);
   
    // METHODS

    const onShowModal = () => {

        setShowModal(true);

        if (!!auditorDocumentID) {
            auditorDocumentAsync(auditorDocumentID);
            setCurrentAction(UPDATE_ITEM);
        } else {
            auditorDocumentCreateAsync({
                AuditorID: auditor.ID,
                CatAuditorDocumentID: catAuditorDocumentID
            });
            setCurrentAction(NEW_ITEM);
        }

        catAuditorDocumentAsync(catAuditorDocumentID);
    }; // onShowModal

    const onCloseModal = () => {

        setShowModal(false);
        catAuditorDocumentClear();
        auditorDocumentClear();
    }; // onCloseModal

    const onAddDocument = () => {
        
        auditorDocumentCreateAsync({
            AuditorID: auditor.ID,
            CatAuditorDocumentID: catAuditorDocumentID
        });
        setCurrentAction(NEW_ITEM);
    }; // onAddDocument

    const onFormSubmit = (values) => {

        // console.log('onFormSubmit', values, activeCheck);
        const toSave = {
            ID: auditorDocument.ID,
            StartDate: values.startDateInput,
            DueDate: values.dueDateInput,
            Observations: values.observationsInput,
            Type: values.typeSelect,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        console.log(toSave, values.documentFileInput);
//! AQUI VOY, HAY QUE PROBAR ESTO Y MOSTRAR el campo Type
        auditorDocumentSaveAsync(toSave, values.documentFileInput);
    }; // onFormSubmit

    return (
        <div { ...props }>
            <button
                className="btn btn-link mb-0 p-0 text-lg"
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={faEdit} className="text-dark" />
            </button>
            <Modal show={ showModal } onHide={ onCloseModal } >
                <Modal.Header>
                    <Modal.Title>
                        { 
                            !!currentAction 
                                ? (currentAction === NEW_ITEM ? 'New document' : 'Edit document') 
                                : 'Loading...'
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    isAuditorDocumentLoading || isAuditorDocumentCreating ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!auditorDocument && catAuditorDocument && showModal && 
                        <Formik
                            initialValues={ initialValues }
                            validationSchema={ validationSchema }
                            enableReinitialize
                            onSubmit={ onFormSubmit }
                        >
                            { formik => (
                                <Form>
                                    <Modal.Body>
                                        <Row>
                                            <Col 
                                                xs={ !!currentAction && currentAction == UPDATE_ITEM ? '8' : '12'} 
                                                sm={ !!currentAction && currentAction == UPDATE_ITEM ? '10' : '12'} 
                                            >
                                                { 
                                                    !isNullOrEmpty(catAuditorDocument.Name) && 
                                                    <h6 className="text-sm text-dark mb-0">
                                                        { catAuditorDocument.SubCategory != CatAuditorDocumentSubCategoryType.nothing ? (
                                                            <span>Sub-Category { subCategory[catAuditorDocument.SubCategory].label } - </span>
                                                        ) : null }
                                                        { catAuditorDocument.Name }
                                                    </h6>
                                                }
                                                {
                                                    !!catAuditorDocument?.Description &&
                                                    <p className="text-xs font-weight-bold mb-0">{ catAuditorDocument.Description }</p>
                                                }
                                            </Col>
                                            {
                                                !!currentAction && currentAction == UPDATE_ITEM &&
                                                <Col xs="4" sm="2" className="text-end">
                                                    <button 
                                                        type="button"
                                                        className="btn btn-link text-lg p-0 mb-0" 
                                                        title="New document" 
                                                        onClick={ onAddDocument }
                                                    >
                                                        <FontAwesomeIcon icon={ faFileCirclePlus } size="lg" />
                                                    </button>
                                                </Col>
                                            }
                                            <Col xs="12">
                                                <hr className="horizontal dark mt-4" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="6">
                                                <AryFormikTextInput
                                                    name="startDateInput"
                                                    type="date"
                                                    label="Start date"
                                                />
                                            </Col>
                                            <Col xs="12" sm="6">
                                                <AryFormikTextInput
                                                    name="dueDateInput"
                                                    type="date"
                                                    label="Due date"
                                                />
                                            </Col>
                                            <Col xs="12">
                                                <AryFormikTextArea
                                                    name="observationsInput"
                                                    label="Observations"
                                                />
                                            </Col>
                                            <Col xs="12">
                                                <AryFormikSelectInput
                                                    name="typeSelect"
                                                    label="Document type"
                                                >
                                                    {
                                                        Object.entries(AuditorDocumentType).map(item => {
                                                            if (item[1] == 0) {
                                                                return <option key={item[1]} value={item[1]}>(select)</option>
                                                            }
                                                            return <option key={item[1]} value={item[1]}>{item[0]}</option>
                                                        })
                                                    }
                                                </AryFormikSelectInput>
                                            </Col>
                                            <Col xs="12" className="mb-3">
                                                <label className="form-label" htmlFor="documentFile">Document file</label>
                                                <input
                                                    id="documentFile"
                                                    type="file"
                                                    name="documentFile"
                                                    accept="image/jpeg,image/png,application/pdf"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        formik.setFieldValue('documentFileInput', e.currentTarget.files[0]);
                                                    }}
                                                />
                                                {
                                                    formik.touched.documentFileInput && formik.errors.photoFileInput &&
                                                    <span className="text-danger text-xs">{formik.errors.photoFileInput}</span>
                                                }
                                            </Col>
                                            <Col xs="12" md="6" xxl="4" className="mb-3">
                                                <div className="form-check form-switch">
                                                    <input id="statusCheck" name="statusCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            const isChecked = e.target.checked;
                                                            formik.setFieldValue('statusCheck', isChecked);
                                                            // setActiveCheck(isChecked);
                                                        }}
                                                        checked={formik.values.statusCheck}
                                                    />
                                                    <label
                                                        className="form-check-label text-secondary mb-0"
                                                        htmlFor="statusCheck"
                                                    >
                                                        Active document
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center w-100">
                                            <div className="text-secondary mb-3 mb-sm-0">
                                                <AryLastUpdatedInfo item={auditor} />
                                            </div>
                                            <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                                <button type="submit"
                                                    className="btn bg-gradient-dark mb-0"
                                                    disabled={isAuditorDocumentSaving}
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

export default AuditorDocumentsEditItem