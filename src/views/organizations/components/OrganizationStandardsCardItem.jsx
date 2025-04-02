import React from 'react'
import { ListGroup } from 'react-bootstrap'
import enums from '../../../helpers/enums';
import defaultStatusProps from '../../../helpers/defaultStatusProps';
import OrganizationStandardEditItem from './OrganizationStandardEditItem';

const OrganizationStandardsCardItem = ({ item, readOnly = false, ...props }) => {
    const {
        DefaultStatusType
    } = enums();
    
    const itemStyle = `border-0 d-flex justify-content-between align-items-center px-0${(item.Status != DefaultStatusType.active || item.StandardStatus != DefaultStatusType.active)? ' opacity-6' : ''}`;  

    return (
        <ListGroup.Item {...props} className={itemStyle}>
            <div>
                <h6 className="text-sm mb-0">
                    {item.StandardName}
                </h6>
                <p className="text-xs text-secondary mb-0">
                    { item.ExtraInfo}
                </p>
            </div>
            {
                !readOnly && <OrganizationStandardEditItem id={ item.ID } />
            }
        </ListGroup.Item>
    )
}

export default OrganizationStandardsCardItem