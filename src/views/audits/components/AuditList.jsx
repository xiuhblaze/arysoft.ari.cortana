import React, { useEffect } from 'react'
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { ViewLoading } from '../../../components/Loaders';
import AuditItem from './AuditItem';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';

const AuditList = ({ readOnly = false, ...props }) => {

    // CUSTOM HOOKS

    const {
        auditCycle
    } = useAuditCyclesStore();

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
        <div {...props} className="d-flex justify-content-start flex-wrap gap-2">
            {
                isAuditsLoading ? (
                    <ViewLoading />
                ) : !!audits && audits.length > 0 ? (
                    audits.map(item => <AuditItem key={item.ID} item={item} />) 
                ) : <p className="text-center text-secondary text-xs">
                     (no audits created)
                </p>
            }
        </div>
    )
}

export default AuditList;