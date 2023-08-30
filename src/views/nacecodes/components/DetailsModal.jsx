import { Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import enums from '../../../helpers/enums';
import useNacecodesStore from '../../../hooks/useNaceCodesStore';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import Code from './Code';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faArrowRotateLeft, faEdit } from '@fortawesome/free-solid-svg-icons';

export const DetailsModal = ({ show, onHide, ...props }) => {
  const navigate = useNavigate();
  const { DefaultStatusType } = enums();
  const {
    isNacecodeLoading,
    isNacecodeSaving,
    nacecodeSavedOk,
    nacecode,
    nacecodeSaveAsync,
    nacecodeClear,
  } = useNacecodesStore();

  useEffect(() => {
    if (nacecodeSavedOk) {
      Swal.fire('NACE Codes', 'Successfully restored');
      nacecodeClear();
      onHide();
    }
  }, [nacecodeSavedOk]);
  
  const onEditButton = () => {
    navigate(`/nace-codes/${ nacecode.NaceCodeID }`);
  };

  const onRestoreButton = () => {

  };

  return (
    <Modal { ...props } show={ show } onHide={ onHide } size="md">
      <Modal.Header>
        <Modal.Title>NACE Code details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { isNacecodeLoading ? (
          <div className="text-center">
            <div className="w-100 m-auto" style={{ paddingTop: 'calc(25vh - 50px)', paddingBottom: '25vh', width: '3rem', height: '3rem' }}>
              <Spinner animation="border" variant="info" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        ) : !!nacecode ? (
          <>
            <h6>{ nacecode.Description }</h6>
            <hr className="horizontal gray-light my-2"></hr>
            <ul className="list-group">
              <li className="list-group-item border-0 ps-0 text-sm">
                <strong className="text-dark me-2">Code</strong>
                <Code 
                  sector={ nacecode.Sector }
                  division={ nacecode.Division }
                  group={ nacecode.Group }
                  classs={ nacecode.Class }
                />
              </li>
              <li className="list-group-item border-0 ps-0 text-sm">
                <strong className="text-dark me-2">Sector</strong>
                { nacecode.Sector?.toString().padStart(2, '0') }
              </li>
              <li className="list-group-item border-0 ps-0 text-sm">
                <strong className="text-dark me-2">Division</strong>
                { nacecode.Division?.toString().padStart(2, '0') }
              </li>
              <li className="list-group-item border-0 ps-0 text-sm">
                <strong className="text-dark me-2">Group</strong>
                { nacecode.Group?.toString().padStart(2, '0') }
              </li>
              <li className="list-group-item border-0 ps-0 text-sm">
                <strong className="text-dark me-2">Class</strong>
                { nacecode.Class?.toString().padStart(2, '0')}
              </li>
            </ul>
          </>
        ) : null }
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            { !!nacecode && (
              <ul className="list-group opacity-7">
                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                  <strong className="me-2">Last updated:</strong>
                  { new Date(nacecode.Updated).toLocaleDateString() }
                </li>
                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                  <strong className="me-2">By:</strong>
                  { nacecode.UpdatedUser }
                </li>
              </ul>
            )}
          </div>
          <div className="d-flex justify-content-end gap-2">
            { nacecode?.Status === DefaultStatusType.deleted && (
              <button type="button" 
                className="btn bg-gradient-secondary mb-0" 
                onClick={ onRestoreButton }
                title="Restore"
                disabled={ isNacecodeSaving }
              >
                <FontAwesomeIcon icon={ faArrowRotateLeft } size="lg" />
              </button>
            )}
            <button type="button" className="btn btn-outline-secondary mb-0" onClick={ onHide }>
              <FontAwesomeIcon icon={ faArrowRightToBracket } className="me-1" size="lg" />
              Close
            </button>
            { nacecode?.Status !== DefaultStatusType.deleted && (
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

export default DetailsModal;