import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone, faEdit, faEnvelope, faGlobe, faLocationDot, faLocationPin, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';

import certificateValidityStatusProps from '../../certificates/helpers/certificateValidityStatusProps';
import defaultPhoto from '../../../assets/img/icoOrganizationDefault.jpg';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import Status from './Status';
import organizationStatusProps from '../helpers/organizationStatusProps';

const OrganizationTableItem = ({ item, className, onShowModal, onShowQRModal, hideActions = false, ...props }) => {
    
    const {
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const {
        DefaultStatusType,
        CertificateValidityStatusType,
        OrganizationStatusType
    } = enums();
    const pathPhotoFilename = !!item.LogoFile
        ? `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${item.ID}/${item.LogoFile}`
        : defaultPhoto;

    const myClassName = item.Status != OrganizationStatusType.active
        ? !!className 
            ? `${className} table-${ organizationStatusProps[item.Status].bgColor } ${ organizationStatusProps[item.Status].className }` 
            : `table-${organizationStatusProps[item.Status].bgColor} ${ organizationStatusProps[item.Status].className }`
        : '';

    return (
        <tr {...props} className={myClassName}>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div className="avatar m-3" style={{ minWidth: '48px'}}>
                        <img className="border-radius-md shadow" src={ pathPhotoFilename } />
                    </div>
                    <div className="d-flex align-items-start flex-column justify-content-center">
                        <h6 className="mb-0 text-sm text-wrap">
                            <span className="text-danger me-2">{ !!item.Folio ? item.Folio.toString().padStart(4, '0') : '----' }</span>
                            { item.Name }
                        </h6>
                        {!!item.Companies
                            ? <div className="d-flex flex-wrap flex-column text-xs gap-1 mb-0">
                                { item.Companies
                                    .filter(c => c.Status === DefaultStatusType.active || c.Status === DefaultStatusType.inactive)
                                    .map(c => 
                                        <span 
                                            key={c.ID}
                                            className={`d-flex flex-wrap ${ c.Status != DefaultStatusType.active ? 'text-secondary' : '' } me-1`}
                                            title={ c.Status != DefaultStatusType.active ? 'Inactive' : 'Active' }
                                        >
                                            {c.Name} - {c.LegalEntity}
                                            { c.COID && <span className="text-xs text-secondary ms-1" title="COID">({c.COID})</span> }
                                        </span>) 
                                }
                            </div>
                            : null}
                    </div>
                </div>
            </td>
            {/* <td>
                <div className="align-middle text-center text-sm">
                {
                    !!item.Companies && item.Companies.length == 1 
                        ? <div className="d-flex flex-wrap text-xs gap-1 mb-0">
                            { item.Companies[0].LegalEntity }
                        </div>
                        : !!item.Companies && item.Companies.length > 1
                            ? <div className="d-flex flex-wrap text-xs gap-1 mb-0">
                                { item.Companies
                                    .map(c => 
                                        <span 
                                            key={c.ID}
                                            className={`d-flex flex-wrap ${ c.Status != DefaultStatusType.active ? 'text-secondary' : '' } me-1`}
                                            title={ c.Status != DefaultStatusType.active ? 'Inactive' : 'Active' }
                                        >
                                            {c.Name} - {c.LegalEntity}
                                        </span>) 
                                }
                            </div>
                            : null
                }
                </div> 
            </td>*/}
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
                        <a href={item.Website} title="Visit url" target='_blank'>
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
                <div className="d-flex flex-column align-items-start">
                    { !!item.SitesCount && <p className="text-xs font-weight-bold mb-0">Sites: { item.SitesCount }</p> }
                    { !!item.SitesEmployeesCount && <p className="text-xs text-secondary mb-0">Employees: { item.SitesEmployeesCount }</p> }
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-center align-items-center gap-1">
                    <FontAwesomeIcon
                        icon={ certificateValidityStatusProps[item.CertificatesValidityStatus].icon }
                        className={ `text-${certificateValidityStatusProps[item.CertificatesValidityStatus].variant}` }
                        size="lg"
                        title={ certificateValidityStatusProps[item.CertificatesValidityStatus].label }
                    />
                    {
                        !!item.Standards &&
                        <div className="d-flex flex-wrap text-xs gap-1 mb-0">
                            {
                                item.Standards.map(i => (
                                    <div key={i.ID} className={`badge bg-gradient-${i.Status == DefaultStatusType.active ? 'secondary' : 'light' } text-white me-1`}>
                                        { i.StandardName }
                                    </div>
                                ))
                            }
                        </div>
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