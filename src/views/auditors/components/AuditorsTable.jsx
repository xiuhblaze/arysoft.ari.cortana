import React, { useState } from 'react'
import { useAuditorsStore } from '../../../hooks/useAuditorsStore'
import { ViewLoading } from '../../../components/Loaders';
import AuditorsTableItem from './AuditorsTableItem';
import AuditorDetailsModal from './AuditorDetailsModal';

const AuditorsTable = () => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';

    // CUSTOM HOOKS

    const {
        isAuditorsLoading,
        auditors,
        auditorAsync,
        auditorClear
    } = useAuditorsStore();

    // HOOKS

    const [showModal, setShowModal] = useState(false);

    // METHODS

    const onShowModal = (id) => {
        //console.log('onShowModal');
        setShowModal(true);
        auditorAsync(id);
    }; // onShowModal

    const onCloseModal = () => {
        //console.log('onCloseModal');
        setShowModal(false);
        auditorClear();
    };

    if (isAuditorsLoading) return <ViewLoading />

    return (
        <>
            { !!auditors && (
                <>
                    <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th className={headStyle}>
                                        Auditor
                                    </th>
                                    <th className={headStyle}>
                                        Contact info
                                    </th>
                                    <th className={headStyle}>
                                        Standards
                                    </th>
                                    <th className={ `text-center ${headStyle}`} title="FSSC Auditor Documents checklist">
                                        Document Checklist
                                    </th>
                                    <th className={ `text-center ${headStyle}`}>
                                        Status
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    auditors.map( item => {

                                        return (
                                            <AuditorsTableItem 
                                                key={item.ID}
                                                item={ item }
                                                onShowModal={ () => onShowModal(item.ID) }
                                            />
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <AuditorDetailsModal show={ showModal } onHide={ onCloseModal } />
                </>
            )}
        </>
    )
}

export default AuditorsTable