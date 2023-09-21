import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';

import enums from "../../../helpers/enums";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import { Col, Modal, Row } from "react-bootstrap";
import { ViewLoading } from "../../../components/Loaders";
import Status from "./Status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faArrowRotateLeft, faEdit, faGlobe, faPhone, faShare } from "@fortawesome/free-solid-svg-icons";
import getFriendlyDate from "../../../helpers/getFriendlyDate";

import bgHeadModal from '../../../assets/img/bgTrianglesBW.jpg';

const DetailsModal = ({ show, onHide, ...props }) => {
  const navigate = useNavigate();
  const { OrganizationStatusType } = enums();
  const {
    isOrganizationLoading,
    isOrganizationSaving,
    organizationSavedOk,
    organization,
    organizationSaveAsync,
    organizationClear,
  } = useOrganizationsStore();

  useEffect(() => {
    if (organizationSavedOk) {
      Swal.fire('Standards', 'Successful restoration');
      organizationClear();
      onHide();
    }
  }, [organizationSavedOk]);

  // METHODS

  const onEditButton = () => {
    navigate(`/organizations/${ organization.OrganizationID }`);
  }

  const onRestoreButton = () => {
    Swal.fire({
      title: 'Organization',
      text: 'Restore the organization?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Restore',
      cancelButtonText: 'Cancel',
    }).then( resp => {
      if (resp.value) {
        const itemToSave = {
          ...organization,
          Status: OrganizationStatusType.active,
        }
        organizationSaveAsync(itemToSave);
      }
    });
  };

  return (
    <Modal { ...props } show={ show } onHide={ onHide } size="xl">
      {/* <Modal.Header>
        <Modal.Title>{ !!organization ? organization.Name : 'Details' }</Modal.Title>
      </Modal.Header> */}
      <Modal.Body>
        {
          isOrganizationLoading ? (
            <ViewLoading />
          ) : !!organization ? (
            <>
              <div 
                className="page-header min-height-150 border-radius-lg"
                style={{
                  backgroundImage: `url(${ bgHeadModal })`,
                  backgroundPositionY: '50%'
                }}
              >
                <span className="mask bg-gradient-info opacity-6"></span>
              </div>
              <div className="card card-body blur shadow-blur mx-4 mt-n5 overflow-hidden">
                <div className="row gx-4">
                  <div className="col-auto">
                    <div className="avatar avatar-xl position-relative">
                      <img src="/files/organizations/lgoArysoft2019.png" alt="profile_image" className="w-100 border-radius-lg shadow-sm" />
                    </div>
                  </div>
                  <div className="col-auto my-auto">
                    <div className="h-100">
                      <h5 className="mb-1">
                        { organization.Name }
                      </h5>
                      <p className="mb-0 font-weight-bold text-sm">
                        { organization.LegalEntity }
                      </p>
                    </div>
                  </div>
                  <div className="col-auto my-auto">
                    <p className="mb-0 text-sm">
                      <strong className="text-dark me-2">
                        <FontAwesomeIcon icon={ faGlobe } className="me-1" />
                      </strong>
                      <a href={ `http://${ organization.Website }` } target="_blank">
                        { organization.Website }
                        <FontAwesomeIcon icon={ faShare } className="ms-1" />
                      </a>
                    </p>
                    <p className="text-dark text-sm mb-0">
                      <FontAwesomeIcon icon={ faPhone } className="me-2" />
                      { organization.Phone }
                      <a href={ `tel:${ organization.Phone }`} className="ms-1">
                        <FontAwesomeIcon icon={ faShare } className="opacity-6" />
                      </a>
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                    <Status value={ organization.Status } />
                  </div>
                </div>
              </div>

              <Row className="mt-4">
                <Col xs="12" sm="6" className="position-relative">
                  <h6 className="d-flex justify-content-between">
                    <span>{ organization.LegalEntity }</span>
                    
                  </h6>
                  <hr className="horizontal dark my-2" />
                  <ul className="list-group">
                    <li className="list-group-item border-0 ps-0 text-sm">
                      <strong className="text-dark me-2">
                        <FontAwesomeIcon icon={ faGlobe } className="me-1" />
                        Website:
                      </strong>
                      <a href={ `http://${ organization.Website }` } target="_blank">
                        { organization.Website }
                        <FontAwesomeIcon icon={ faShare } className="ms-1" />
                      </a>
                    </li>
                    <li className="list-group-item border-0 ps-0 text-sm">
                      <strong className="text-dark me-2">
                        <FontAwesomeIcon icon={ faPhone } className="me-1" />
                        Phone:
                      </strong>
                      { organization.Phone }
                      <a href={ `tel:${ organization.Phone }`}>
                        <FontAwesomeIcon icon={ faShare } className="ms-1" />
                      </a>
                    </li>
                  </ul>
                  <hr className="vertical dark" />
                </Col>
                <Col xs="12" sm="6">
                  <h5>Contacts</h5>
                  <h5>Sites</h5>
                </Col>
              </Row>
            </>
          ) : null
        }
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            { !!organization && (
              <ul className="list-group opacity-7">
                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                  <strong className="me-2">Last updated:</strong>
                  { getFriendlyDate(organization.Updated) }
                </li>
                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                  <strong className="me-2">By:</strong>
                  { organization.UpdatedUser }
                </li>
              </ul>
            )}
          </div>
          <div className="d-flex justify-content-end gap-2">
            { organization?.Status === OrganizationStatusType.deleted && (
              <button type="button" 
                className="btn bg-gradient-secondary mb-0" 
                onClick={ onRestoreButton }
                title="Retore"
                disabled={ isOrganizationSaving }
              >
                <FontAwesomeIcon icon={ faArrowRotateLeft } size="lg" />
              </button>
            )}
            <button type="button" className="btn btn-outline-secondary mb-0" onClick={ onHide }>
              <FontAwesomeIcon icon={ faArrowRightToBracket } className="me-1" size="lg" />
              Close
            </button>
            { organization?.Status !== OrganizationStatusType.deleted && (
              <button type="button" className="btn bg-gradient-dark mb-0" onClick={ onEditButton }>
                <FontAwesomeIcon icon={ faEdit } className="me-1" size="lg" />
                Edit
              </button>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default DetailsModal