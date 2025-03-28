import { addDays, addMonths, addYears } from 'date-fns';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import { faEdit, faFile, faPlus, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Form, Formik } from 'formik';
import { useAuditorDocumentsStore } from '../../../hooks/useAuditorDocumentsStore';
import { useAuditorsStore } from '../../../hooks/useAuditorsStore';
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore';
import { useEffect, useState } from 'react'
import { ViewLoading } from '../../../components/Loaders';
import * as Yup from "yup";
import AryDefaultStatusBadge from '../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import auditorValidityProps from '../helpers/auditorValidityProps';
import catAuditorDocumentPeriodicityProps from '../../catAuditorDocuments/helpers/catAuditorDocumentPeriodicityProps';
import enums from '../../../helpers/enums';
import getISODate from '../../../helpers/getISODate';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import Swal from 'sweetalert2';
import AryFormDebug from '../../../components/Forms/AryFormDebug';

const AuditorDocumentsEditItem = ({ catAuditorDocumentID, auditorDocumentID, ...props }) => {
    const NEW_ITEM = 'auditorDocument.new';
    const UPDATE_ITEM = 'auditorDocument.update';

    const {
        AuditorDocumentType,
        AuditorDocumentValidityType,
        CatAuditorDocumentSubCategoryType,
        CatAuditorDocumentPeriodicityType,
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
                        const extension = value.name.split(/[.]+/).pop()?.toLowerCase() ?? ''; 
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

        if (!catAuditorDocument || catAuditorDocument.ID !== catAuditorDocumentID)
            catAuditorDocumentAsync(catAuditorDocumentID);
    }; // onShowModal

    const onCloseModal = () => {

        setShowModal(false);
        //catAuditorDocumentClear();
        //auditorDocumentClear();
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

        // console.log(toSave, values.documentFileInput);
        auditorDocumentSaveAsync(toSave, values.documentFileInput);
    }; // onFormSubmit

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link mb-0 p-0 text-lg"
                onClick={onShowModal}
                // title={ !!currentAction ? (currentAction === NEW_ITEM ? 'New document' : 'Edit document') : '-'}
                title="Edit or add new document"
            >
                <FontAwesomeIcon icon={faEdit} className="text-dark" />
            </button>
            <Modal show={showModal} onHide={onCloseModal} >
                <Modal.Header>
                    <Modal.Title>
                        {
                            !!auditorDocument &&
                            <FontAwesomeIcon
                                icon={auditorValidityProps[auditorDocument.ValidityStatus].iconFile}
                                size="lg"
                                className={`text-${auditorValidityProps[auditorDocument.ValidityStatus].variant} me-2`}
                            />
                        }
                        {
                            !!currentAction
                                ? (currentAction === NEW_ITEM ? 'New document' : 'Edit document')
                                : 'Loading...'
                        }
                    </Modal.Title>
                    {
                        !!auditorDocument && <AryDefaultStatusBadge value={auditorDocument.Status} />
                    }
                </Modal.Header>
                {
                    isAuditorDocumentLoading || isAuditorDocumentCreating ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!auditorDocument && catAuditorDocument && showModal &&
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
                                        <Col
                                            xs={!!currentAction && currentAction == UPDATE_ITEM ? '6' : '12'}
                                            sm={!!currentAction && currentAction == UPDATE_ITEM ? '8' : '12'}
                                        >
                                            {
                                                !isNullOrEmpty(catAuditorDocument.Name) &&
                                                <h6 className="text-sm text-dark mb-0">
                                                    {!!catAuditorDocument.SubCategory && catAuditorDocument.SubCategory != CatAuditorDocumentSubCategoryType.nothing ? (
                                                        <span>Sub-Category {subCategory[catAuditorDocument.SubCategory].label} - </span>
                                                    ) : null}
                                                    {catAuditorDocument.Name}
                                                </h6>
                                            }
                                            {
                                                !!catAuditorDocument?.Description &&
                                                <p className="text-xs font-weight-bold mb-0">{catAuditorDocument.Description}</p>
                                            }
                                        </Col>
                                        {
                                            !!currentAction && currentAction == UPDATE_ITEM &&
                                            <Col xs="6" sm="4" className="text-end">
                                                <button
                                                    type="button"
                                                    className="btn bg-gradient-dark mb-0"
                                                    title="New document"
                                                    onClick={onAddDocument}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="me-1" />
                                                    Add
                                                </button>
                                            </Col>
                                        }
                                        {
                                            auditorDocument.ValidityStatus != AuditorDocumentValidityType.success &&
                                            <Col xs="12" className="mt-3 mb-0">
                                                <Alert
                                                    variant={auditorValidityProps[auditorDocument.ValidityStatus].variant}
                                                    className="text-white text-xs mb-0"
                                                    closeVariant="white"
                                                    dismissible
                                                >
                                                    <FontAwesomeIcon icon={auditorValidityProps[auditorDocument.ValidityStatus].icon} size="xl" className="me-2" />
                                                    {auditorValidityProps[auditorDocument.ValidityStatus].singularLabel}
                                                </Alert>
                                            </Col>
                                        }
                                    </Row>
                                    <hr className="horizontal dark mt-3" />
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <AryFormikTextInput
                                                name="startDateInput"
                                                type="date"
                                                label="Start date"
                                                onBlur={(e) => {
                                                    formik.handleBlur(e);
                                                    // console.log(e.currentTarget.value);
                                                    // console.log('Sugerir due date si esta vacio');
                                                    // console.log(catAuditorDocument)
                                                    // console.log('Due date actual: ', formik.values.dueDateInput);
                                                    if (isNullOrEmpty(formik.values.dueDateInput) && !!catAuditorDocument.UpdateEvery
                                                        && !!catAuditorDocument.UpdatePeriodicity
                                                        && catAuditorDocument.UpdatePeriodicity != CatAuditorDocumentPeriodicityType.nothing) {
                                                        //console.log('Existen los datos para calcular due date y este está vacio');
                                                        const dueDate = catAuditorDocument.UpdatePeriodicity == CatAuditorDocumentPeriodicityType.days
                                                            ? addDays(new Date(e.currentTarget.value), catAuditorDocument.UpdateEvery)
                                                            : catAuditorDocument.UpdatePeriodicity == CatAuditorDocumentPeriodicityType.months
                                                                ? addMonths(new Date(e.currentTarget.value), catAuditorDocument.UpdateEvery)
                                                                : addYears(new Date(e.currentTarget.value), catAuditorDocument.UpdateEvery)
                                                        // console.log(format(dueDate, 'yyyy-MM-dd'));
                                                        // console.log(getISODate(dueDate)); // .toISOString().split('T')[0]);                                                                
                                                        formik.setFieldValue('dueDateInput', dueDate.toISOString().split('T')[0]);
                                                    }
                                                }}
                                            />
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <AryFormikTextInput
                                                name="dueDateInput"
                                                type="date"
                                                label="Due date"
                                                helpText={!!catAuditorDocument.UpdateEvery
                                                    && !!catAuditorDocument.UpdatePeriodicity
                                                    && catAuditorDocument.UpdatePeriodicity != CatAuditorDocumentPeriodicityType.nothing
                                                    ? `Update every ${catAuditorDocument.UpdateEvery} ${catAuditorDocumentPeriodicityProps[catAuditorDocument.UpdatePeriodicity].label}${catAuditorDocument.UpdateEvery > 1 ? 's' : ''}`
                                                    : 'No period to update established'
                                                }
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
                                            <div className="d-flex justify-content-between align-items-center">
                                                {
                                                    !isNullOrEmpty(auditorDocument.Filename) && (
                                                        <div>
                                                            <a
                                                                href={`/files/auditors/${auditor.ID}/${auditorDocument.Filename}`}
                                                                target="_blank"
                                                                className="btn btn-link text-dark mb-0 text-lg py-2 text-center"
                                                                title="View current file"
                                                            >
                                                                <FontAwesomeIcon icon={faFile} size="lg" />
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                                <div className="w-100">
                                                    <input
                                                        id="documentFile"
                                                        type="file"
                                                        name="documentFileInput"
                                                        accept="image/jpeg,image/png,application/pdf"
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            formik.setFieldValue('documentFileInput', e.currentTarget.files[0]);
                                                        }}
                                                    />
                                                    <div className="text-xs text-secondary mt-1 me-2">If a file exists, the new one will overwrite the current one</div>
                                                    {
                                                        formik.touched.documentFileInput && formik.errors.documentFileInput &&
                                                        <span className="text-danger text-xs">{formik.errors.documentFileInput}</span>
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs="12" md="6" className="mb-3">
                                            <div className="form-check form-switch">
                                                <input id="auditorDocumentStatusCheck" name="statusCheck"
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
                                                    htmlFor="auditorDocumentStatusCheck"
                                                >
                                                    Active document
                                                </label>
                                            </div>
                                        </Col>
                                        {/* <div className="text-xs">
                                            { process.env.NODE_ENV == 'development' && <AryFormDebug formik={ formik } /> }
                                        </div> */}
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