import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

import { useAuditNavigation } from '../hooks/useAuditNavigation'
import auditStatusProps from '../helpers/auditStatusProps'

const AuditTableItem = ({ item, className, onEditClick, ...props }) => {

    return (
        <tr {...props} className={className}>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div>
                        <div className={`icon icon-sm icon-shape bg-gradient-${ auditStatusProps[item.Status].variant} border-radius-md me-2 d-flex align-items-center justify-content-center`}>
                            <FontAwesomeIcon 
                                icon={ auditStatusProps[item.Status].icon }
                                className="text-white" aria-hidden="true"
                            />
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                        <h6 className="mb-0 text-sm text-wrap">{item.Description}</h6>
                        <p className="text-xs text-secondary mb-0">
                            { format(new Date(item.StartDate), 'dd/MM/yyyy') } - { format(new Date(item.EndDate), 'dd/MM/yyyy') }
                        </p>
                    </div>
                </div>
            </td>
            <td>
                <p className="text-xs font-weight-bold text-wrap mb-0">
                    {item.OrganizationName}
                </p>
                <p className="text-xs text-secondary mb-0">
                    {item.AuditCycleName}
                </p>
            </td>
            <td>
                <div className="d-flex align-items-center gap-1">
                    <p className="text-xs text-wrap font-weight-bold mb-0">
                        {item.Auditors.map(i => i.AuditorName).join(', ')}
                    </p>
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center gap-1">
                    <p className="text-xs text-wrap font-weight-bold mb-0">
                        {item.Standards.map(i => i.StandardName).join(', ')}
                    </p>
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-center align-items-center mx-3">
                    {
                        !!onEditClick ?  
                        <a href="#" onClick={() => onEditClick(item.ID)} title="Edit">
                            <FontAwesomeIcon icon={faEdit} />
                        </a> : null
                    }
                </div>
            </td>
        </tr>
    )
};

export default AuditTableItem;