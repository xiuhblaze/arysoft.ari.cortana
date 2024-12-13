import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faEdit, faEnvelope, faFile, faFileCircleCheck, faFileCircleExclamation, faFileCircleXmark, faPhone } from '@fortawesome/free-solid-svg-icons'

import envVariables from '../../../helpers/envVariables'
import AryDefaultStatusBadge from '../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import defaultProfile from '../../../assets/img/phoDefaultProfile.jpg';
import auditorValidityProps from '../helpers/auditorValidityProps';
import auditorRequiredProps from '../helpers/auditorRequiredProps';

const AuditorsTableItem = ({ item, className, onShowModal, hideActions = false, ...props }) => {
    const { URI_AUDITOR_FILES } = envVariables();
    const pathPhotoFilename = !!item.PhotoFilename 
        ? `${URI_AUDITOR_FILES}/${item.ID}/${item.PhotoFilename}` 
        : defaultProfile;

    // const validityStatusStyle = [
    //     { icon: faFile, label: '-', color: 'text-light', bgColor: 'bg-gradient-light' },
    //     { icon: faFileCircleCheck , label: 'All documents are current', color: 'text-success shadow-xs', bgColor: 'bg-gradient-success' },
    //     { icon: faFileCircleExclamation ,label: 'At least one document is close to expired', color: 'text-warning shadow-xs', bgColor: 'bg-gradient-warning' },
    //     { icon: faFileCircleXmark , label: 'At least one document has expired', color: 'text-danger shadow-xs', bgColor: 'bg-gradient-danger' },
    // ];

    // const requiredStatusStyle = [
    //     { icon: faFile, label: '-', color: 'text-light', bgColor: 'bg-gradient-light' },
    //     { icon: faFileCircleCheck, label: 'All required documents are up to date', color: 'text-dark shadow-xs', bgColor: 'bg-gradient-dark' },
    //     { icon: faFileCircleXmark, label: 'At least one required document is missing', color: 'text-secondary shadow-xs', bgColor: 'bg-gradient-secondary' },
    // ];
    
    return (
        <tr { ...props }>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div className="avatar m-3" style={{ minWidth: '48px' }}>
                        <img className="border-radius-md shadow" src={ pathPhotoFilename } />
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
                        icon={ auditorValidityProps[item.ValidityStatus].iconFile } 
                        className={ `text-${auditorValidityProps[item.ValidityStatus].variant}` } 
                        size="lg" 
                        title={ auditorValidityProps[item.ValidityStatus].label }
                    />
                    <FontAwesomeIcon 
                        icon={ auditorRequiredProps[item.RequiredStatus].icon } 
                        className={ `text-${auditorRequiredProps[item.RequiredStatus].variant}` } 
                        size="lg"
                        title={ auditorRequiredProps[item.RequiredStatus].label } 
                    />
                </div>
            </td>
            <td className="align-middle text-center text-sm">
                <AryDefaultStatusBadge value={ item.Status } />
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