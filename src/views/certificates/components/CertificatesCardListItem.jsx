import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, ListGroupItem, Row } from "react-bootstrap";
import { useOrganizationsStore } from "../../../hooks/useOrganizationsStore";
import CertificateEditModal from "./CertificateEditModal";
import certificateValidityStatusProps from "../helpers/certificateValidityStatusProps";
import envVariables from "../../../helpers/envVariables";
import enums from "../../../helpers/enums";
import { certificateStatusProps } from "../helpers/certificateStatusProps";
import { faBackwardStep, faCertificate, faForwardStep, faNoteSticky, faStar, faPlay, faStop, faGear, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import certificateActionPLanValidityStatusProps from "../helpers/certificateActionPlanValidityStatusProps";

const CertificatesCardListItem = ({ item, readOnly = false, ...props }) => {
    const { 
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
    } = envVariables();
    const { 
        CertificateStatusType,
        DefaultStatusType,
        DefaultValidityStatusType,
    } = enums();

    // const auditPlanValidityStatusProps = [
    //     { label: 'No needed action plan', value: DefaultValidityStatusType.nothing, variant: 'secondary' },
    //     { label: 'The action plan is delivered susccessfully', value: DefaultValidityStatusType.success, variant: 'success' },
    //     { label: 'Action must be delivered', value: DefaultValidityStatusType.warning, variant: 'warning' },
    //     { label: 'The action plan is not delivered', value: DefaultValidityStatusType.danger, variant: 'danger' },
    // ];

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    if (!organization) return null;

    const url = `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/certificates`;    
    const fileName = !!item.Filename // && !!checkFileExists(`${url}/${item.Filename}`)
        ? `${url}/${item.Filename}`
        : null;
    const itemStyle = `border-0 d-flex justify-content-between align-items-center px-0 mb-2 gap-2 ${ item.Status != CertificateStatusType.active 
        ? 'opacity-6' 
        : '' }`;
    const itemIconStyle = `icon icon-md icon-shape bg-gradient-${ item.Status == CertificateStatusType.active 
        ? certificateValidityStatusProps[item.ValidityStatus].variant 
        : certificateStatusProps[item.Status].variant } border-radius-md d-flex align-items-center justify-content-center me-3`;


    return (
        <ListGroupItem {...props} className={itemStyle}>
            <div className="d-flex justify-content-start align-items-top w-100">
                <div>
                    {
                        !!fileName ? (
                            <a href={ fileName } target="_blank" title="View certificate file">
                                <div 
                                    className={ itemIconStyle}
                                    title={ item.Status == CertificateStatusType.active 
                                        ? certificateValidityStatusProps[item.ValidityStatus].singularLabel 
                                        : certificateStatusProps[item.Status].label }
                                >
                                    <FontAwesomeIcon icon={ faCertificate } size="lg" className="opacity-10 text-white" aria-hidden="true" />
                                </div>    
                            </a>
                        ) : (
                            <div 
                                className={`${ itemIconStyle } opacity-5`}
                                title={ item.Status === CertificateStatusType.active 
                                    ? certificateValidityStatusProps[item.ValidityStatus].singularLabel 
                                    : certificateStatusProps[item.Status].label }
                            >
                                <FontAwesomeIcon icon={ faCertificate } size="lg" className="opacity-10 text-white" aria-hidden="true" />
                            </div>
                        )
                    }
                </div>
                <div className="w-100">
                    <h6 className="mb-0 text-sm">
                        { item.StandardName }
                        {
                            !!item.Comments 
                            ? <FontAwesomeIcon icon={ faNoteSticky } className="text-warning ms-1" title={ item.Comments } />
                            : <FontAwesomeIcon icon={ faNoteSticky } className="text-secondary ms-1" title="(no comments)" />
                        }
                    </h6>
                    <Row>
                        <Col xs="12" sm="6">
                            <div 
                                className="d-flex flex-row justify-content-start align-items-center text-xs gap-1"
                                title="Start date"
                            >
                                <FontAwesomeIcon icon={ faPlay } className="text-success me-1" />    
                                <div>
                                   { new Date(item.StartDate).toLocaleDateString() }
                                </div>
                            </div>
                        </Col>
                        <Col xs="12" sm="6">
                            <div 
                                className="d-flex flex-row justify-content-start align-items-center text-xs gap-1"
                            >
                                <FontAwesomeIcon icon={ faStop } className="text-secondary me-1" title="Due date" />
                                <div 
                                    className={`text-${ item.Status == DefaultStatusType.active ? certificateValidityStatusProps[item.ValidityStatus].variant : 'secondary' }`}
                                    title={ certificateValidityStatusProps[item.ValidityStatus].singularLabel }
                                >
                                    { new Date(item.DueDate).toLocaleDateString() }
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                            <div className="d-flex flex-row justify-content-between align-items-center text-xs gap-1">
                                <div className="d-flex flex-row">
                                    <FontAwesomeIcon icon={ faBackwardStep } 
                                        className="text-secondary me-1"
                                        title="Previous audit date"
                                    />
                                    <div>
                                        {
                                            !!item.PrevAuditDate && new Date(item.PrevAuditDate).toLocaleDateString()
                                        }
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={ faNoteSticky } 
                                    className={`${ !!item.PrevAuditNote ? 'text-warning' : 'text-secondary' } ms-1`}
                                    title={ !!item.PrevAuditNote ? item.PrevAuditNote : '(no note)' }
                                />
                            </div>
                        </Col>
                        <Col xs="12" sm="6">
                            <div className="d-flex flex-row justify-content-between align-items-center text-xs gap-1">
                                <div className="d-flex flex-row">
                                    <FontAwesomeIcon icon={ faForwardStep } 
                                        className="text-secondary me-1"
                                        title="Next audit date"
                                    />
                                    <div className="d-flex flex-row">
                                        {
                                            !!item.NextAuditDate && new Date(item.NextAuditDate).toLocaleDateString()
                                        }
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={ faNoteSticky } 
                                    className={`${ !!item.NextAuditNote ? 'text-warning' : 'text-secondary' } me-1`}
                                    title={ !!item.NextAuditNote ? item.NextAuditNote : '(no note)' }
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="6">
                            <div className="d-flex flex-row justify-content-start align-items-center text-xs gap-1">
                                NCs: 
                                <FontAwesomeIcon 
                                    className={ item.HasNCsMinor ? 'text-warning' : 'text-secondary' }
                                    icon={ faTriangleExclamation }
                                    title={ item.HasNCsMinor ? 'Has NCs Minor' : 'Has no NCs Minor' }
                                />
                                <FontAwesomeIcon 
                                    className={ item.HasNCsMajor ? 'text-danger' : 'text-secondary' }
                                    icon={ faTriangleExclamation }
                                    title={ item.HasNCsMajor ? 'Has NCs Major' : 'Has no NCs Major' }
                                />
                                <FontAwesomeIcon 
                                    className={ item.HasNCsCritical ? 'text-danger' : 'text-secondary' }
                                    icon={ faTriangleExclamation }
                                    title={ item.HasNCsCritical ? 'Has NCs Critical' : 'Has no NCs Critical' }
                                />
                            </div>
                        </Col>
                        <Col xs="12" sm="6">
                            <div 
                                className="d-flex flex-row justify-content-start align-items-center text-xs gap-1"
                                title={ certificateActionPLanValidityStatusProps[item.AuditPlanValidityStatus].singularLabel }
                            >
                                <FontAwesomeIcon icon={ faGear } />
                                <div 
                                    className={`d-flex flex-row text-${ item.Status == DefaultStatusType.active ? certificateActionPLanValidityStatusProps[item.AuditPlanValidityStatus].variant : 'secondary' }`}>
                                    {
                                        !!item.ActionPlanDate && new Date(item.ActionPlanDate).toLocaleDateString()
                                    }
                                </div>
                            </div>  
                        </Col>
                    </Row>
                </div>
            </div>
            {!readOnly && <CertificateEditModal id={item.ID} />}
        </ListGroupItem>
    );
};

export default CertificatesCardListItem;