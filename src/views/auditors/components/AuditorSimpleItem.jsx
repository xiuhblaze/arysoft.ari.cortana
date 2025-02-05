import enums from "../../../helpers/enums";
import envVariables from "../../../helpers/envVariables";
import defaultPhotoProfile from "../../../assets/img/phoDefaultProfile.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faHome, faPhone, faSplotch } from "@fortawesome/free-solid-svg-icons";
import defaultStatusProps from "../../../helpers/defaultStatusProps";

const AuditorSimpleItem = ({ item, size="md", className, ...props }) => { 
    
    if (!item) return null;
    
    const { 
        FullName,
        PhotoFilename,
        IsLeadAuditor,
        Phone,
        Email,
        Address,
        Status
    } = item;
    
    const { 
        URL_AUDITOR_FILES,
        VITE_FILES_URL
    } = envVariables();
    const {
        DefaultStatusType
    } = enums();

    const pathPhotoFilename = !!PhotoFilename && !!item.ID 
        ? `${VITE_FILES_URL}${URL_AUDITOR_FILES}/${item.ID}/${PhotoFilename}` 
        : defaultPhotoProfile;
    const minWidth = size == 'lg' ? '58px'
        : size == 'sm' ? '36px'
        : size == 'xs' ? '24px' 
        : '48px';
    const classAvatar = size == 'xxl' ? 'avatar avatar-xxl'
        : size == 'xl' ? 'avatar avatar-xl'
        : size == 'lg' ? 'avatar avatar-lg'
        : size == 'sm' ? 'avatar avatar-sm'
        : size == 'xs' ? 'avatar avatar-xs'
        : 'avatar';
    const containerClassName = `d-flex align-items-center${ !!className ? ' ' + className : '' }`;

    return (
        <div {...props } className={ containerClassName }>
            <div className={`${classAvatar} me-3`} style={{ minWidth }}>
                <img className="border-radius-md shadow" src={ pathPhotoFilename } />
            </div>
            <div className="d-flex align-items-start flex-column justify-content-center">
                <h6 className={`mb-0 text-sm`}>
                    { FullName }
                    { !!IsLeadAuditor && <FontAwesomeIcon icon={ faSplotch } className="text-warning ms-1" title="Is lead auditor" /> }
                </h6>
                {
                    !!Phone || !!Email || !!Address ? 
                    <div className="d-flex justify-content-start align-items-center text-xs gap-1">
                        {
                            size == 'sm' || size == 'xs' ? (
                                <>
                                    {!!Phone && <FontAwesomeIcon icon={ faPhone } className="me-1" title={ Phone } />}
                                    {!!Email && <FontAwesomeIcon icon={ faEnvelope } className="me-1" title={ Email } />}
                                    {!!Address && <FontAwesomeIcon icon={ faHome } className="me-1" title={ Address } />}
                                </>
                            ) : <>
                                { !!Phone ? <div className="d-flex flex-row align-items-center"><FontAwesomeIcon icon={ faPhone } className="me-1" />{Phone}</div> : '' }
                                { !!Email ? <div className="d-flex flex-row align-items-center"><FontAwesomeIcon icon={ faEnvelope } className="me-1" />{Email}</div> : '' }                        
                                { !!Address ? <div className="d-flex flex-row align-items-center"><FontAwesomeIcon icon={ faHome } className="me-1" />{Address}</div> : '' }
                            </>
                        }
                    </div>
                    : null
                }
                <div className="progress-wrapper w-100 mt-1" title={ defaultStatusProps[Status].label }>
                    <div className="progress">
                        <div className={`progress-bar bg-gradient-${ defaultStatusProps[Status].variant }`} role="progressbar" style={{ width: '100%', height: '2px' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditorSimpleItem;