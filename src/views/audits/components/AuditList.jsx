import React, { useEffect } from 'react'
import { useAuditsStore } from '../../../hooks/useAuditsStore';
import { ViewLoading } from '../../../components/Loaders';
import AuditItem from './AuditItem';
import { useAuditCyclesStore } from '../../../hooks/useAuditCyclesStore';
import enums from '../../../helpers/enums';

const AuditList = ({ readOnly = false, showAllFiles = false, ...props }) => {

    const {
        AuditStatusType,
    } = enums();

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
                    audits
                        .filter(item => showAllFiles 
                            || item.Status >= AuditStatusType.scheduled && item.Status <= AuditStatusType.closed)
                        .map(item => <AuditItem key={item.ID} item={item} />) 
                ) : <p className="text-center text-secondary text-xs">
                     (no audits created)
                </p>
            }
        </div>
    )
}

export default AuditList;