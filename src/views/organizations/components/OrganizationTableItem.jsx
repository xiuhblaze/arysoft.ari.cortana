import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faEdit, faEnvelope, faGlobe, faLocationDot, faLocationPin, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

import certificateValidityStatusProps from '../../certificates/helpers/certificateValidityStatusProps';
import defaultPhoto from '../../../assets/img/icoOrganizationDefault.jpg';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import Status from './Status';

const OrganizationTableItem = ({ item, className, onShowModal, onShowQRModal, hideActions = false, ...props }) => {

    const {
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const {
        CertificateValidityStatusType,
        OrganizationStatusType
    } = enums();
    const pathPhotoFilename = !!item.LogoFile
        ? `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${item.ID}/${item.LogoFile}`
        : defaultPhoto;

    return (
        <tr {...props} className={className}>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div className="avatar m-3" style={{ minWidth: '48px'}}>
                        <img className="border-radius-md shadow" src={ pathPhotoFilename } />
                    </div>
                    <div className="d-flex align-items-start flex-column justify-content-center">
                        <h6 className="mb-0 text-sm">{ item.Name }</h6>
                        <p className="text-xs mb-0">{ item.LegalEntity}</p>
                        {
                            !isNullOrEmpty(item.COID) &&
                            <p className="text-xs mb-0">COID: <strong>{ item.COID }</strong></p>
                        }
                    </div>
                </div>
            </td>
            <td>
                <div className="d-flex flex-column align-items-start">
                    {
                        !isNullOrEmpty(item.SiteLocation) &&
                        <div className="d-flex flex-row justify-content-start align-items-center mb-1">
                            <div className="me-1">
                                { !isNullOrEmpty(item.SiteLocationURL) 
                                    ? <a href={ item.SiteLocationURL } title="See address in maps" target='_blank'>
                                        <FontAwesomeIcon icon={ faLocationDot } className="text-dark" fixedWidth />
                                      </a>
                                    : <FontAwesomeIcon icon={ faLocationPin } className="text-secondary" title="No location" fixedWidth />
                                }
                            </div>
                            <div className="font-weight-bold text-dark text-xs text-wrap" title="Main site address">
                                { item.SiteLocation }
                            </div>
                        </div>
                    }
                { !!item.Website && 
                    <p className="text-xs font-weight-bold mb-0">
                        <a href={`https://${item.Website}`} title="Visit url" target='_blank'>
                            <FontAwesomeIcon icon={ faGlobe } className="me-1" fixedWidth />
                            { item.Website }
                        </a>
                    </p>
                }
                { !!item.Phone &&
                    <p className="text-xs mb-0">
                        <a className="text-secondary" href={`tel:${ item.Phone}`} title="Use to call">
                        <FontAwesomeIcon icon={ faPhone } className="me-1" fixedWidth />
                            { item.Phone }
                        </a>
                    </p>
                }
                </div>
            </td>
            <td>
                <div className="d-flex flex-column align-items-start">
                    { !!item.ContactName && 
                        <p className="text-xs font-weight-bold mb-0">
                            <FontAwesomeIcon icon={ faUser } fixedWidth className="me-1" />
                            { item.ContactName }
                        </p>
                    }
                    { !!item.ContactEmail &&
                        <p className="text-xs text-secondary mb-0">
                            <a href={ `mailto:${item.ContactEmail}` } title="Send email">
                                <FontAwesomeIcon icon={ faEnvelope } fixedWidth className="me-1" />
                                { item.ContactEmail}
                            </a>
                        </p>
                    }
                    { !!item.ContactPhone &&
                        <p className="text-xs text-secondary mb-0">
                            <a href={ `tel:${item.ContactPhone}` } title="Call">
                                <FontAwesomeIcon icon={ faPhone } fixedWidth className="me-1" />
                                { item.ContactPhone}
                            </a>
                        </p>
                    }
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-center gap-1">
                    <FontAwesomeIcon
                        icon={ certificateValidityStatusProps[item.CertificatesValidityStatus].icon }
                        className={ `text-${certificateValidityStatusProps[item.CertificatesValidityStatus].variant}` }
                        size="lg"
                        title={ certificateValidityStatusProps[item.CertificatesValidityStatus].label }
                    />
                </div>
            </td>
            <td>
                <div className="align-middle text-center text-sm">
                { !!item.QRFile && 
                    <img 
                        src={`${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${item.ID}/${item.QRFile}`} 
                        style={{ maxWidth: '48px', cursor: 'pointer' }}
                        className="img-fluid" 
                        alt="QR code"
                        onClick={() => onShowQRModal()}
                    />
                }
                </div>
            </td>
            <td>
                <div className="align-middle text-center text-sm">
                    <Status value={ item.Status } />
                </div>
            </td>
            {
                !hideActions && 
                <td>
                    <div className="d-flex justify-content-center gap-2">
                        <a href="#" onClick={() => onShowModal(item.ID)} title="Details">
                            <FontAwesomeIcon icon={faClone} />
                        </a>
                        {item.Status !== OrganizationStatusType.deleted && (
                            <Link to={`${item.ID}`} title="Edit">
                                <FontAwesomeIcon icon={faEdit} />
                            </Link>
                        )}
                    </div>
                </td>
            }
        </tr>
    );
} // OrganizationTableItem

export default OrganizationTableItem;