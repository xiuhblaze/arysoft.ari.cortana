import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { setHelpContent, setNavbarTitle, useArysoftUIController } from "../../context/context";
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
import Swal from "sweetalert2";

const ADCConceptEditView = () => {
    const GUID_EMPTY = '00000000-0000-0000-0000-000000000000';
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
            .required('Standard is required')
            .test('required-even-guid-empty', 'Standard is required', function (value) {
                return !!value && value != GUID_EMPTY;
            }),
        indexSortInput: Yup.number()
            .typeError('Index sort must be a number')
            .positive('Index sort must be a positive number'),
        descriptionInput: Yup.string()
            .required('Description is required')
            .max(500, 'Description must be at most 500 characters'),
        increaseInput: Yup.number()
            .typeError('Increase must be a number')
            .test('required-when-unit-selected', 'Increase is required', function (value) {
                const { increaseUnitSelect } = this.parent;
                if (!!increaseUnitSelect && increaseUnitSelect != ADCConceptUnitType.nothing) {
                    return !!value; // new Yup.ValidationError('Increase is required', null, 'increaseInput');
                }
                return true;
            }),
        decreaseInput: Yup.number()
            .typeError('Decrease must be a number')
            .test('required-when-unit-selected', 'Decrease is required', function (value) {
                const { decreaseUnitSelect } = this.parent;                
                if (!!decreaseUnitSelect && decreaseUnitSelect != ADCConceptUnitType.nothing) { 
                    return !!value;
                }
                return true;
            }),
        increaseUnitSelect: Yup.string(),
        decreaseUnitSelect: Yup.string(),
        extraInfoInput: Yup.string()
            .max(500, 'Extra info must be at most 500 characters'),
        statusCheck: Yup.boolean(),
    }).test('at-least-one-unit', null, (values) => {
        const increaseUnitSelected = !!values.increaseUnitSelect && values.increaseUnitSelect != ADCConceptUnitType.nothing;
        const decreaseUnitSelected = !!values.decreaseUnitSelect && values.decreaseUnitSelect != ADCConceptUnitType.nothing;
        if (!increaseUnitSelected && !decreaseUnitSelected) {
            return new Yup.ValidationError('At least one unit must be selected', null, 'increaseUnitSelect');
        }
        return increaseUnitSelected || decreaseUnitSelected;
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
    const [whenTrueActive, setWhenTrueActive] = useState(false);

    useEffect(() => {
        standardsAsync({
            pageSize: 0,
            includeDeleted: false,
            order: StandardOrderType.name,
        });
        setHelpContent(dispatch, null);
    }, []);    

    useEffect(() => {
        if (!!id) adcConceptAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!adcConcept) {
            setInitialValues({
                standardSelect: adcConcept.StandardID ?? GUID_EMPTY,
                indexSortInput: !!adcConcept.IndexSort && adcConcept.IndexSort != 1000 
                    ? adcConcept.IndexSort 
                    : '',
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
            setWhenTrueActive(adcConcept.WhenTrue ?? false);
        }
    }, [adcConcept]);

    useEffect(() => {
            if (adcConceptSavedOk) {
                Swal.fire('ADC Concept', `The changes were made successfully`, 'success');                
                adcConceptClear();
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
                                                                    <option value={GUID_EMPTY}>
                                                                        { isStandardsLoading ? 'Loading...' : '(all standards)' }
                                                                    </option>
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
                                                            <Col xs="2">
                                                                <AryFormikTextInput
                                                                    name="indexSortInput"
                                                                    label="Index sort"
                                                                    type="number"
                                                                />
                                                            </Col>
                                                            <Col xs="10">
                                                                <AryFormikTextInput
                                                                    name="extraInfoInput"
                                                                    label="Extra info"
                                                                    type="text"
                                                                />
                                                            </Col>
                                                            <Col xs="12">
                                                                <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                                                                    <Row>
                                                                        <Col xs="12">
                                                                            <div className="form-check form-switch">
                                                                                <input id="whenTrueCheck" name="whenTrueCheck"
                                                                                    className="form-check-input"
                                                                                    type="checkbox"
                                                                                    onChange={(e) => {
                                                                                        const isChecked = e.target.checked;
                                                                                        formik.setFieldValue('whenTrueCheck', isChecked);
                                                                                        setWhenTrueActive(isChecked);
                                                                                    }}
                                                                                    checked={formik.values.whenTrueCheck}
                                                                                />
                                                                                <label className="form-check-label text-secondary mb-0" htmlFor="includeDeletedCheck">
                                                                                    When the condition is positive: {whenTrueActive 
                                                                                        ? <span className="text-dark font-weight-bold">increase</span>
                                                                                        : <span className="text-dark font-weight-bold">decrease</span>}
                                                                                </label>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs="2">
                                                                            <label className="form-label">&nbsp;</label>
                                                                            <div className="d-flex justify-content-end align-items-center mt-2">
                                                                            { whenTrueActive 
                                                                                ? <div className="badge bg-gradient-success text-white">Yes</div>
                                                                                : <div className="badge bg-gradient-primary text-white">No</div>
                                                                            } 
                                                                            </div>
                                                                        </Col>
                                                                        <Col xs="6">
                                                                            <AryFormikTextInput
                                                                                name="increaseInput"
                                                                                label="Increase"
                                                                                type="number"
                                                                            />
                                                                        </Col>
                                                                        <Col xs="4">
                                                                            <AryFormikSelectInput
                                                                                name="increaseUnitSelect"
                                                                                label="Unit"
                                                                            >
                                                                                { !!ADCConceptUnitType &&  Object.keys(ADCConceptUnitType)
                                                                                    .filter(key => key != 'deleted')
                                                                                    .map(key =>
                                                                                    <option
                                                                                        key={key}
                                                                                        value={ADCConceptUnitType[key]}
                                                                                        className="text-capitalize"
                                                                                    >
                                                                                        {key === 'nothing' ? '(select unit)' : key}
                                                                                    </option>
                                                                                )}
                                                                            </AryFormikSelectInput>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs="2">
                                                                            <label className="form-label">&nbsp;</label>
                                                                            <div className="d-flex justify-content-end align-items-center mt-2">
                                                                                { !whenTrueActive 
                                                                                    ? <div className="badge bg-gradient-success text-white">Yes</div>
                                                                                    : <div className="badge bg-gradient-primary text-white">No</div>
                                                                                }
                                                                            </div>
                                                                        </Col>
                                                                        <Col xs="6">
                                                                            <AryFormikTextInput
                                                                                name="decreaseInput"
                                                                                label="Decrease"
                                                                                type="number"
                                                                            />
                                                                        </Col>
                                                                        <Col xs="4">
                                                                            <AryFormikSelectInput
                                                                                name="decreaseUnitSelect"
                                                                                label="Unit"
                                                                            >
                                                                                { !!ADCConceptUnitType &&  Object.keys(ADCConceptUnitType)
                                                                                    .filter(key => key != 'deleted')
                                                                                    .map(key =>
                                                                                    <option
                                                                                        key={key}
                                                                                        value={ADCConceptUnitType[key]}
                                                                                        className="text-capitalize"
                                                                                    >
                                                                                        {key === 'nothing' ? '(select unit)' : key}
                                                                                    </option>
                                                                                )}
                                                                            </AryFormikSelectInput>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Col>
                                                            <Col xs="12" sm="6">
                                                                <div className="form-check form-switch mb-3">
                                                                    <input id="statusCheck" name="statusCheck"
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        onChange={formik.handleChange}
                                                                        checked={formik.values.statusCheck}
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
                                                    </Col>
                                                    <Col xs="12" sm="4">
                                                        <h6>Index sort</h6>
                                                        <p className="text-secondary text-sm">
                                                            The index sort is used to sort the ADC concepts in the list
                                                            when the ADC concepts are displayed in the ADC form.<br />
                                                            <strong>Note:</strong> The index sort re-order when others 
                                                            ADC concepts at the same standard are modified.
                                                        </p>
                                                        
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