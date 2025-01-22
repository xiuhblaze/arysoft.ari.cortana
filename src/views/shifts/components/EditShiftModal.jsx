import { useEffect, useState } from 'react'
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


const EditShiftModal = ({ id, ...props }) => {
    const NEW_ITEM = 'shift.new';
    const UPDATE_ITEM = 'shift.update';
    const {
        DefaultStatusType,
        ShiftOrderType,
        ShiftType,
    } = enums();

    const formDefaultValues = {
        typeSelect: '',
        noEmployeesInput: '',
        shiftStartInput: '',
        shiftEndInput: '',
        activitiesDescriptionInput: '',
        statusCheck: false,
    };

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

    const [showModal, setShowModal] = useState(false);
    const [initialValues, setInitialValues] = useState(formDefaultValues);
    const [activeShift, setActiveShift] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);

    useEffect(() => {
        if (!!shift && showModal) {
            setInitialValues({
                typeSelect: shift?.Type ?? '',
                noEmployeesInput: shift?.NoEmployees ?? '',
                shiftStartInput: shift?.ShiftStart ?? '',
                shiftEndInput: shift?.ShiftEnd ?? '',
                activitiesDescriptionInput: shift?.ActivitiesDescription ?? '',
                statusCheck: shift?.Status === DefaultStatusType.active,
            });

            setActiveShift(shift?.Status === DefaultStatusType.active);
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
            setCurrentAction(UPDATE_ITEM);
            shiftAsync(id);
        } else {
            shiftCreateAsync({
                SiteID: site.ID,
            });
            setCurrentAction(NEW_ITEM);
        }
    }; // onShowModal

    const onCloseModal = () => {
        // shiftClear();
        setShowModal(false);
        setCurrentAction(null);
    }; // onCloseModal

    const onFormSubmit = (values) => {
        const toSave = {
            ID: shift.ID,
            Type: values.typeSelect,
            NoEmployees: values.noEmployeesInput,
            ShiftStart: values.shiftStartInput,
            ShiftEnd: values.shiftEndInput,
            ActivitiesDescription: values.activitiesDescriptionInput,
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
                                    icon={ currentAction === UPDATE_ITEM ? faEdit : faSquarePlus }
                                    size="lg"
                                    className="px-3"
                                />
                                { currentAction === UPDATE_ITEM ? 'Edit shift' : 'Add shift' }
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
                                        <Col xs="6">
                                            <AryFormikTextInput name="shiftStartInput"
                                                label="Start"
                                            />
                                        </Col>
                                        <Col xs="6">
                                            <AryFormikTextInput name="shiftEndInput"
                                                label="End"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <AryFormikTextArea name="activitiesDescriptionInput"
                                                label="Activities"
                                                rows="4"
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
                                                        setActiveShift(isChecked);
                                                    }} 
                                                    checked={ formik.values.statusCheck }
                                                />
                                                <label 
                                                    className="form-check-label text-secondary mb-0"
                                                    htmlFor="statusCheck"
                                                >
                                                    { 
                                                        activeShift ? 'Active shift' : 'Inactive shift'
                                                    }
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <div className="text-secondary">
                                            {
                                                !!shift && 
                                                <AryLastUpdatedInfo
                                                    item={ shift }
                                                />
                                            }
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