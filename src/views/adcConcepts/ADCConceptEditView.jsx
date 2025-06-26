import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import { Card, Col, Container, Row } from "react-bootstrap";
import * as Yup from "yup";

import enums from "../../helpers/enums";
import { useADCConceptsStore } from "../../hooks/useADCConceptsStore";
import { ViewLoading } from "../../components/Loaders";
import { Form, Formik } from "formik";
import AryDefaultStatusBadge from "../../components/AryDefaultStatusBadge/AryDefaultStatusBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece, faSave } from "@fortawesome/free-solid-svg-icons";
import AryLastUpdatedInfo from "../../components/AryLastUpdatedInfo/AryLastUpdatedInfo";
import { AryFormikSelectInput, AryFormikTextInput } from "../../components/Forms";
import { useStandardsStore } from "../../hooks/useStandardsStore";

const ADCConceptEditView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [controller, dispatch] = useArysoftUIController();
    const {
        ADCConceptUnitType,
        DefaultStatusType,
        StandardOrderType,
    } = enums();
    const formDefaultValues = {
        standardSelect: '',
        indexSortInput: '',
        descriptionInput: '',
        whenTrueCheck: false,
        increaseInput: '',
        decreaseInput: '',
        increaseUnitSelect: '',
        decreaseUnitSelect: '',
        extraInfoInput: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        standardSelect: Yup.string()
            .required('Standard is required'),
        indexSortInput: Yup.number()
            .typeError('Index sort must be a number')
            .positive('Index sort must be a positive number'),
        descriptionInput: Yup.string()
            .max(500, 'Description must be at most 500 characters'),
        increaseInput: Yup.number()
            .typeError('Increase must be a number')
            .when('increaseUnitSelect', {
                is: ADCConceptUnitType.percentage,
                then: schema => schema.min(0, 'Percentage increase must be a positive number')
                    .max(100, 'Percentage increase must be a number between 0 and 100'),
                otherwise: schema => schema.min(0, 'Increase must be a positive number'),
            }),
        decreaseInput: Yup.number()
            .typeError('Decrease must be a number')
            .when('decreaseUnitSelect', {
                is: ADCConceptUnitType.percentage,
                then: schema => schema.min(0, 'Percentage decrease must be a positive number')
                    .max(100, 'Percentage decrease must be a number between 0 and 100'),
                otherwise: schema => schema.min(0, 'Decrease must be a positive number'),
            }),
        increaseUnitSelect: Yup.string()
            .required('Increase unit is required'),
        decreaseUnitSelect: Yup.string()
            .required('Decrease unit is required'),
        extraInfoInput: Yup.string()
            .max(500, 'Extra info must be at most 500 characters'),
        statusCheck: Yup.boolean(),
    });

    // CUSTOM HOOKS

    const {
        isADCConceptLoading,
        isADCConceptSaving,
        adcConceptSavedOk,
        adcConcept,
        adcConceptsErrorMessage,

        adcConceptAsync,
        adcConceptSaveAsync,
        adcConceptClear,
    } = useADCConceptsStore();

    const {
        isStandardsLoading,
        standards,
        standardsAsync
    } = useStandardsStore();

    // HOOKS

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        standardsAsync({
            pageSize: 0,
            includeDeleted: false,
            order: StandardOrderType.name,
        });
    }, []);
    

    useEffect(() => {
        if (!!id) adcConceptAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!adcConcept) {
            setInitialValues({
                standardSelect: adcConcept.StandardID ?? '',
                indexSortInput: adcConcept.IndexSort ?? 0,
                descriptionInput: adcConcept.Description ?? '',
                whenTrueCheck: adcConcept.WhenTrue ?? false,
                increaseInput: adcConcept.Increase ?? '',
                decreaseInput: adcConcept.Decrease ?? '',
                increaseUnitSelect: adcConcept.IncreaseUnit ?? '',
                decreaseUnitSelect: adcConcept.DecreaseUnit ?? '',
                extraInfoInput: adcConcept.ExtraInfo ?? '',
                statusCheck: adcConcept.Status == DefaultStatusType.active
                    || adcConcept.Status == DefaultStatusType.nothing,
            });

            setNavbarTitle(dispatch, adcConcept.Description);
        }
    }, [adcConcept]);

    useEffect(() => {
            if (adcConceptSavedOk) {
                Swal.fire('ADC Concept', `The changes were made successfully`, 'success');
                userClear();
                navigate('/adc-concepts/');
            }
        }, [adcConceptSavedOk]);

    useEffect(() => {
        if (!!adcConceptsErrorMessage) {
            Swal.fire('ADC Concepts', adcConceptsErrorMessage, 'error');
        }
    }, [adcConceptsErrorMessage]);

    // METHODS

    const onFormSubmit = (values) => {
        const toSave = {
            ID: adcConcept.ID,
            StandardID: values.standardSelect,
            IndexSort: values.indexSortInput,
            Description: values.descriptionInput,
            WhenTrue: values.whenTrueCheck,
            Increase: values.increaseInput,
            Decrease: values.decreaseInput,
            IncreaseUnit: values.increaseUnitSelect,
            DecreaseUnit: values.decreaseUnitSelect,
            ExtraInfo: values.extraInfoInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        adcConceptSaveAsync(toSave);
    }; // onFormSubmit

    const onCancelButton = () => {
        adcConceptClear();
        navigate('/adc-concepts/');
    };
        
    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col xs="12" xxl="8">
                    <Card>
                        {
                            isADCConceptLoading ? (
                                <ViewLoading />
                            ) : !!adcConcept ? (
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={onFormSubmit}
                                    enableReinitialize
                                >
                                    { formik => (
                                        <Form>
                                            <Card.Header className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-0">
                                                <h6>                                                
                                                    <FontAwesomeIcon icon={ faPuzzlePiece } className="me-2" />
                                                    ADC Concept
                                                </h6>
                                                <div>
                                                    <AryDefaultStatusBadge value={adcConcept.Status} />
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col xs="12" sm="8">
                                                        <Row>
                                                            <Col xs="12">
                                                                <AryFormikSelectInput
                                                                    name="standardSelect"
                                                                    label="Standard"
                                                                    onChange={ (e) => {
                                                                        const selectedValue = e.target.value;
                                                                        formik.setFieldValue('standardSelect', selectedValue);
                                                                    }}
                                                                    disabled={ adcConcept.Status >= DefaultStatusType.active }
                                                                >
                                                                    <option value="">(all standards)</option>
                                                                    {
                                                                        !!standards && standards.length > 0 && standards.map(item =>
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
                                                                <AryFormikTextInput
                                                                    name="descriptionInput"
                                                                    label="Description"
                                                                    type="text"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                            <Card.Footer>
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <div className="text-secondary">
                                                        <AryLastUpdatedInfo item={adcConcept} /> 
                                                    </div>
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button type="submit" 
                                                            className="btn bg-gradient-dark mb-0"
                                                            disabled={isADCConceptSaving}
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
                            ) : null
                        }
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ADCConceptEditView