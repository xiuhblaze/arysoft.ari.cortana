import { ListGroup } from 'react-bootstrap'
import auditCycleProps from '../helpers/auditCycleProps'
import enums from '../../../helpers/enums';
import auditStepProps from '../../audits/helpers/auditStepProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLandmark } from '@fortawesome/free-solid-svg-icons';
import AuditCycleStandardEditItem from './AuditCycleStandardEditItem';

const AuditCycleStandardItem = ({ item, readOnly = false, ...props }) => {
    const { DefaultStatusType } = enums();

    const itemStyle = `border-0 d-flex justify-content-between align-items-center px-0${item.Status == DefaultStatusType.inactive ? ' opacity-6' : ''}`;

    return (
        <ListGroup.Item {...props} className={itemStyle} >
            <div className="d-flex justify-content-start align-items-center">
                <FontAwesomeIcon icon={faLandmark} size="lg" className="text-dark me-2" /> 
                <div>
                    <h6 className="text-sm mb-0">
                        {item.StandardName}
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                        {auditCycleProps[item.CycleType].label} | { auditStepProps[item.InitialStep].label } 
                    </p>
                </div>
            </div>
            {
                !readOnly && <AuditCycleStandardEditItem id={ item.ID } />
            }
        </ListGroup.Item>
    )
}

export default AuditCycleStandardItem