import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCertificate, faClone, faEdit, faEnvelope, faPhone, faSplotch } from '@fortawesome/free-solid-svg-icons'

import envVariables from '../../../helpers/envVariables'
import AryDefaultStatusBadge from '../../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';
import defaultProfile from '../../../assets/img/phoDefaultProfile.jpg';
import auditorValidityProps from '../helpers/auditorValidityProps';
import auditorRequiredProps from '../helpers/auditorRequiredProps';

const AuditorsTableItem = ({ item, className, onShowModal, hideActions = false, ...props }) => {
    const { 
        URL_AUDITOR_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const pathPhotoFilename = !!item.PhotoFilename 
        ? `${VITE_FILES_URL}${URL_AUDITOR_FILES}/${item.ID}/${item.PhotoFilename}` 
        : defaultProfile;

    return (
        <tr { ...props }>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div className="avatar m-3" style={{ minWidth: '48px' }}>
                        <img className="border-radius-md shadow" src={ pathPhotoFilename } />
                    </div>
                    <div className="d-flex align-items-start flex-column justify-content-center">
                        <h6 className={`mb-0 text-sm`}>
                            { item.FullName }
                            { item.IsLeadAuditor &&
                                <FontAwesomeIcon icon={ faSplotch } className="text-warning ms-1" title="Is lead auditor" />
                            }
                        </h6>
                        <p className="text-xs mb-0">
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