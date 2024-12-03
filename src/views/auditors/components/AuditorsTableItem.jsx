import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faEdit, faEnvelope, faFile, faFileCircleCheck, faFileCircleExclamation, faFileCircleXmark, faPhone } from '@fortawesome/free-solid-svg-icons'

import envVariables from '../../../helpers/envVariables'

const AuditorsTableItem = ({ item, className, onShowModal, hideActions = false, ...props }) => {
    const { URI_AUDITOR_FILES } = envVariables();
    const pathPhotoFilename = `${URI_AUDITOR_FILES}/${item.ID}/${item.PhotoFilename}`;

    const statusStyle = [
        { label: '-', bgColor: 'bg-gradient-light' },
        { label: 'Active', bgColor: 'bg-gradient-success' },
        { label: 'Inactive', bgColor: 'bg-gradient-secondary' },
        { label: 'Deleted', bgColor: 'bg-gradient-danger' },
    ];

    const validityStatusStyle = [
        { icon: faFile, label: '-', color: 'text-light', bgColor: 'bg-gradient-light' },
        { icon: faFileCircleCheck , label: 'All documents are current', color: 'text-success', bgColor: 'bg-gradient-success' },
        { icon: faFileCircleExclamation ,label: 'At least one document is close to expired', color: 'text-warning', bgColor: 'bg-gradient-warning' },
        { icon: faFileCircleXmark , label: 'At least one document has expired', color: 'text-danger', bgColor: 'bg-gradient-danger' },
    ];

    const requiredStatusStyle = [
        { icon: faFile, label: '-', color: 'text-light', bgColor: 'bg-gradient-light' },
        { icon: faFileCircleCheck, label: 'All required documents are up to date', color: 'text-success', bgColor: 'bg-gradient-success' },
        { icon: faFileCircleXmark, lable: 'At least one required document is missing', color: 'text-danger', bgColor: 'bg-gradient-danger' },
    ];
    
    return (
        <tr { ...props }>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div className="avatar m-3">
                        <img className="border-radius-lg shadow" src={ pathPhotoFilename } />
                    </div>
                    <div className="d-flex align-items-start flex-column justify-content-center">
                        <h6 className={`mb-0 text-sm ${ item.IsLeadAuditor ? 'text-info text-gradient' : '' }`}>{ item.FullName }</h6>
                        <p className="mb-0 text-xs d-flex flex-column gap-1">
                            { item.Address }
                        </p>
                    </div>
                </div>
            </td>
            <td>
                { !!item.Email && 
                    <p className="text-xs font-weight-bold mb-0">
                        <a className="text-secondary" href={`mailto:${ item.Email}`} title="Send mail">
                            <FontAwesomeIcon icon={ faEnvelope } className="me-1" fixedWidth />
                            { item.Email }
                        </a>
                    </p>
                }
                { !!item.Phone &&
                    <p className="text-xs text-secondary mb-0">
                        <a className="text-secondary" href={`tel:${ item.Phone}`} title="Use to call">
                        <FontAwesomeIcon icon={ faPhone } className="me-1" fixedWidth />
                            { item.Phone }
                        </a>
                    </p>
                }
            </td>
            <td>
                <div className="d-flex justify-content-center gap-1">
                    
                    <FontAwesomeIcon 
                        icon={ validityStatusStyle[item.ValidityStatus].icon } 
                        className={ validityStatusStyle[item.ValidityStatus].color } 
                        size="lg" 
                        title={ validityStatusStyle[item.ValidityStatus].label }
                    />
                    
                    <FontAwesomeIcon 
                        icon={ requiredStatusStyle[item.RequiredStatus].icon } 
                        className={ requiredStatusStyle[item.RequiredStatus].color } 
                        size="lg"
                        title={ requiredStatusStyle[item.RequiredStatus].label } 
                    />
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-center gap-1">
                    <span className={`badge badge-sm ${ statusStyle[item.Status].bgColor }`}>
                        { statusStyle[item.Status].label }
                    </span>
                </div>
            </td>
            {
                !hideActions && 
                <td>
                    <div className="d-flex justify-content-center gap-2">
                        <a href="#" onClick={ onShowModal } title="Details">
                            <FontAwesomeIcon icon={ faClone } />
                        </a>
                        <Link to={ item.ID } title="Edit">
                            <FontAwesomeIcon icon={ faEdit } />
                        </Link>
                    </div>
                </td>
            }
        </tr>
    )
}

export default AuditorsTableItem