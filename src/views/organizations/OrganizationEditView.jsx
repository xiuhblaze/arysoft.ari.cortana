import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import Swal from 'sweetalert2';

import { useOrganizationsStore } from "../../hooks/useOrganizationsStore";
import { Col, Container, Image, ListGroup, Row } from "react-bootstrap";
import { ViewLoading } from "../../components/Loaders";
import Status from "./components/Status";
import organizationStatusProps from "./helpers/organizationStatusProps";

import ContactsCard from "../contacts/components/ContactsCard";
import SitesCard from "../sites/components/SitesCard";

import imgHeaderBackground from '../../assets/img/bgminimal06.jpg';
import defaultPhoto from '../../assets/img/icoOrganizationDefault.jpg';
import primaryPhoto from '../../assets/img/icoOrganizationPrimary.jpg';
import envVariables from "../../helpers/envVariables";
import OrganizationEditCard from "./components/OrganizationEditCard";
//import CertificatesCard from "../certificates/components/CertificatesCard";
import enums from "../../helpers/enums";
import OrganizationStandardsCard from "./components/OrganizationStandardsCard";
import AuditCyclesCard from "../auditCycles/components/AuditCyclesCard";
import { useAuditCyclesStore } from "../../hooks/useAuditCyclesStore";
import { useAuditCycleDocumentsStore } from "../../hooks/useAuditCycleDocumentsStore";
import OrganizationModalEditItem from "./components/OrganizationModalEditItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faGlobe, faNoteSticky, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import getRandomNumber from "../../helpers/getRandomNumber";
import getRandomBackgroundImage from "../../helpers/getRandomBackgroundImage";
import isNullOrEmpty from "../../helpers/isNullOrEmpty";

