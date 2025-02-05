import * as Yup from 'yup';
import { Card, Col, Row } from "react-bootstrap";
import { useStandardsStore } from '../../../hooks/useStandardsStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import enums from '../../../helpers/enums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { Form, Formik } from 'formik';
import { AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import Swal from 'sweetalert2';

const StandardEditCard = ({ ...props }) => {
    const { DefaultStatusType } = enums();
    const formDefaultValues = {
        nameInput: '',
        descriptionInput: '',
        maxReductionDaysInput: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        nameInput: Yup.string()
            .required('Name is required')
            .max(100, 'Name must be at most 100 characters'),
        descriptionInput: Yup.string()
            .max(250, 'Description must be at most 250 characters'),
        maxReductionDaysInput: Yup.number()
            .typeError('Must be a number')
            .min(0, 'The value must be positive or zero')
            .lessThan(20, 'The number exceeds the maximum allowed value (20 days)'),
    });
    
    // CUSTOM HOOKS

    const {
        isStandardSaving,
        standardSavedOk,
        standard,
        standardSaveAsync,
        standardClear,
    } = useStandardsStore();

    // HOOKS

    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        if (!!standard) {
            setInitialValues({
                nameInput: standard?.Name ?? '',
                descriptionInput: standard?.Description ?? '',
                maxReductionDaysInput: standard?.MaxReductionDays ?? '',
                statusCheck: standard?.Status 
                    ? standard.Status == DefaultStatusType.active 
                    : false,
            });
        }
    }, [standard]);
    
    useEffect(() => {
        if (!!standardSavedOk) {
            Swal.fire('Standards', 'Changes made successfully', 'success');
            standardClear();
            navigate('/standards/');
        }
    }, [standardSavedOk]);
    

    // METHODS

    const onFormSubmit = (values) => {
        const toSave = {
            ID: standard.ID,
            Name: values.nameInput,
            Description: values.descriptionInput,
            MaxReductionDays: Number(values.maxReductionDaysInput),
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        standardSaveAsync(toSave);
    };

    const onCancelButton = () => {
        standardClear();
        navigate('/standards/');
    };

    return (
        <Card {...props}>
            <Card.Header className="pb-0">
                <Card.Title>
                    <FontAwesomeIcon icon={faEdit} size="lg" className="text-dark me-2" />
                    Edit standard
                </Card.Title>
            </Card.Header>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onFormSubmit}
            >
                {formik => (
                    <Form>
                        <Card.Body className="py-0">
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
                                <Col xs="12">
                                    <AryFormikTextInput name="maxReductionDaysInput"
                                        label="Max reduction days"
                                        type="text"
                                    />
                                </Col>
                                <Col xs="12">
                                    <div className="form-check form-switch mb-0">
                                        <input id="statusCheck" name="statusCheck"
                                            className="form-check-input"
                                            type="checkbox"
                                            onChange={formik.handleChange}
                                            checked={formik.values.statusCheck}
                                        />
                                        <label className="form-check-label" htmlFor="statusCheck">Is active</label>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                                <div className="text-secondary">
                                    <AryLastUpdatedInfo item={standard} />
                                </div>
                                <div className="d-flex justify-content-center justify-content-sm-between gap-2">
                                    <button type="submit"
                                        className="btn bg-gradient-dark mb-0"
                                        disabled={isStandardSaving}
                                    >
                                        <FontAwesomeIcon icon={faSave} className="me-1" size="lg" />
                                        Save
                                    </button>
                                    <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCancelButton}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Card.Footer>
                    </Form>
                )}
            </Formik>
        </Card>
    )
}

export default StandardEditCard