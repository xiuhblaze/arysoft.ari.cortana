
import { useState } from 'react';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import AuditModalEditItem from './AuditModalEditItem';

const AuditEditItem = ({ id = null, onClose, iconClassName, ...props }) => {
    
    const {
        auditCycle,
    } = useAuditCyclesStore();

    const {
        auditsAsync,        
    } = useAuditsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);    
        
    // METHODS

    const onShowModal = () => {
        setShowModal(true);
    }; // onShowModal

    const onCloseModal = () => {
        setShowModal(false);

        auditsAsync({
            auditCycleID: auditCycle.ID,
            pageSize: 0,
        });
    }; // onCloseModal

    return (
        <>
            <button
                type="button"
                className="btn btn-link p-0 mb-0"
                title={!!id ? "Edit audit" : "New audit"}
                onClick={onShowModal}
            >
                <FontAwesomeIcon icon={!!id ? faEdit : faPlus} className={ iconClassName ?? 'text-dark' } size="lg" />   
            </button>
            <AuditModalEditItem id={ id } show={showModal} onHide={onCloseModal} />
        </>
    )
}

export default AuditEditItem