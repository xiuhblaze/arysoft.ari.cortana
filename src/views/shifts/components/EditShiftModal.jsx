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
import { AryFormikTextInput } from '../../../components/Forms';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';


const EditShiftModal = ({ id, ...props }) => {
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

    useEffect(() => {
console.log(shift)

        if (!!shift) {

console.log('setInitialValues')
            setInitialValues({
                ...initialValues,
                // typeSelect: shift?.Type ?? '',
                noEmployeesInput: shift?.NoEmployees ?? '',
                shiftStartInput: shift?.ShiftStart ?? '',
                shiftEndInput: shift?.ShiftEnd ?? '',
                activitiesDescriptionInput: shift?.ActivitiesDescription ?? '',
                // statusCheck: shift?.Status == DefaultStatusType.active,
            });

            // setActiveShift(shift?.Status === DefaultStatusType.active);
            setShowModal(true);
        }
    }, [shift]);
    
    useEffect(() => {
        if(shiftSavedOk) {
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
        console.log(showModal);
    }, [showModal]);
    

    // METHODS

    const onShowModal = () => {

        setShowModal(true);
        
        if (!id) {
            shiftCreateAsync({
                SiteID: site.ID,
            });
        } else {
            shiftAsync(id);
        }
    }; // onShowModal

    const onCloseModal = () => {
        shiftClear();
        setShowModal(false);
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

        console.log(toSave);

        // shiftSaveAsync(toSave);
    }; // onFormSubmit

    return (
        <>
            <Button
                variant="link"
                className="text-dark p-0 mb-0"
                onClick={ onShowModal }
                title={ !!id ? 'Edit shift' : 'Add shift' }
            >
                <FontAwesomeIcon icon={ !!id ? faEdit : faSquarePlus } size="xl" />
            </Button>
            <Modal show={ showModal } onHide={ onCloseModal }>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {
                            !!id 
                                ? ( <><FontAwesomeIcon icon={ faEdit } className="px-3" /> Edit shift</> ) 
                                : ( <><FontAwesomeIcon icon={ faSquarePlus } className="px-3" /> Add shift</> )
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    isShiftCreating || isShiftLoading ? (
                        <ViewLoading />
                    ) : !!shift ? (
                        <Formik
                            initialValues={ initialValues }
                            onSubmit={ onFormSubmit }
                            enableReinitialize
                        >
                            { formik => (
                                <Form>
                                    <Modal.Body>
                                        <Row>
                                            <Col xs="12">
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
                                                        created={ shift.Created }
                                                        updated={ shift.Updated }
                                                        updatedUser={ shift.UpdatedUser }
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
                    ) : (
                        <Modal.Body>
                            <p className="text-sm text-secondary text-center my-5">(register not found)</p>
                        </Modal.Body>
                    )

                }
            </Modal>
        </>
    )
}

export default EditShiftModal