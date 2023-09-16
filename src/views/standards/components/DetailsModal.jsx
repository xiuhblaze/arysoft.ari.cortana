import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Modal } from "react-bootstrap";
import Swal from 'sweetalert2';

import enums from "../../../helpers/enums";
import { useStandardsStore } from "../../../hooks/useStandardsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faArrowRotateLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import { ViewLoading } from "../../../components/Loaders";
import getFriendlyDate from "../../../helpers/getFriendlyDate";
import Status from "./Status";

const DetailsModal = ({ show, onHide, ...props }) => {
  const navigate = useNavigate();
  const { DefaultStatusType } = enums();
  const {
    isStandardLoading,
    isStandardSaving,
    standardSavedOk,
    standard,
    standardSaveAsync,
    standardClear,
  } = useStandardsStore();

  useEffect(() => {
    if (standardSavedOk) {
      Swal.fire('Standards', 'Successful restoration');
      standardClear();
      onHide();
    }
  }, [standardSavedOk]);

  const onEditButton = () => {
    navigate(`/standards/${ standard.StandardID }`);
  }

  const onRestoreButton = () => {
    Swal.fire({
      title: 'Standard',
      text: 'Restore the standard?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Restore',
      cancelButtonText: 'Cancel',
    }).then( resp => {
      if (resp.value) {
        const itemToSave = {
          ...standard,
          Status: DefaultStatusType.active,
        }
        standardSaveAsync(itemToSave);
      }
    });
  };

  return (
    <Modal { ...props } show={ show } onHide={ onHide } size="md">
      <Modal.Header>
      <Modal.Title>Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          isStandardLoading ? (
            <ViewLoading />
          ) : !!standard ? (
            <>
              <h6>{ standard.Name }</h6>
              <hr className="horizontal gray-light my-2" />
              <ul className="list-group">
                <li className="list-group-item border-0 ps-0 text-sm">
                  <strong className="text-dark me-2">Standard:</strong>
                  { standard.Name }
                </li>
                <li className="list-group-item border-0 ps-0 text-sm">
                  <strong className="text-dark me-2">Description:</strong>
                  { standard.Description }
                </li>
                <li className="list-group-item border-0 ps-0 text-sm">
                  <strong className="text-dark me-2">Status:</strong>
                  <Status value={ standard.Status } />
                </li>
              </ul>
            </>
          ) : null
        }
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            { !!standard && (
              <ul className="list-group opacity-7">
                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                  <strong className="me-2">Last updated:</strong>
                  { getFriendlyDate(standard.Updated) }
                </li>
                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                  <strong className="me-2">By:</strong>
                  { standard.UpdatedUser }
                </li>
              </ul>
            )}
          </div>
          <div className="d-flex justify-content-end gap-2">
            { standard?.Status === DefaultStatusType.deleted && (
              <button type="button" 
                className="btn bg-gradient-secondary mb-0" 
                onClick={ onRestoreButton }
                title="Retore"
                disabled={ isPersonaSaving }
              >
                <FontAwesomeIcon icon={ faArrowRotateLeft } size="lg" />
              </button>
            )}
            <button type="button" className="btn btn-outline-secondary mb-0" onClick={ onHide }>
              <FontAwesomeIcon icon={ faArrowRightToBracket } className="me-1" size="lg" />
              Close
            </button>
            { standard?.Status !== DefaultStatusType.deleted && (
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