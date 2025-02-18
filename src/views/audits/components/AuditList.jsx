import React, { useEffect } from 'react'
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { ViewLoading } from '../../../components/Loaders';
import AuditItem from './AuditItem';

const AuditList = ({ auditCycle, readOnly = false, ...props }) => {

    // CUSTOM HOOKS

    const {
        isAuditsLoading,
        audits,
        auditsAsync,
        auditsClear,
    } = useAuditsStore();

    // HOOKS

    useEffect(() => {
        if (!!auditCycle) {
            auditsAsync({
                auditCycleID: auditCycle.ID,
                pageSize: 0,
            });
        }
    }, [auditCycle]);
    

    return (
        <div {...props}>
            {
                isAuditsLoading ? (
                    <ViewLoading />
                ) : !!audits && audits.length > 0 ? (
                    audits.map(item => <AuditItem key={item.ID} auditCycle={auditCycle} item={item} />) 
                ) : <p className="text-center text-secondary text-xs">
                     (no audits created)
                </p>
            }
        </div>
    )
}

export default AuditList;