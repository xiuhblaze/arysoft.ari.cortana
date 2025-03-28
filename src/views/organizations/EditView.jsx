import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import Swal from 'sweetalert2';

import { useOrganizationsStore } from "../../hooks/useOrganizationsStore";
import { Col, Container, Image, Row } from "react-bootstrap";
import { ViewLoading } from "../../components/Loaders";
import Status from "./components/Status";
import organizationStatusProps from "./helpers/organizationStatusProps";

import ContactsCard from "../contacts/components/ContactsCard";
import SitesCard from "../sites/components/SitesCard";

import imgHeaderBackground from '../../assets/img/bgWavesWhite.jpg';
import defaultPhoto from '../../assets/img/icoOrganizationDefault.jpg';
import envVariables from "../../helpers/envVariables";
import OrganizationEditCard from "./components/OrganizationEditCard";
//import CertificatesCard from "../certificates/components/CertificatesCard";
import enums from "../../helpers/enums";
import OrganizationStandardsCard from "./components/OrganizationStandardsCard";
import AuditCyclesCard from "../auditCycles/components/AuditCyclesCard";
import { useAuditCyclesStore } from "../../hooks/useAuditCyclesStore";
import { useAuditCycleDocumentsStore } from "../../hooks/useAuditCycleDocumentsStore";

const EditView = ({ applicantsOnly = false, ...props }) => {
    const {
        URL_ORGANIZATION_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const { 
        OrganizationStatusType
    } = enums();

    // CUSTOM HOOKS
    
    const [controller, dispatch] = useArysoftUIController();
    
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

    const [photoPreview, setPhotoPreview] = useState(null);

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
        }
    }, [organization]);

    useEffect(() => {
        if (!!organizationsErrorMessage) {
            Swal.fire('Organization', organizationsErrorMessage, 'error');
        }
    }, [organizationsErrorMessage]);

    // METHODS

    const updatePhotoPreview = (value) => {
        setPhotoPreview(value);
    };

    return (
        <>
            <Container fluid>
                <div
                    className="page-header min-height-200 border-radius-lg"
                    style={{
                        background: `url(${imgHeaderBackground})`,
                        backgroundPositionY: '50%'
                    }}
                >
                    <span className={`mask bg-gradient-${isOrganizationLoading || !organization ? 'dark' : organizationStatusProps[organization.Status].bgColor} opacity-6`} />
                </div>
                <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                    <Row className="gx-4">
                        <div className="col-auto">
                            <div className="avatar avatar-xl position-relative">
                                <Image
                                    src={!!photoPreview
                                        ? photoPreview
                                        : !!organization && !!organization.LogoFile
                                            ? `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/${organization.LogoFile}`
                                            : defaultPhoto
                                    }
                                    className="border-radius-md"
                                    alt="Profile photo"
                                />
                            </div>
                        </div>
                        <div className="col-auto my-auto">
                            <div className="h-100">
                                <h5 className="mb-1">
                                    { !!organization?.Folio 
                                        ? <span className="text-danger me-2">
                                            { organization.Folio.toString().padStart(4, '0') }
                                          </span> 
                                        : '' 
                                    }
                                    {!!organization ? organization.Name : '(new organization)'}
                                </h5>
                                <p className="mb-0 font-weight-bold text-sm">
                                    {!!organization ? organization.LegalEntity : ''}
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3 text-end">
                            {
                                !!organization && 
                                <Status value={organization.Status} />
                            }
                        </div>
                    </Row>
                </div>
            </Container>
        <Container fluid className="py-4 px-0 px-sm-4">
            {
                isOrganizationLoading ? (
                    <ViewLoading />
                ) : !!organization && (
                    <>
                        <Row>
                            <Col xs="12" sm="6" xxl="6">
                                <OrganizationEditCard
                                    updatePhotoPreview={updatePhotoPreview}
                                    className="h-100"
                                />
                            </Col>
                            <Col xs="12" sm="6" xxl="6">
                                <Row className="mb-4">
                                    <Col xs="12">
                                        <OrganizationStandardsCard />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12">
                                        <AuditCyclesCard organizationID={organization.ID} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col xs={12} sm={applicantsOnly ? 6 : 4}>
                                <ContactsCard />
                            </Col>
                            <Col xs={12} sm={applicantsOnly ? 6 : 4}>
                                <SitesCard />
                            </Col>
                            {/* {
                                !applicantsOnly &&
                                <Col xs={12} sm={4}>
                                    <CertificatesCard />
                                </Col>
                            } */}
                        </Row>
                    </>
                )
            }
            
        </Container>
        </>
    )
}

export default EditView;