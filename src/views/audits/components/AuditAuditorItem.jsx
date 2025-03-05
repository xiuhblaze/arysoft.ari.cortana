import React from 'react'
import enums from '../../../helpers/enums'
import { ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import AuditAuditorEditItem from './AuditAuditorEditItem';

const AuditAuditorItem = ({ item, readOnly = false, ...props }) => {
    const {
        DefaultStatusType,
    } = enums();

    const itemStyle = `border-0 d-flex justify-content-between align-items-center bg-transparent px-0${item.Status == DefaultStatusType.inactive ? ' opacity-6' : ''}`;

    return (
        <ListGroupItem {...props} className={itemStyle} >
            <div 
                className="d-flex justify-content-start align-items-center"
                title={ item.IsLeader ? 'Is lead auditor' : '' }
            >
                <FontAwesomeIcon icon={ faUser } size="lg" className="text-dark me-2" />
                <div>
                    <h6 className={`text-sm mb-0 ${item.IsLeader ? 'text-info text-gradient' : ''}`}>
                        {item.AuditorName}
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                        { 
                            item.StandardsNames.length > 0 
                                ? item.StandardsNames.join(', ') 
                                : '(no standards assigned for this audit)' 
                        }
                    </p>
                </div>
            </div>
            {
                !readOnly && <AuditAuditorEditItem id={ item.ID } />
            }
        </ListGroupItem>
    )
}

export default AuditAuditorItem