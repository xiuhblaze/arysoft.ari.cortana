import { useEffect, useState } from 'react';

import { useAuditsStore } from '../../../hooks/useAuditsStore';
import envVariables from '../../../helpers/envVariables';
import enums from '../../../helpers/enums';
import { ViewLoading } from '../../../components/Loaders';
import { useAuditNavigation } from '../hooks/useAuditNavigation';
import AuditTableItem from './AuditTableItem';
import AuditModalEditItem from './AuditModalEditItem';
import AryTableSortItem from '../../../components/AryTableSortItem/AryTableSortItem';

const AuditTableList = () => {
    const headStyle = 'text-uppercase text-secondary text-xxs font-weight-bolder';
    const { AuditOrderType } = enums();
    
    // CUSTOM HOOKS

    const {
        isAuditsLoading,
        audits,
        auditsAsync,
        auditAsync,
    } = useAuditsStore();

    const {
        currentOrder,
        onSearch,
        onOrderChange
    } = useAuditNavigation();

    // HOOKS

    const [showModal, setShowModal] = useState(false);
    const [auditID, setAuditID] = useState(null);
    // const [currentOrder, setCurrentOrder] = useState(AuditOrderType.dateDesc);  

    // useEffect(() => {
        
    //     if (!!audits) {
    //         const savedSearch = JSON.parse(localStorage.getItem(AUDITS_OPTIONS)) || null;
    //         setCurrentOrder(savedSearch?.order ?? AuditOrderType.folio);
    //     }

    // }, [audits]);

    // useEffect(() => {
    //     console.log('AuditTableList.useEffect[]:');
    // }, []);
    
    
    // METHODS

    const onShowModal = (id) => {
        setShowModal(true);
        //auditAsync(id);

        setAuditID(id);
    };

    const onCloseModal = () => {
        setShowModal(false);
        setAuditID(null);

        onSearch();

        //! Ver que cosas se ocupan actualizar al cerrar el modal
    };

    return (
        <>
            {
                isAuditsLoading ? (
                    <ViewLoading />
                ) : !!audits ? (
                    <div className="table-responsive p-0">
                        <table className="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>
                                        <div className="d-flex justify-content-start align-items-center gap-1">
                                            <AryTableSortItem
                                                activeAsc={currentOrder === AuditOrderType.date}
                                                activeDesc={currentOrder === AuditOrderType.dateDesc}
                                                onOrderAsc={() => { onOrderChange(AuditOrderType.date) }}
                                                onOrderDesc={() => { onOrderChange(AuditOrderType.dateDesc) }}
                                            />
                                            <div className={headStyle}>Audit</div>
                                        </div>
                                        
                                    </th>
                                    <th className={headStyle}>Organization</th>
                                    <th className={headStyle}>Auditors</th>
                                    <th className={headStyle}>Standards</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { audits.map(item => <AuditTableItem 
                                    key={item.ID} 
                                    item={item} 
                                    onEditClick={onShowModal}
                                />)}
                            </tbody>
                        </table>
                    </div>
                ) : null
            }
            <AuditModalEditItem id={auditID} show={showModal} onHide={onCloseModal} />
        </>
    )
}

export default AuditTableList