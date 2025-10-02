import { Link } from 'react-router-dom';

import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEdit, faEnvelope, faGlobe, faLandmark, faLocationDot, faLocationPin, faPhone, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

import defaultPhoto from '../../../assets/img/icoOrganizationDefault.jpg';
import primaryPhoto from '../../../assets/img/icoOrganizationPrimary.jpg';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import isNullOrEmpty from '../../../helpers/isNullOrEmpty';
import Status from './Status';
import organizationStatusProps from '../helpers/organizationStatusProps';
import auditStatusProps from '../../audits/helpers/auditStatusProps';
import getRandomNumber from '../../../helpers/getRandomNumber';

const OrganizationsTableItem = ({ item, className, applicantsOnly = false, onShowModal, ...props }) => {
    
    const {
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const {
        DefaultStatusType,
        OrganizationStatusType
    } = enums();
    const pathPhotoFilename = !!item.LogoFile
        ? `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${item.ID}/${item.LogoFile}?v=${ getRandomNumber(4) }`
        : applicantsOnly
            ? primaryPhoto
            : defaultPhoto;

    const myClassName = item.Status != OrganizationStatusType.active && item.Status != OrganizationStatusType.applicant
        ? !!className 
            ? `${className} table-${ organizationStatusProps[item.Status].bgColor } ${ organizationStatusProps[item.Status].className }` 
            : `table-${organizationStatusProps[item.Status].bgColor} ${ organizationStatusProps[item.Status].className }`
        : '';

    return (
        <tr {...props} className={myClassName}>
            <td>
                <div className="d-flex justify-content-center aling-items-center">
                    <Link to={`${item.ID}`} title="Edit" className="text-dark">
                        <FontAwesomeIcon icon={faEdit} />
                    </Link>
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center me-2">
                    <div className="avatar me-3" style={{ minWidth: '48px'}}>
                        <img className="border-radius-md shadow" src={ pathPhotoFilename } />
                    </div>
                    <div className="d-flex align-items-start flex-column justify-content-center">
                        <h6 className="mb-0 text-sm text-wrap">
                            <span className="text-danger me-1">{ !!item.Folio ? item.Folio.toString().padStart(4, '0') : '----' }</span>                            
                            { item.FolderFolio ? <span className="text-secondary me-1" title="Folder folio">[{item.FolderFolio.toString().padStart(2, '0')}]</span> : ''} 
                            { item.Name }
                        </h6>
                        {!!item.Companies
                            ? <div className="d-flex flex-wrap flex-column text-xs gap-1 mb-0">
                                { item.Companies
                                    .filter(c => c.Status === DefaultStatusType.active || c.Status === DefaultStatusType.inactive)
                                    .map(c => 
                                        <span 
                                            key={c.ID}
                                            className={`text-wrap ${ c.Status != DefaultStatusType.active ? 'text-secondary' : '' } me-1`}
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
            <td>
                <div className="d-flex flex-column align-items-start">
                    { !!item.MainSite ? <div className="d-flex flex-row justify-content-start align-items-top mb-1">
                        <div className="me-1">
                            { 
                                isNullOrEmpty(item.MainSite.LocationURL) 
                                ? <FontAwesomeIcon icon={ faLocationPin } className="text-secondary" />
                                : <a href={ item.MainSite.LocationURL } title="See address in maps" target='_blank'>
                                    <FontAwesomeIcon icon={ faLocationDot } className="text-primary text-gradient" />
                                  </a>
                            }
                        </div>
                        <div className="font-weight-bold text-dark text-xs text-wrap pt-1" title="Main site address">
                            { item.MainSite.Address } - { item.MainSite.Country }
                        </div>
                    </div> : null }
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
                            <a href={`tel:${ item.Phone}`} title="Use to call">
                                <FontAwesomeIcon icon={ faPhone } className="me-1" fixedWidth />
                                { item.Phone }
                            </a>
                        </p>
                    }
                    {
                        item.SitesCount || item.SitesEmployeesCount
                            ? <p className="text-xs text-secondary mb-0">
                                { !!item.SitesCount && <span className="font-weight-bold me-3 mb-0">
                                    <FontAwesomeIcon icon={ faBuilding } fixedWidth className="me-1" />
                                    Sites: { item.SitesCount }
                                </span> }
                                { !!item.SitesEmployeesCount && <span className="text-secondary mb-0">
                                    <FontAwesomeIcon icon={ faUsers } fixedWidth className="me-1" />
                                    Employees: { item.SitesEmployeesCount }
                                </span> }
                            </p>
                            : null
                    }
                </div>
            </td>
            <td>
                <div className="d-flex flex-column align-items-start">
                    { !!item.MainContact ? <>
                        <div className="d-flex justify-content-start text-xs"> 
                            <FontAwesomeIcon icon={ faUser } fixedWidth className="me-1" />
                            <div className="d-flex flex-column align-items-start">
                                <span className="text-dark text-wrap font-weight-bold mb-0">{ item.MainContact.FullName }</span>
                                <span className="text-wrap">{ item.MainContact.Position }</span>
                            </div>
                        </div>
                        { !!item.MainContact.Email &&
                            <p className="text-xs text-secondary mb-0">
                                <a href={ `mailto:${item.MainContact.Email}` } title="Send email">
                                    <FontAwesomeIcon icon={ faEnvelope } fixedWidth className="me-1" />
                                    { item.MainContact.Email}
                                </a>
                            </p>
                        }
                        { !!item.MainContact.Phone &&
                            <p className="text-xs text-secondary mb-0">
                                <a href={ `tel:${item.MainContact.Phone}` } title="Call">
                                    <FontAwesomeIcon icon={ faPhone } fixedWidth className="me-1" />
                                    { item.MainContact.Phone}
                                </a>
                            </p>
                        }
                    </> : null }
                </div>
            </td>
            { applicantsOnly ? null : 
                <td>
                    { !!item.NextAudit ? <div className="d-flex flex-column align-items-start">
                        <div className="d-flex flex-row justify-content-start align-items-top mb-1">
                            <div className="me-1">
                                <FontAwesomeIcon 
                                    icon={ auditStatusProps[item.NextAudit.Status].icon } 
                                    className={`text-${auditStatusProps[item.NextAudit.Status].variant}`}
                                    title={auditStatusProps[item.NextAudit.Status].label}
                                />
                            </div>
                            <div className="d-flex flex-column align-items-start">
                                <div className="font-weight-bold text-dark text-xs text-wrap pt-1">                            
                                    {item.NextAudit.Description}
                                </div>
                                <div className="text-xs text-secondary mb-0">
                                    {format(new Date(item.NextAudit.StartDate), 'dd/MM/yyyy')} - {format(new Date(item.NextAudit.EndDate), 'dd/MM/yyyy')}
                                </div>
                            </div>
                        </div>
                        { !!item.NextAudit.Standards ? <div className="text-xs text-wrap mb-0">
                            <FontAwesomeIcon icon={ faLandmark } className="me-1" fixedWidth />
                            { item.NextAudit.Standards
                                .filter(i => i.Status == DefaultStatusType.active && i.StandardStatus == DefaultStatusType.active)
                                .map(i => i.StandardName).join(', ') }
                        </div> : null } 
                        { !!item.NextAudit.Auditors ? <div className="text-xs text-wrap mb-0">
                            <FontAwesomeIcon icon={ faUsers } className="me-1" fixedWidth />
                            { item.NextAudit.Auditors
                                .filter(i => i.Status == DefaultStatusType.active)
                                .map(i => i.AuditorName).join(', ') }
                        </div> : null }
                    </div> : null }
                </td>
            }
            <td>
                <div className="d-flex justify-content-center align-items-center gap-1">
                    {
                        !!item.Standards &&
                        <div className="d-flex justify-content-center align-items-center flex-wrap text-xs gap-1 mb-0">
                            {
                                item.Standards.map(i => (
                                    <div key={i.ID} className={`badge bg-gradient-${(i.Status == DefaultStatusType.active && i.StandardStatus == DefaultStatusType.active) ? 'secondary' : 'light' } text-white me-1`}>
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
            <td>
                <div className="d-flex justify-content-center mx-1 gap-2">
                    {/* <a href="#" onClick={() => onShowModal(item.ID)} title="Details">
                        <FontAwesomeIcon icon={faClone} />
                    </a> */}
                    <Link to={`${item.ID}`} title="Edit" className="text-dark">
                        <FontAwesomeIcon icon={faEdit} />
                    </Link>
                </div>
            </td>
        </tr>
    );
} // OrganizationsTableItem

export default OrganizationsTableItem;