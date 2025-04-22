import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faEdit, faEye, faStar, faStickyNote, faUser } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

import auditStatusProps from '../helpers/auditStatusProps'
import getDateDifferenceInUpperDays from '../../../helpers/getDateDiffereceInUpperDays';
import auditStepProps from '../helpers/auditStepProps';
import enums from '../../../helpers/enums';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';

const AuditTableItem = ({ item, className, onEditClick, ...props }) => {

    const {
        DefaultStatusType
    } = enums();

    return (
        <tr {...props} className={className}>
            <td>
                <div className="d-flex justify-content-center align-items-center mx-1">
                    {
                        !!onEditClick ?  
                        <a href="#" onClick={() => onEditClick(item.ID)} title="Edit">
                            <FontAwesomeIcon icon={faEdit} />
                        </a> : null
                    }
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div>
                        <div 
                            className={`icon icon-sm icon-shape bg-gradient-${ auditStatusProps[item.Status].variant} border-radius-md me-2 d-flex align-items-center justify-content-center`}
                            title={ auditStatusProps[item.Status].label }
                        >
                            <FontAwesomeIcon 
                                icon={ auditStatusProps[item.Status].icon }
                                className="text-white" aria-hidden="true"
                            />
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                        <h6 className="mb-0 text-sm text-wrap">{item.Description}</h6>
                        <p className="text-xs text-secondary mb-0">
                            { format(new Date(item.StartDate), 'dd/MM/yyyy') } - { format(new Date(item.EndDate), 'dd/MM/yyyy') } / { getDateDifferenceInUpperDays(item.StartDate, item.EndDate) + 1 } Days
                        </p>
                    </div>
                </div>
            </td>
            <td>
                <p className="text-xs font-weight-bold text-wrap mb-0">
                    <FontAwesomeIcon icon={ faBuilding } className="me-1" />
                    {item.OrganizationName}
                </p>
                <p className="text-xs text-secondary mb-0">
                    {item.AuditCycleName}
                </p>
            </td>
            <td>
                <div className="d-flex align-items-start flex-column mb-0 gap-1">
                    { item.Auditors.map(i => {
                        let title = i.Status != DefaultStatusType.active ? 'Inactive - ' : '';
                        title += i.IsLeader ? 'Auditor leader' : i.IsWitness ? 'Witness' : 'Auditor';
                        return (
                            // <div key={i.ID} className="d-flex flex-column align-items-start item-action p-1 rounded-1 gap-1">
                            <div 
                                key={i.ID}
                                className={`d-flex flex-column align-items-start gap-1 ${ i.Status != DefaultStatusType.active ? 'opacity-6' : '' }`} 
                                title={ title }
                            > 
                                <span className="text-xs">
                                    <FontAwesomeIcon icon={ i.IsLeader ? faStar : i.IsWitness ? faEye : faUser } className="me-1"/>
                                    <span className={`text-${ i.IsLeader ? 'info text-gradient' : i.IsWitness ? 'secondary' : 'body' } text-wrap font-weight-bold`}>{i.AuditorName}</span>
                                </span>
                                { i.StandardsNames.length > 0 && <span className="text-xs text-secondary text-wrap ms-1">{i.StandardsNames.join(', ')}</span> }
                            </div>
                        );
                    })}
                </div>
            </td>
            <td>
                <div className="d-flex align-items-start flex-column gap-1">
                    { item.Standards.map(i => 
                        <div 
                            key={i.ID} 
                            className={ i.Status != DefaultStatusType.active || i.StandardStatus != DefaultStatusType.active ? 'opacity-6' : '' }
                            title={ i.Status != DefaultStatusType.active || i.StandardStatus != DefaultStatusType.active ? 'Inactive' : 'Active' }
                        >
                            <span className="text-xs font-weight-bold">{i.StandardName}</span>
                            <span className="text-xs text-secondary ms-1">{ auditStepProps[i.Step].abbreviation.toUpperCase() }</span>
                        </div>
                    )}
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-center align-items-center gap-2">
                    { 
                        !isNullOrEmpty(item.ExtraInfo) ? (
                            <FontAwesomeIcon icon={ faStickyNote } className="text-warning me-1" title={item.ExtraInfo} />
                        ) : (
                            <FontAwesomeIcon icon={ faStickyNote } className="text-secondary me-1" title="no extra info" />
                        )

                    }
                </div>
            </td>
        </tr>
    )
};

export default AuditTableItem;