
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
import { AryFormikTextInput } from '../../components/Forms';
import AryLastUpdatedInfo from '../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CatAuditorDocumentEditView = () => {

    const {
        DefaultStatusType
    } = enums();

    const formDefaultValues = {
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
        isCatAuditorDocumentSaving,catAuditorDocumentSavedOk,
        catAuditorDocument,
        catAuditorDocumentsErrorMessage,

        catAuditorDocumentAsync,
        catAuditorDocumentSaveAsync,
        catAuditorDocumentClear,
    } = useCatAuditorDocumentsStore();

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
                nameInput: catAuditorDocument?.Name ?? '',
                descriptionInput: catAuditorDocument?.Description ?? '',
                documentTypeSelect: '',
                subCategorySelect: '',
                warningEveryInput: '',
                warningPeriodicitySelect: '',
                updateEveryInput: '',
                updatePeriodicitySelect: '',
                isRequiredCheck: false,
                orderInput: '',
                statusCheck: false, 
            });
        }
    }, [catAuditorDocument]);
    
    // METHODS

    const onFormSubmit = (values) => {
        console.log(values);
    };

    const onCancelButton = () => {
        console.log('onCancelButton');
    };

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col xs="8">
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
                                                            <AryFormikTextInput name="nameInput"
                                                                label="Name"
                                                                type="text"
                                                            />
                                                        </Col>
                                                        <Col xs="12">
                                                            <AryFormikTextInput name="descriptionInput"
                                                                label="Description"
                                                                type="text"
                                                            />
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