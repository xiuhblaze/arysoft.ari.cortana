
import { useNavigate } from 'react-router-dom';
import enums from '../../../helpers/enums';
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore';
import { useEffect } from 'react';
import { ListGroup, Modal } from 'react-bootstrap';
import { ViewLoading } from '../../../components/Loaders';
import AryLastUpdatedInfo from '../../../components/AryLastUpdatedInfo/AryLastUpdatedInfo';
import { faCloudArrowUp, faEdit, faExclamation, faFile, faFileCircleExclamation, faFolderTree, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import catAuditorDocumentSubCategoryProps from '../helpers/catAuditorDocumentSubCategoryProps';
import catAuditorDocumentTypeProps from '../helpers/catAuditorDocumentTypeProps';
import ListGroupItemData from '../../../components/ListGroup/ListGroupItemData';
import catAuditorDocumentPeriodicityProps from '../helpers/catAuditorDocumentPeriodicityProps';
import AryDefaultStatusBadge from '../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';

const CatAuditorDocumentDetailsModal = ({ show, onHide, ...props }) => {

    const { 
        DefaultStatusType,
        CatAuditorDocumentSubCategoryType,
    } = enums();

    // CUSTOM HOOKS

    const {
        isCatAuditorDocumentLoading,
        isCatAuditorDocumentSaving,
        catAuditorDocumentSavedOk,
        catAuditorDocument,        
    } = useCatAuditorDocumentsStore();

    // HOOKS

    const navigate = useNavigate();

    // useEffect(() => {
        
    // }, [third]);
    
    // METHODS

    const onEditButton = () => {
        navigate(`/auditors-documents/${catAuditorDocument.ID}`);
    }; // onEditButton

    
    return (
        <Modal {...props} show={ show } onHide={ onHide }>
            {
                isCatAuditorDocumentLoading ? (
                    <>
                        <Modal.Body>
                            <ViewLoading />
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-link text-secondary mb-0" onClick={onHide}>
                                Close
                            </button>
                        </Modal.Footer>
                    </>
                ) : !!catAuditorDocument && show && (
                    <>
                        <Modal.Header>
                            <Modal.Title>
                                <FontAwesomeIcon icon={ faFileCircleExclamation } className={ `${ catAuditorDocument.IsRequired ? 'text-info' : ''} me-3` } />
                                Auditor document details
                            </Modal.Title>
                            <AryDefaultStatusBadge value={ catAuditorDocument.Status } />
                        </Modal.Header>
                        <Modal.Body>
                            { !isNullOrEmpty(catAuditorDocument.Name) && 
                                <h6>
                                    { 
                                        !!catAuditorDocument.SubCategory 
                                        && catAuditorDocument.SubCategory != CatAuditorDocumentSubCategoryType.nothing
                                        && <span>Sub Category { catAuditorDocumentSubCategoryProps[catAuditorDocument.SubCategory].label } - </span> }
                                    { catAuditorDocument.Name }
                                </h6>
                            }
                            {
                                !isNullOrEmpty(catAuditorDocument.Description) 
                                && <p className="mb-0 font-weight-bold text-sm">{ catAuditorDocument.Description }</p>
                            }
                            <hr className="horizontal dark my-4" />
                            <ListGroup>
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Document Type" icon={ faFile }>
                                        { catAuditorDocumentTypeProps[catAuditorDocument.DocumentType].label }
                                    </ListGroupItemData>
                                </ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Warn" icon={ faTriangleExclamation }>
                                        { !!catAuditorDocument.WarningEvery && !!catAuditorDocument.WarningPeriodicity ? (
                                            <>
                                                { catAuditorDocument.WarningEvery }
                                                { ` ${catAuditorDocumentPeriodicityProps[catAuditorDocument.WarningPeriodicity].label}${ catAuditorDocument.WarningEvery > 1 ? 's' : ''} before` }
                                            </>
                                        ) : (
                                            <span className="text-secondary">(not setting)</span>
                                        )}
                                    </ListGroupItemData>
                                </ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Update" icon={ faCloudArrowUp }>
                                        { !!catAuditorDocument.UpdateEvery && !!catAuditorDocument.UpdatePeriodicity ? (
                                            <>
                                                every { catAuditorDocument.UpdateEvery }
                                                { ` ${catAuditorDocumentPeriodicityProps[catAuditorDocument.UpdatePeriodicity].label}${ catAuditorDocument.UpdateEvery > 1 ? 's' : ''}` }
                                            </>
                                        ) : ( <span className="text-secondary">(not setting)</span> )}
                                    </ListGroupItemData>
                                </ListGroup.Item>
                                <ListGroup.Item className="border-0 ps-0 pt-0 text-sm">
                                    <ListGroupItemData label="Is required" icon={ faExclamation }>
                                        { catAuditorDocument.IsRequired ? 'Yes' : 'No' }
                                    </ListGroupItemData>
                                </ListGroup.Item>
                            </ListGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <AryLastUpdatedInfo item={ catAuditorDocument } />
                                <div className="d-flex justify-content-end gap2">
                                    { catAuditorDocument.Status !== DefaultStatusType.deleted && (
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
                    </>
                )
            }
        </Modal>
    )
}

export default CatAuditorDocumentDetailsModal