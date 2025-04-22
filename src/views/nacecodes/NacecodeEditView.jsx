import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';

import { Card, Col, Container, Row } from 'react-bootstrap';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import * as Yup from "yup";

import { AryFormikSelectInput, AryFormikTextInput } from '../../components/Forms';
import { setNavbarTitle, useArysoftUIController } from '../../context/context';
import { ViewLoading } from '../../components/Loaders';
import enums from '../../helpers/enums';
import Status from './components/Status';
import useNacecodesStore from '../../hooks/useNaceCodesStore';
import AryLastUpdatedInfo from '../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import nacecodeAccreditedStatusProps from './helpers/nacecodeAccreditedStatusProps';
import getISODate from '../../helpers/getISODate';

export const NacecodeEditView = () => {
    const { id } = useParams();
    const [controller, dispatch] = useArysoftUIController();
    const navigate = useNavigate();
    const { 
        DefaultStatusType,
        NaceCodeAccreditedType
    } = enums();

    const formDefaultValues = {
        sectorInput: '',
        divisionInput: '',
        groupInput: '',
        classInput: '',
        descriptionInput: '',
        accreditedStatusSelect: '',
        accreditationInfoInput: '',
        accreditationDateInput: '',
        statusCheck: false,
    };
    const validationSchema = Yup.object({
        sectorInput: Yup.number()
            .typeError('The sector must be a number')
            .positive('The sector must be a positive number')
            .integer('The sector must be an integer number')
            .min(0, 'The sector must be greater than 0')
            .max(99, 'The sector must be less than 99')
            .required('The sector is required'),
        divisionInput: Yup.number()
            .typeError('The division must be a number')
            .positive('The division must be a positive number')
            .integer('The division must be an integer number')
            .min(0, 'The division must be greater than 0')
            .max(99, 'The division must be less than 99'),
        groupInput: Yup.number()
            .typeError('The group must be a number')
            .positive('The group must be a positive number')
            .integer('The group must be an integer number')
            .min(0, 'The group must be greater than 0')
            .max(99, 'The group must be less than 99')
            .test(
                'division-is-required',
                'The division is required',
                function(value) {
                    return !(!!value && !this.parent.divisionInput);
                }
            ),
        classInput: Yup.number()
            .typeError('The class must be a number')
            .positive('The class must be a positive number')
            .integer('The class must be an integer number')
            .min(0, 'The class must be greater than 0')
            .max(99, 'The class must be less than 99')
            .test(
                'group-is-required',
                'The group is required',
                function(value) {
                    return !(!!value && !this.parent.groupInput);
                }
            )   ,
        descriptionInput: Yup.string()
            .required('Description is required'),
        accreditationInfoInput: Yup.string()
            .max(500, 'The accreditation info must be less than 500 characters'),

        // accreditedStatusSelect: Yup.string()
        //     .required('Accredited status is required'),
    });

    // CUSTOM HOOKS

    const {
        isNacecodeLoading,
        isNacecodeSaving,
        nacecodeSavedOk,
        isNacecodeDeleting,
        nacecodeDeletedOk,
        nacecode,
        nacecodeErrorMessage,

        nacecodeAsync,
        nacecodeSaveAsync,
        nacecodeDeleteAsync,
        nacecodeClear,
    } = useNacecodesStore();

    // HOOKS

    const [initialValues, setInitialValues] = useState(formDefaultValues);

    useEffect(() => {
        if (!!id) nacecodeAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!nacecode) {
            setInitialValues({
                sectorInput: nacecode.Sector ?? '',
                divisionInput: nacecode.Division ?? '',
                groupInput: nacecode.Group ?? '',
                classInput: nacecode.Class ?? '',
                descriptionInput: nacecode.Description ?? '',
                accreditedStatusSelect: !!nacecode.AccreditedStatus && nacecode.AccreditedStatus != NaceCodeAccreditedType.nothing
                    ? nacecode.AccreditedStatus
                    : '', //NaceCodeAccreditedType.nothing,
                accreditationInfoInput: nacecode.AccreditationInfo ?? '',
                accreditationDateInput: !!nacecode.AccreditationDate ? getISODate(nacecode.AccreditationDate) :'',
                statusCheck: nacecode.Status == DefaultStatusType.active 
                    || nacecode.Status == DefaultStatusType.nothing,
            });

            setNavbarTitle(dispatch, nacecode.Description);
        }
    }, [nacecode]);

    useEffect(() => {
        if (nacecodeSavedOk) {
            Swal.fire('NACE Codes', 'The changes were made successfully', 'success');
            nacecodeClear();
            navigate('/nace-codes/');
        }
    }, [nacecodeSavedOk]);

    useEffect(() => {
        if (nacecodeDeletedOk) {
            Swal.fire('NACE Codes', 'Record deleted successfully', 'success');
            nacecodeClear();
            navigate('/nace-codes/');
        }
    }, [nacecodeDeletedOk]);

    useEffect(() => {
        if (!!nacecodeErrorMessage) {
            Swal.fire('NACE Codes', nacecodeErrorMessage, 'error');
        }
    }, [nacecodeErrorMessage]);

    const onFormSubmit = (values) => {
        // console.log(values);

        const itemToSave = {
            ID: nacecode.ID,
            Sector: values.sectorInput,
            Division: values.divisionInput,
            Group: values.groupInput,
            Class: values.classInput,
            Description: values.descriptionInput,
            AccreditedStatus: values.accreditedStatusSelect,
            AccreditationInfo: values.accreditationInfoInput,
            Status: values.statusCheck 
                ? DefaultStatusType.active
                : DefaultStatusType.inactive,
        };

        nacecodeSaveAsync(itemToSave);
    };

    const onCancelButton = () => {
        nacecodeClear();
        navigate('/nace-codes/');
    };

    const onDeleteButton = () => {

        Swal.fire({
            title: 'NACE Codes',
            text: 'This action will remove the registry. Do you wish to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then(resp => {
            if (resp.value) {
                nacecodeDeleteAsync(nacecode.ID);
            }
        });
    };

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col lg="8">
                    <Card>
                        {
                            isNacecodeLoading ? (
                                <ViewLoading />
                            ) : !!nacecode ? (
                                <>
                                    <Card.Header className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-0">
                                        <h6>NACE Code</h6>
                                        <div>
                                            <Status value={nacecode.Status} />
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={validationSchema}
                                            onSubmit={onFormSubmit}
                                            enableReinitialize
                                        >
                                            {(formik) => (
                                                <Form>
                                                    <Row>
                                                        <Col xs="6" sm="3">
                                                            <AryFormikTextInput name="sectorInput"
                                                                label="Sector"
                                                                type="text"
                                                            />
                                                        </Col>
                                                        <Col xs="6" sm="3">
                                                            <AryFormikTextInput name="divisionInput"
                                                                label="Division"
                                                                type="text"
                                                            />
                                                        </Col>
                                                        <Col xs="6" sm="3">
                                                            <AryFormikTextInput name="groupInput"
                                                                label="Group"
                                                                type="text"
                                                            />
                                                        </Col>
                                                        <Col xs="6" sm="3">
                                                            <AryFormikTextInput name="classInput"
                                                                label="Class"
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
                                                    <div className="bg-light border-radius-md p-3 pb-0 mb-3">
                                                        <Row>
                                                            <Col xs="12">
                                                                <AryFormikSelectInput 
                                                                    name="accreditedStatusSelect"
                                                                    label="Accredited"
                                                                >
                                                                    {
                                                                        nacecodeAccreditedStatusProps.map((option) => (
                                                                            <option key={option.id} value={option.id}>{option.label}</option>
                                                                        ))
                                                                    }
                                                                </AryFormikSelectInput>
                                                            </Col>
                                                            <Col xs="12">
                                                                <AryFormikTextInput name="accreditationInfoInput"
                                                                    label="Accreditation info"
                                                                    type="text"
                                                                />
                                                            </Col>
                                                            {
                                                                !!nacecode.AccreditationDate && (
                                                                    <Col xs="12">
                                                                        <AryFormikTextInput name="accreditationDateInput"
                                                                            label="Accreditation change date"
                                                                            type="date"
                                                                            disabled
                                                                            helpText="The accreditation change date is generated automatically"
                                                                        />
                                                                    </Col>
                                                                )
                                                            }
                                                        </Row>
                                                    </div>
                                                    <Row>
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
                                                            {/* <p className="text-xs text-secondary"><strong>Activar como administración actual</strong>, deshabilita cualquier otra que este marcada como activa.</p> */}
                                                        </Col>
                                                        <hr className="horizontal dark my-3" />
                                                        <Col xs="12">
                                                            <button type="button"
                                                                className="btn btn-link"
                                                                onClick={onDeleteButton}
                                                                disabled={isNacecodeDeleting}
                                                            >
                                                                <FontAwesomeIcon icon={faTrashCan} size="lg" className="me-1" />
                                                                Delete
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className="d-flex flex-column flex-sm-row justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <AryLastUpdatedInfo item={nacecode} />
                                                            </div>
                                                            <div className="d-flex justify-content-center justify-content-sm-between gap-2">
                                                                <button type="submit"
                                                                    className="btn bg-gradient-dark mb-0"
                                                                    disabled={isNacecodeSaving}
                                                                >
                                                                    <FontAwesomeIcon icon={faSave} size="lg" className="me-2" />
                                                                    Save
                                                                </button>
                                                                <button type="button" className="btn btn-link text-secondary mb-0" onClick={onCancelButton}>
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Card.Body>
                                </>
                            ) : null
                        }
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default NacecodeEditView;