const OrganiztionEditView = ({ applicantsOnly = false, ...props }) => {
    const {
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const { 
        DefaultStatusType,
        OrganizationStatusType
    } = enums();

    // CUSTOM HOOKS
    
    const [controller, dispatch] = useArysoftUIController();
    
    const { ROLES, hasRole } = useAuthStore();
    const {
        isOrganizationLoading,
        organization,
        organizationsErrorMessage,
        
        organizationAsync,
    } = useOrganizationsStore();

    const { 
        auditCycleClear,
        auditCyclesClear,
    } = useAuditCyclesStore();

    const {
        auditCycleDocumentsClear,
    } = useAuditCycleDocumentsStore();
    
    // HOOKS
    
    const { id } = useParams();

    // const [photoPreview, setPhotoPreview] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        //console.log('limpiando auditCycle');
        auditCyclesClear();
        auditCycleClear();
        auditCycleDocumentsClear();
    }, []);
    
        
    useEffect(() => {
        if (!!id) organizationAsync(id);
    }, [id]);

    useEffect(() => {
        if (!!organization) {
            setNavbarTitle(dispatch, organization.Name);
            getRandomBackgroundImage().then(image => setBackgroundImage(image));

            if (organization.Status == OrganizationStatusType.nothing) {
                //  console.log('es nuevo, mostrar la modal');
                setShowModal(true);
            }
        }
    }, [organization]);

    useEffect(() => {
        if (!!organizationsErrorMessage) {
            Swal.fire('Organization', organizationsErrorMessage, 'error');
        }
    }, [organizationsErrorMessage]);

    // METHODS

    // const updatePhotoPreview = (value) => {
    //     setPhotoPreview(value);
    // };

    const onShowModal = () => {
        // console.log('onShowModal');
        setShowModal(true);
    };

    const onCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Container fluid>
                <div
                    className="page-header min-height-200 border-radius-lg"
                    style={{
                        backgroundImage: `url(${backgroundImage ?? imgHeaderBackground})`,
                        backgroundPosition: 'center 50%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <span className={`mask bg-gradient-${isOrganizationLoading || !organization ? 'dark' : organizationStatusProps[organization.Status].bgColor} opacity-6`} />
                </div>
                <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center gap-3">
                        <div className="d-flex justify-content-start align-items-center gap-3"> 
                            <div className="avatar avatar-xl position-relative">
                                <Image
                                    src={!!organization && !!organization.LogoFile
                                        ? `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/${organization.LogoFile}?v=${getRandomNumber(4)}`
                                        : applicantsOnly
                                            ? primaryPhoto
                                            : defaultPhoto
                                    }
                                    className="border-radius-md"
                                    alt="Profile photo"
                                />
                            </div>
                            <div className="d-flex flex-column align-items-start">
                                <h5 className="mb-1">
                                    { !!organization?.Folio 
                                        ? <span className="text-danger me-2">
                                            { organization.Folio.toString().padStart(4, '0') }
                                          </span> 
                                        : '' 
                                    }
                                    { !!organization?.FolderFolio 
                                        ? <span className="text-secondary me-1" title="Folder folio">
                                            [{organization.FolderFolio.toString().padStart(2, '0')}]
                                          </span> 
                                        : ''
                                    } 
                                    {!!organization ? organization.Name : 'loading...'}
                                </h5>
                                <div className="mb-0 font-weight-bold text-sm">
                                    {
                                        !!organization && !!organization.Companies
                                        ? <div className="d-flex flex-wrap flex-column text-xs gap-1 mb-0">
                                            {
                                                organization.Companies.filter(c => c.Status == DefaultStatusType.active || c.Status == DefaultStatusType.inactive)
                                                    .map(c => 
                                                        <span 
                                                            key={c.ID} 
                                                            className={`text-wrap ${c.Status != DefaultStatusType.active ? 'text-secondary' : ''} me-1`}
                                                            title={c.Status != DefaultStatusType.active ? 'Inactive' : 'Active'}
                                                        >
                                                            {c.Name} - {c.LegalEntity}
                                                            { c.COID && <span className="text-xs text-secondary ms-1" title="COID">({c.COID})</span> }
                                                        </span>
                                                    )
                                            }
                                        </div>
                                        : null
                                    }
                                </div>
                                {
                                    !!organization ?
                                    <ListGroup horizontal className="border-0">
                                        <ListGroup.Item className="text-xs border-0 bg-transparent px-2 py-1">
                                            <FontAwesomeIcon icon={ faGlobe } className="me-1" fixedWidth />
                                            { isNullOrEmpty(organization.Website) ? '(no website)' : organization.Website }
                                        </ListGroup.Item>
                                        <ListGroup.Item className="text-xs border-0 bg-transparent px-2 py-1">
                                            <FontAwesomeIcon icon={ faPhone } className="me-1" fixedWidth />
                                            { isNullOrEmpty(organization.Phone) ? '(no phone)' : organization.Phone }
                                        </ListGroup.Item>
                                        <ListGroup.Item className="text-xs border-0 bg-transparent px-2 py-1">
                                            <FontAwesomeIcon icon={ faNoteSticky } 
                                                className={`me-1 ${ !!organization.Notes && organization.Notes.length > 0 ? 'text-warning' : 'text-secondary' }`} 
                                                fixedWidth 
                                                title={ !!organization.Notes && organization.Notes.length > 0 ? 'Notes' : 'No notes' }
                                            />
                                        </ListGroup.Item>
                                    </ListGroup> 
                                    : null
                                }
                            </div>
                        </div>
                        <div>
                            {
                                !!organization && 
                                <Status value={organization.Status} />
                            }
                            {
                                !!organization && 
                                (hasRole(ROLES.admin) || hasRole(ROLES.editor) || hasRole(ROLES.auditor)) ?
                                <button 
                                    className="btn btn-link h4 py-0 ps-4 pe-0 mb-0" 
                                    onClick={onShowModal}
                                    title="Edit organization"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="text-dark me-2" />
                                </button>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </Container>
            <Container fluid className="py-4 px-0 px-sm-4">
                {
                    isOrganizationLoading ? (
                        <ViewLoading />
                    ) : !!organization && (
                        <>
                            <OrganizationModalEditItem
                                show={showModal}
                                onHide={onCloseModal}
                            />
                            <Row>
                                <Col xs="12" sm="8" xxl="8">
                                    {/* <OrganizationEditCard
                                        updatePhotoPreview={updatePhotoPreview}
                                        className="h-100"
                                    /> */}
                                    <AuditCyclesCard organizationID={organization.ID} />
                                </Col>
                                <Col xs="12" sm="4" xxl="4">
                                    <Row className="mb-4">
                                        <Col xs="12">
                                            <OrganizationStandardsCard />
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col xs="12">
                                            <ContactsCard />
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col xs="12">
                                            <SitesCard />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {/* <Row className="mt-4">
                                <Col xs={12} sm={applicantsOnly ? 6 : 4}>
                                    <ContactsCard />
                                </Col>
                                <Col xs={12} sm={applicantsOnly ? 6 : 4}>
                                    <SitesCard />
                                </Col>                                
                            </Row> */}
                        </>
                    )
                }
            </Container>
        </>
    )
}

export default OrganiztionEditView;