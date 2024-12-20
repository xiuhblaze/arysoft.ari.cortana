import React, { useState } from 'react'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuditorsStore } from '../../../hooks/useAuditorsStore'
import { ListGroup, Modal } from 'react-bootstrap'
import { useCatAuditorDocumentsStore } from '../../../hooks/useCatAuditorDocumentsStore'
import isNullOrEmpty from '../../../helpers/isNullOrEmpty'
import enums from '../../../helpers/enums'
import { useAuditorDocumentsStore } from '../../../hooks/useAuditorDocumentsStore'
import { ViewLoading } from '../../../components/Loaders'
import AuditorDocumentsCardItem from './AuditorDocumentsCardItem'

const AuditorDocumentsHistoryList = ({ catAuditorDocumentID, readOnly = false, ...props }) => {

    const { 
        AuditorDocumentOrderType,
        CatAuditorDocumentSubCategoryType
    } = enums();

    const subCategory = [
        { label: '-' },
        { label: 'CIV' },
        { label: 'K' },
        { label: 'L' },
    ];

    // CUSTOM HOOKS

    const {
        auditor
    } = useAuditorsStore();

    const {
        isCatAuditorDocumentLoading,
        catAuditorDocument,
        catAuditorDocumentsErrorMessage,
        catAuditorDocumentAsync,
        catAuditorDocumentClear,
    } = useCatAuditorDocumentsStore();

    const {
        isAuditorDocumentsLoading,
        auditorDocuments,
        auditorDocumentsAsync,
        auditorDocumentsClear,
    } = useAuditorDocumentsStore();

    // HOOKS 

    const [showModal, setShowModal] = useState(false);

    // METHODS

    const onShowModal = () => {

        setShowModal(true);

        catAuditorDocumentAsync(catAuditorDocumentID);

        auditorDocumentsAsync({
            auditorID: auditor.ID,
            catAuditorDocumentID: catAuditorDocumentID,
            pageSize: 0,
            order: AuditorDocumentOrderType.startDateDesc,
        });
        
    };

    const onCloseModal = () => {

        setShowModal(false);
    };

    return (
        <div {...props}>
            <button
                type="button"
                className="btn btn-link mb-0 p-0 text-lg"
                onClick={ onShowModal }
                title="View history"
            >
                <FontAwesomeIcon icon={faBars} className="text-dark" />
            </button>
            <Modal show={ showModal } onHide={ onCloseModal }>
                <Modal.Header>
                    <Modal.Title>History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        isCatAuditorDocumentLoading || isAuditorDocumentsLoading 
                            ? ( <ViewLoading /> )
                            : !!auditorDocuments && auditorDocuments.length > 0 
                                ? (
                                    <ListGroup>
                                        { auditorDocuments.map(item => (
                                            <AuditorDocumentsCardItem
                                                key={ item.ID }
                                                item={ catAuditorDocument }
                                                document={ item }
                                                hideHistory
                                                readOnly={ readOnly }
                                            />
                                        )) }
                                    </ListGroup>
                                )
                                : (
                                    <div className="text-center my-5">(no history yet)</div>
                                )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center w-100">
                        <div className="text-secondary mb-3 mb-sm-0">
                            
                        </div>
                        <div className="d-flex justify-content-end ms-auto ms-sm-0 mb-3 mb-sm-0 gap-2">
                            <button type="button"
                                className="btn btn-link text-secondary mb-0"
                                onClick={onCloseModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AuditorDocumentsHistoryList