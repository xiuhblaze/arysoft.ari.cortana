import { useEffect, useRef, useState } from 'react'
import enums from '../../../helpers/enums'
import { useShiftsStore } from '../../../hooks/useShiftsStore';
import { useSitesStore } from '../../../hooks/useSiteStore';
import Swal from 'sweetalert2';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { ViewLoading } from '../../../components/Loaders';
import { Form, Formik } from 'formik';
import { AryFormikSelectInput, AryFormikTextArea, AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import * as Yup from 'yup';
import envVariables from '../../../helpers/envVariables';

const EditShiftModal = ({ id, ...props }) => {
    // const NEW_ITEM = 'shift.new';
    // const UPDATE_ITEM = 'shift.update';
    const {
        DefaultStatusType,
        ShiftOrderType,
        ShiftType,
    } = enums();
    const {
        HOUR24_REGEX
    } = envVariables();

    const formDefaultValues = {
        typeSelect: ShiftType.nothing,
        noEmployeesInput: '',
        activitiesDescriptionInput: '',
        shiftStartInput: '',
        shiftEndInput: '',
        shiftStart2Input: '',
        shiftEnd2Input: '',
        extraInfoInput: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        typeSelect: Yup.string()
            .required('Must select a shift type'),
        noEmployeesInput: Yup.number()
            .typeError('Must be a number')
            .min(0, 'Must be zero or greater')
            .required('Must specify the number of employees'),
        activitiesDescriptionInput: Yup.string()
            .max(500, 'The description cannot exceed more than 500 characters'),
        shiftStartInput: Yup.string()
            .matches(HOUR24_REGEX, 'Must be a valid time')
            .required('Must specify the start time'),
        shiftEndInput: Yup.string()
            .matches(HOUR24_REGEX, 'Must be a valid time')
            .required('Must specify the end time'),
        shiftStart2Input: Yup.string()
            .matches(HOUR24_REGEX, 'Must be a valid time'),
        shiftEnd2Input: Yup.string()
            .matches(HOUR24_REGEX, 'Must be a valid time'),
        extraInfoInput: Yup.string()
            .max(1000, 'The additional information cannot exceed more than 1000 characters'),
    });

    // CUSTOM HOOKS

    const {
        site
    } = useSitesStore();

    const {
        isShiftLoading,
        isShiftCreating,
        isShiftSaving,
        shiftSavedOk,
        shift,
        shiftsErrorMessage,
        shiftAsync,
        shiftsAsync,
        shiftCreateAsync,
        shiftSaveAsync,
        shiftClear
    } = useShiftsStore();

    // HOOKS

    const secondShiftRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    // const [activeShift, setActiveShift] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [showSecondShift, setShowSecondShift] = useState(false);

    useEffect(() => {
        if (!!shift && showModal) {
            setInitialValues({
                typeSelect: shift?.Type ?? ShiftType.nothing,
                noEmployeesInput: shift?.NoEmployees ?? '',
                activitiesDescriptionInput: shift?.ActivitiesDescription ?? '',
                shiftStartInput: shift?.ShiftStart ? shift?.ShiftStart.slice(0, 5) : '',
                shiftEndInput: shift?.ShiftEnd ? shift?.ShiftEnd.slice(0, 5) : '',
                shiftStart2Input: shift?.ShiftStart2 ? shift?.ShiftStart2.slice(0, 5) : '',
                shiftEnd2Input: shift?.ShiftEnd2 ? shift?.ShiftEnd2.slice(0, 5) : '',
                extraInfoInput: shift?.ExtraInfo ?? '',
                statusCheck: shift.Status == DefaultStatusType.active
                    || shift.Status == DefaultStatusType.nothing,
            });

            setShowSecondShift(shift.ShiftStart2 && shift.ShiftEnd2);
            //setActiveShift(shift?.Status === DefaultStatusType.active);
        }
    }, [shift]);
    
    useEffect(() => {
        if(shiftSavedOk && showModal) {
            Swal.fire('Shift', `Shift ${ !id ? 'created' : 'updated' } successfully`, 'success');
            shiftsAsync({
                siteID: site.ID,
                pageSize: 0,
                order: ShiftOrderType.type,
            })
            shiftClear();
            setShowModal(false);
        }
    }, [shiftSavedOk]);

    useEffect(() => { 
        if (!!shiftsErrorMessage && showModal) {
            Swal.fire('Shifts', shiftsErrorMessage, 'error');
            setShowModal(false);
        }
    }, [shiftsErrorMessage]);

    // METHODS

    const onShowModal = () => {
        setShowModal(true);
        
        if (!!id) {
            //setCurrentAction(UPDATE_ITEM);
            shiftAsync(id);
        } else {
            shiftCreateAsync({
                SiteID: site.ID,
            });
            //setCurrentAction(NEW_ITEM);
        }
    }; // onShowModal

    const onCloseModal = () => {
        // shiftClear();
        setShowModal(false);
        //setCurrentAction(null);
        setShowSecondShift(false);
    }; // onCloseModal

    const onFormSubmit = (values) => {
        const toSave = {
            ID: shift.ID,
            Type: values.typeSelect,
            NoEmployees: values.noEmployeesInput,
            ActivitiesDescription: values.activitiesDescriptionInput,
            ShiftStart: values.shiftStartInput,
            ShiftEnd: values.shiftEndInput,
            ShiftStart2: values.shiftStart2Input,
            ShiftEnd2: values.shiftEnd2Input,
            ExtraInfo: values.extraInfoInput,
            Status: values.statusCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
        };

        // console.log(toSave);

        shiftSaveAsync(toSave);
    }; // onFormSubmit

    return (
        <div {...props}>
            <Button
                variant="link"
                className="text-dark p-0 mb-0"
                onClick={ onShowModal }
                title={ !!id ? 'Edit shift' : 'Add shift' }                
            >
                <FontAwesomeIcon icon={ !!id ? faEdit : faSquarePlus } size="xl" />
            </Button>
            <Modal show={ showModal } onHide={ onCloseModal }>
                <Modal.Header>
                    <Modal.Title>
                        {
                            !!shift && showModal && <>
                                <FontAwesomeIcon 
                                    icon={ !!id ? faEdit : faSquarePlus }
                                    size="lg"
                                    className="px-3"
                                />
                                { !!id ? 'Edit shift' : 'Add shift' }
                            </>
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    (isShiftCreating || isShiftLoading) && showModal ? (
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                    ) : !!shift && showModal &&
                    <Formik
                        initialValues={ initialValues }
                        validationSchema={ validationSchema }
                        onSubmit={ onFormSubmit }
                        enableReinitialize
                    >
                        { formik => (
                            <Form>
                                <Modal.Body>
                                    <Row>
                                        <Col xs="12" sm="6">
                                            <AryFormikSelectInput name="typeSelect"
                                                label="Shift"
                                            >
                                                {
                                                    Object.keys(ShiftType).map(key =>
                                                        <option
                                                            key={key}
                                                            value={ShiftType[key]}
                                                            className="text-capitalize"
                                                        >
                                                            {key === 'nothing' ? '(select type)' : key}
                                                        </option>
                                                    )
                                                }
                                            </AryFormikSelectInput>
                                        </Col>
                                        <Col xs="12" sm="6">
                                            <AryFormikTextInput name="noEmployeesInput"
                                                type="text"
                                                label="Employees"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikTextArea name="activitiesDescriptionInput"
                                                label="Activities"
                                                rows="3"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="6">
                                            <AryFormikTextInput name="shiftStartInput"
                                                label="From"
                                                placeholder="hh:mm"
                                            />
                                        </Col>
                                        <Col xs="6">
                                            <AryFormikTextInput name="shiftEndInput"
                                                label="To"
                                                placeholder="hh:mm"
                                            />
                                        </Col>
                                    </Row>
                                    <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                                        <Row>
                                            <Col xs="12">
                                                <div className="form-check form-switch">
                                                    <input id="showSecondShiftCheck"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={ (e) => {
                                                            const isChecked = e.target.checked;
                                                            setShowSecondShift(isChecked);
                                                        }}
                                                        checked={ showSecondShift }
                                                    />
                                                    <label 
                                                        className="form-check-label text-xs"
                                                        htmlFor="showSecondShiftCheck"
                                                    >
                                                        If have a rest period, specify the start and end time of the second part of the schedule.   
                                                    </label>

                                                </div>
                                            </Col>
                                        </Row>                                    
                                        <Row 
                                            ref={ secondShiftRef }
                                            style={{
                                                maxHeight: showSecondShift
                                                    ? `${secondShiftRef?.current?.scrollHeight ?? 0}px`
                                                    : '0px',
                                                overflow: 'hidden',
                                                transition: 'max-height 0.5s ease-in-out',
                                            }}
                                        >
                                            <Col xs="6">
                                                <AryFormikTextInput name="shiftStart2Input"
                                                    label="Then from"
                                                    placeholder="hh:mm"
                                                />
                                            </Col>
                                            <Col xs="6">
                                                <AryFormikTextInput name="shiftEnd2Input"
                                                    label="To"
                                                    placeholder="hh:mm"
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikTextArea name="extraInfoInput"
                                                label="Aditional information"
                                                rows="3"
                                                placeholder="Specify things like days of the week or some important information."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="4">
                                            <div className="form-check form-switch">
                                                <input id="statusCheck" name="statusCheck"
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange= { (e) => {
                                                        const isChecked = e.target.checked;
                                                        formik.setFieldValue('statusCheck', isChecked);
                                                        //setActiveShift(isChecked);
                                                    }} 
                                                    checked={ formik.values.statusCheck }
                                                />
                                                <label 
                                                    className="form-check-label text-secondary mb-0"
                                                    htmlFor="statusCheck"
                                                >
                                                    Active shift
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <div className="text-secondary">
                                            <AryLastUpdatedInfo item={ shift } />
                                        </div>
                                        <div className="d-flex justify-content-end gap-2">
                                            <button type="submit"
                                                className="btn bg-gradient-dark mb-0"
                                                disabled={ isShiftSaving }
                                            >
                                                <FontAwesomeIcon icon={ faSave } className="me-1" size="lg" />
                                                Save
                                            </button>
                                            <button type="button" 
                                                className="btn btn-link text-secondary mb-0" 
                                                onClick={onCloseModal}
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

export default EditShiftModal