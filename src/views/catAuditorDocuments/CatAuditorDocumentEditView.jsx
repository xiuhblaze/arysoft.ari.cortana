
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Col, Container, Row } from 'react-bootstrap';
import * as Yup from "yup";

import enums from '../../helpers/enums';
import { useArysoftUIController } from '../../context/context';
import { useCatAuditorDocumentsStore } from '../../hooks/useCatAuditorDocumentsStore';
import { useEffect, useState } from 'react';
import { ViewLoading } from '../../components/Loaders';
import AryDefaultStatusBadge from '../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../components/Forms';
import AryLastUpdatedInfo from '../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import isNullOrEmpty from '../../helpers/isNullOrEmpty';
import { useStandardsStore } from '../../hooks/useStandardsStore';

const CatAuditorDocumentEditView = () => {

    const {
        CatAuditorDocumentType,
        CatAuditorDocumentSubCategoryType,
        CatAuditorDocumentPeriodicityType,
        DefaultStatusType,
        StandardOrderType
    } = enums();

    const formDefaultValues = {
        standardSelect: '',
        nameInput: '',
        descriptionInput: '',
        documentTypeSelect: '',
        subCategorySelect: '',
        warningEveryInput: '',
        warningPeriodicitySelect: '',
        updateEveryInput: '',
        updatePeriodicitySelect: '',
        isRequiredCheck: false,
        orderInput: '',
        statusCheck: false, 
    };
    const validationSchema = Yup.object({
        nameInput: Yup.string()
            .max(50, 'The name cannot exceed more than 50 characters')
            .when('descriptionInput', {
                is: value => !value || value.length === 0,
                then: () => Yup.string().required('At least a name or description is required'),
            }),
        descriptionInput: Yup.string()
            .max(500, 'The description cannot exceed more than 50 characters'),
        documentTypeSelect: Yup.string()
            .required('Must select a document type'),        
        warningEveryInput: Yup.number()
            .typeError('Must be a number')
            .positive('The number must be positive'),
        // warningPeriodicitySelect: '',
        updateEveryInput: Yup.number()
            .typeError('Must be a number')
            .positive('The number must be positive'),
        // updatePeriodicitySelect: '',
        orderInput: Yup.number()
            .typeError('Must be a number')
            .positive('The number must be positive'),
    });

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();

    const {
        isCatAuditorDocumentLoading,
        isCatAuditorDocumentSaving,
        catAuditorDocumentSavedOk,
        catAuditorDocument,
        catAuditorDocumentsErrorMessage,

        catAuditorDocumentAsync,
        catAuditorDocumentSaveAsync,
        catAuditorDocumentClear,
    } = useCatAuditorDocumentsStore();

    const {
        isStandardsLoading,
        standards,
        standardsAsync,
        standardsErrorMessage
    } = useStandardsStore();

    // HOOKS

    const { id } = useParams();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [IsRequired, setIsRequired] = useState(false);

    useEffect(() => {
        if (!!id) catAuditorDocumentAsync(id);
    }, [id]);
    
    useEffect(() => {
        if (!!catAuditorDocument) {

            setInitialValues({
                standardSelect: catAuditorDocument?.StandardID ?? '',
                nameInput: catAuditorDocument?.Name ?? '',
                descriptionInput: catAuditorDocument?.Description ?? '',
                documentTypeSelect: catAuditorDocument?.DocumentType ?? '',
                subCategorySelect: catAuditorDocument?.SubCategory ?? '',
                warningEveryInput: catAuditorDocument?.WarningEvery ?? '',
                warningPeriodicitySelect: catAuditorDocument?.WarningPeriodicity ?? '',
                updateEveryInput: catAuditorDocument?.UpdateEvery ?? '',
                updatePeriodicitySelect: catAuditorDocument?.UpdatePeriodicity ?? '',
                isRequiredCheck: catAuditorDocument?.IsRequired ?? false,
                orderInput: catAuditorDocument?.Order ?? '',
                statusCheck: catAuditorDocument?.Status === DefaultStatusType.active, 
            });

            let title = !isNullOrEmpty(catAuditorDocument.Name) ? catAuditorDocument.Name : '';

            standardsAsync({
                status: DefaultStatusType.active,
                pageSize: 0,
                includeDeleted: false,
                order: StandardOrderType.name,
            });
            
        }
    }, [catAuditorDocument]);

    useEffect(() => {
        if (!!catAuditorDocumentSavedOk) {
            Swal.fire('Auditor document', 'Changes made successfully', 'success');
            catAuditorDocumentClear();
            navigate('/auditors-documents/');
        }
    }, [catAuditorDocumentSavedOk]);
    
    
    // METHODS

    const onFormSubmit = (values) => {
        
        const toSave = {
            ID: catAuditorDocument.ID,
            StandardID: values.standardSelect,
            Name: values.nameInput,
            Description: values.descriptionInput,
            DocumentType: values.documentTypeSelect,
            SubCategory: values.subCategorySelect,
            UpdateEvery: values.updateEveryInput,
            UpdatePeriodicity: values.updatePeriodicitySelect,
            WarningEvery: values.warningEveryInput,
            WarningPeriodicity: values.warningPeriodicitySelect,
            IsRequired: values.isRequiredCheck,
            Order: values.orderInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };
console.log('onFormSubmit', toSave);
        catAuditorDocumentSaveAsync(toSave);
    }; // onFormSubmit

    const onCancelButton = () => {
        catAuditorDocumentClear();
        navigate('/auditors-documents/');
    };

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col xs="12" sm="8" xxl="6">
                    <Card>
                        {
                            isCatAuditorDocumentLoading ? (
                                <Card.Body>
                                    <ViewLoading />
                                </Card.Body>
                            ) : !!catAuditorDocument ? (
                                <>
                                    <Card.Header className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-0">
                                        <Card.Title>Auditor document</Card.Title>
                                        <AryDefaultStatusBadge value={ catAuditorDocument.Status } />
                                    </Card.Header>
                                    <Formik
                                        initialValues={ initialValues }
                                        validationSchema={ validationSchema }
                                        onSubmit={ onFormSubmit }
                                        enableReinitialize
                                    >
                                        { formik => (
                                            <Form>
                                                <Card.Body>
                                                    <Row>
                                                        <Col xs="12">
                                                            <AryFormikSelectInput name="standardSelect"
                                                                label="Standard"
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
                                                            <AryFormikTextInput name="nameInput"
                                                                label="Name"
                                                                type="text"
                                                            />
                                                        </Col>
                                                        <Col xs="12">
                                                            <AryFormikTextArea name="descriptionInput"
                                                                label="Description"
                                                            />
                                                        </Col>
                                                        <Col xs="12" md="4">
                                                            <AryFormikSelectInput name="documentTypeSelect"
                                                                label="Type"
                                                            >
                                                                {
                                                                    Object.keys(CatAuditorDocumentType).map(key =>
                                                                        <option
                                                                            key={key}
                                                                            value={CatAuditorDocumentType[key]}
                                                                            className="text-capitalize"
                                                                        >
                                                                            {key === 'nothing' ? '(select)' : key}
                                                                        </option>
                                                                )}
                                                            </AryFormikSelectInput>
                                                        </Col>
                                                        <Col xs="12" md="4">
                                                            <AryFormikTextInput name="orderInput"
                                                                label="Order"
                                                                type="text"
                                                                helpText="Apparience order relative to Type"
                                                            />
                                                        </Col>
                                                        <Col xs="12" md="4">
                                                            <AryFormikSelectInput name="subCategorySelect"
                                                                label="Sub Category"
                                                            >
                                                                {
                                                                    Object.keys(CatAuditorDocumentSubCategoryType).map(key =>
                                                                        <option
                                                                            key={key}
                                                                            value={CatAuditorDocumentSubCategoryType[key]}
                                                                            className="text-uppercase"
                                                                        >
                                                                            {key === 'nothing' ? '(select)' : key}
                                                                        </option>
                                                                )}
                                                            </AryFormikSelectInput>
                                                        </Col>

                                                        <div className="bg-gray-100 border-radius-md p-3 mb-3">
                                                            <Row>
                                                            <Col xs="4">
                                                                <AryFormikTextInput name="warningEveryInput"
                                                                    label="Warn"
                                                                />
                                                            </Col>
                                                            <Col xs="4">
                                                                <AryFormikSelectInput name="warningPeriodicitySelect"
                                                                    label="Periodicity"
                                                                >
                                                                    {
                                                                        Object.keys(CatAuditorDocumentPeriodicityType).map(key =>
                                                                            <option
                                                                                key={key}
                                                                                value={CatAuditorDocumentPeriodicityType[key]}
                                                                                className="text-capitalize"
                                                                            >
                                                                                {key === 'nothing' ? '(select)' : key}
                                                                            </option>
                                                                    )}
                                                                </AryFormikSelectInput>
                                                            </Col>
                                                            <Col xs="4" className="text-sm font-weight-bold align-self-end mb-4">Before</Col>
                                                            </Row>
                                                        </div>

                                                        <div className="bg-light border-radius-md mb-3">
                                                            <Row>
                                                                <Col xs="4">
                                                                    <AryFormikTextInput name="updateEveryInput"
                                                                        label="Update every"
                                                                    />
                                                                </Col>
                                                                <Col xs="4">
                                                                    <AryFormikSelectInput name="updatePeriodicitySelect"
                                                                        label="Periodicity"
                                                                    >
                                                                        {
                                                                            Object.keys(CatAuditorDocumentPeriodicityType).map(key =>
                                                                            <option
                                                                                key={key}
                                                                                value={CatAuditorDocumentPeriodicityType[key]}
                                                                                className="text-capitalize"
                                                                            >
                                                                                {key === 'nothing' ? '(select)' : key}
                                                                            </option>
                                                                        )}
                                                                    </AryFormikSelectInput>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        <Col xs="12" md="6" xxl="4">
                                                            <div className="form-check form-switch mb-3">
                                                                <input id="isRequiredCheck" name="isRequiredCheck"
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    onChange={ formik.handleChange }
                                                                    checked={ formik.values.isRequiredCheck }
                                                                />
                                                                <label 
                                                                    className="form-check-label text-secondary mb-0" 
                                                                    htmlFor="isRequiredCheck"
                                                                >
                                                                    Is Required
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
                                                </Card.Body>
                                                <Card.Footer className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                                                    <div className="text-secondary mb-3 mb-sm-0">
                                                        <AryLastUpdatedInfo item={catAuditorDocument} />
                                                    </div>
                                                    <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                                                        <button type="submit"
                                                            className="btn bg-gradient-dark mb-0"
                                                            disabled={isCatAuditorDocumentSaving}
                                                        >
                                                            <FontAwesomeIcon icon={faSave} size="lg" className="me-1" />
                                                            Save
                                                        </button>
                                                        <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCancelButton}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </Card.Footer>
                                            </Form>
                                        )}
                                    </Formik>
                                </>
                            ) : null
                        }
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default CatAuditorDocumentEditView