import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';

import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Card, Col, Container, Row } from 'react-bootstrap';

import { setNavbarTitle, useArysoftUIController } from '../../context/context';
import useNacecodesStore from '../../hooks/useNaceCodesStore';
import enums from '../../helpers/enums';
import { ViewLoading } from '../../components/Loaders';
import { AryFormikTextInput } from '../../components/Forms';
import Status from './components/Status';

export const EditView = () => {
    const { id } = useParams();
    const [controller, dispatch] = useArysoftUIController();
    const navigate = useNavigate();
    const { DefaultStatusType } = enums();
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

    useEffect(() => {
        if (!!id) nacecodeAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!nacecode) {
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
            Status: values.activeCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
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
                                            initialValues={{
                                                sectorInput: nacecode?.Sector || '',
                                                divisionInput: nacecode?.Division || '',
                                                groupInput: nacecode?.Group || '',
                                                classInput: nacecode?.Class || '',
                                                descriptionInput: nacecode?.Description || '',
                                                activeCheck: nacecode?.Status ? nacecode.Status == DefaultStatusType.active : false,
                                            }}
                                            onSubmit={onFormSubmit}
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
                                                        <Col xs="12">
                                                            <div className="form-check form-switch mb-0">
                                                                <input id="activeCheck" name="activeCheck"
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    onChange={formik.handleChange}
                                                                    checked={formik.values.activeCheck}
                                                                />
                                                                <label className="form-check-label" htmlFor="activaCheck">Is active</label>
                                                            </div>
                                                            {/* <p className="text-xs text-secondary"><strong>Activar como administración actual</strong>, deshabilita cualquier otra que este marcada como activa.</p> */}
                                                        </Col>
                                                        <hr className="horizontal dark my-3" />
                                                        <Col xs="12">
                                                            <button type="button"
                                                                className="btn bg-gradient-secondary"
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
                                                                <p className="text-xs mb-sm-0">
                                                                    <strong>Last updated: </strong> {new Date(nacecode.Updated).toLocaleDateString()}<br />
                                                                    <strong>By: </strong> {nacecode.UpdatedUser}
                                                                </p>
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

export default EditView;