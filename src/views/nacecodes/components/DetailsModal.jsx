import { useEffect } from 'react';
import { ListGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faArrowRightToBracket, faArrowRotateLeft, faBarcode, faCode, faEdit, faLayerGroup, faVectorSquare } from '@fortawesome/free-solid-svg-icons';

import enums from '../../../helpers/enums';
import useNacecodesStore from '../../../hooks/useNaceCodesStore';
import { ViewLoading } from '../../../components/Loaders';
import Code from './Code';
import ListGroupItemData from '../../../components/ListGroup/ListGroupItemData';

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
        navigate(`/nace-codes/${nacecode.ID}`);
    };

    const onRestoreButton = () => {
        Swal.fire({
            title: 'NACE Codes',
            text: 'Do you want to restore the registry?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Restore',
            cancelButtonText: 'Cancel',
        }).then(resp => {
            if (resp.value) {
                const itemToSave = {
                    ...nacecode,
                    status: DefaultStatusType.active,
                };
                nacecodeSaveAsync(itemToSave);
            }
        });
    };

    return (
        <Modal {...props} show={show} onHide={onHide} size="md">
            <Modal.Header>
                <Modal.Title>NACE Code details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isNacecodeLoading ? (
                    <ViewLoading />
                ) : !!nacecode ? (
                    <>
                        <h6>{nacecode.Description}</h6>
                        <hr className="horizontal dark my-4" />
                        <ListGroup>
                            <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                <ListGroupItemData label="Code" icon={ faLayerGroup }>
                                    <Code
                                        sector={nacecode.Sector}
                                        division={nacecode.Division}
                                        group={nacecode.Group}
                                        classs={nacecode.Class}
                                    />
                                </ListGroupItemData>
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                <ListGroupItemData label="Sector" icon={ faLayerGroup }>
                                    { nacecode.Sector?.toString().padStart(2, '0') }
                                </ListGroupItemData>
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                <ListGroupItemData label="Division" icon={ faLayerGroup }>
                                    { nacecode.Division?.toString().padStart(2, '0') }
                                </ListGroupItemData>
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                <ListGroupItemData label="Group" icon={ faLayerGroup }>
                                    { nacecode.Group?.toString().padStart(2, '0') }
                                </ListGroupItemData>
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                <ListGroupItemData label="Class" icon={ faLayerGroup }>
                                    { nacecode.Class?.toString().padStart(2, '0') }
                                </ListGroupItemData>
                            </ListGroup.Item>
                        </ListGroup>
                    </>
                ) : null}
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        {!!nacecode && (
                            <ul className="list-group opacity-7">
                                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                                    <strong className="me-2">Last updated:</strong>
                                    {new Date(nacecode.Updated).toLocaleDateString()}
                                </li>
                                <li className="list-group-item border-0 py-0 ps-0 text-xs text-secondary">
                                    <strong className="me-2">By:</strong>
                                    {nacecode.UpdatedUser}
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        {nacecode?.Status === DefaultStatusType.deleted && (
                            <button type="button"
                                className="btn bg-gradient-secondary mb-0"
                                onClick={onRestoreButton}
                                title="Restore"
                                disabled={isNacecodeSaving}
                            >
                                <FontAwesomeIcon icon={faArrowRotateLeft} size="lg" />
                            </button>
                        )}
                        {nacecode?.Status !== DefaultStatusType.deleted && (
                            <button type="button" className="btn bg-gradient-dark mb-0" onClick={onEditButton}>
                                <FontAwesomeIcon icon={faEdit} className="me-1" size="lg" />
                                Edit
                            </button>
                        )}
                        <button type="button" className="btn btn-link text-secondary mb-0" onClick={onHide}>
                            Close
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default DetailsModal;