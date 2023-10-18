import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import * as Yup from 'yup';
import Swal from 'sweetalert2';

import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import enums from "../../helpers/enums";
import { AryFormikTextInput } from "../../components/Forms";
import Status from "./components/Status";
import { ViewLoading } from "../../components/Loaders";
import { useStandardsStore } from "../../hooks/useStandardsStore";

const EditView = () => {
  const { id } = useParams();
  const [controller, dispatch] = useArysoftUIController();
  const navigate = useNavigate();
  const { DefaultStatusType } = enums();
  const {
    isStandardLoading,
    isStandardSaving,
    standardSavedOk,
    isStandardDeleting,
    standardDeletedOk,
    standard,
    standardErrorMessage,

    standardAsync,
    standardSaveAsync,
    standardDeleteAsync,
    standardClear,
  } = useStandardsStore();

  useEffect(() => {
    if (!!id) standardAsync(id);
  }, [id]);

  useEffect(() => {
    if (!!standard) {
      setNavbarTitle(dispatch, standard.Name);
    }
  }, [standard]);

  useEffect(() => {
    if (standardSavedOk) {
      Swal.fire('Standards', 'The changes were made successfully', 'success');
      standardClear();
      navigate('/standards/');
    }
  }, [standardSavedOk]);
  
  useEffect(() => {
    if (standardDeletedOk) {
      Swal.fire('Standards', 'Record deleted successfully', 'success');
      standardClear();
      navigate('/standards/');
    }
  }, [standardDeletedOk]);
  
  useEffect(() => {
    if (!!standardErrorMessage) {
      Swal.fire('Standards', standardErrorMessage, 'error');
    }
  }, [standardErrorMessage]);

  // METHODS

  const onFormSubmit = (values) => {
    
    const itemToSave = {
      StandardID: standard.StandardID,
      Name: values.nameInput,
      Description: values.descriptionInput,
      Status: values.activeCheck ? DefaultStatusType.active : DefaultStatusType.inactive,
    };

    standardSaveAsync(itemToSave);
  };

  const onCancelButton = () => {
    standardClear();
    navigate('/standards/');
  };

  const onDeleteButton = () => {

    Swal.fire({
      title: 'Standards',
      text: 'This action will remove the registry. Do you wish to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then( resp => {
      if (resp.value) {
        standardDeleteAsync(standard.StandardID);
      } 
    });
  };

  return (
    <Container fluid className="py-4 px-0 px-sm-4">
      <Row>
        <Col lg="8">
          <Card>
            {
              isStandardLoading ? (
                <ViewLoading />
              ) : !!standard ? (
                <>
                  <Card.Header className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-0">
                    <h6>Standard</h6>
                    <div>
                      <Status value={ standard.Status } />
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Formik
                      initialValues={{
                        nameInput: standard?.Name || '',
                        descriptionInput: standard?.Description || '',
                        activeCheck: standard?.Status ? standard.Status == DefaultStatusType.active : false,
                      }}
                      onSubmit={ onFormSubmit }
                      validationSchema={ Yup.object({
                        nameInput: Yup.string()
                          .required('Name is required')
                          .max(100, 'Name must be at most 100 characters'),
                        descriptionInput: Yup.string()
                          .max(250, 'Description must be at most 250 characters'),
                      })}
                    >
                      { (formik) => (
                        <Form>
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
                              <div className="form-check form-switch mb-0">
                                <input id="activeCheck" name="activeCheck"
                                  className="form-check-input"
                                  type="checkbox"
                                  onChange={ formik.handleChange }
                                  checked={ formik.values.activeCheck }
                                />
                                <label className="form-check-label" htmlFor="activaCheck">Is active</label>
                              </div>
                              {/* <p className="text-xs text-secondary"><strong>Activar como administración actual</strong>, deshabilita cualquier otra que este marcada como activa.</p> */}
                            </Col>
                            <hr className="horizontal dark my-3" />
                            <Col xs="12">
                              <button type="button" 
                                className="btn bg-gradient-secondary"
                                onClick={ onDeleteButton }
                                disabled={ isStandardDeleting }
                              >
                                <FontAwesomeIcon icon={ faTrashCan } size="lg" className="me-1" />
                                Delete
                              </button>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="d-flex flex-column flex-sm-row justify-content-between">
                              <div className="d-flex align-items-center">
                                <p className="text-xs mb-sm-0">
                                  <strong>Last updated: </strong> { new Date(standard.Updated).toLocaleDateString() }<br />
                                  <strong>By: </strong> { standard.UpdatedUser }
                                </p>
                              </div>
                              <div className="d-flex justify-content-center justify-content-sm-between gap-2">
                                <button type="button" className="btn btn-outline-secondary mb-0" onClick={ onCancelButton }>
                                  Cancel
                                </button>
                                <button type="submit" 
                                  className="btn bg-gradient-dark mb-0"
                                  disabled={ isStandardSaving }
                                >
                                  <FontAwesomeIcon icon={ faSave } size="lg" className="me-1" />
                                  Save
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