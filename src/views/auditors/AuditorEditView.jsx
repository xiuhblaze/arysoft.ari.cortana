import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { setHelpContent, setNavbarTitle, useArysoftUIController } from '../../context/context';
import enums from '../../helpers/enums';
import { useAuditorsStore } from '../../hooks/useAuditorsStore';
import { getFullName } from '../../helpers/getFullName';
import Swal from 'sweetalert2';
import { Col, Container, Image, Nav, Row } from 'react-bootstrap';
import { ViewLoading } from '../../components/Loaders';

import defaultStatusProps from '../../helpers/defaultStatusProps';
import isNullOrEmpty from '../../helpers/isNullOrEmpty';
import AryDefaultStatusBadge from '../../components/AryDefaultStatusBadge/AryDefaultStatusBadge';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLandmark } from '@fortawesome/free-solid-svg-icons';

import imgHeaderBackground from '../../assets/img/bgWavesWhite.jpg';
import defaultProfile from '../../assets/img/phoDefaultProfile.jpg';
import envVariables from '../../helpers/envVariables';
import AuditorDocumentsCard from './components/AuditorDocumentsCard';
import auditorValidityProps from './helpers/auditorValidityProps';
import AuditorStandardsCard from './components/AuditorStandardsCard';
import AuditorEditCard from './components/AuditorEditCard';
import { useCatAuditorDocumentsStore } from '../../hooks/useCatAuditorDocumentsStore';
import auditorRequiredProps from './helpers/auditorRequiredProps';

const AuditorEditView = () => {
    const {
        URL_AUDITOR_FILES,
        VITE_FILES_URL,
    } = envVariables();
    const {
        CatAuditorDocumentOrderType,
        DefaultStatusType,
    } = enums();

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();

    const {
        isAuditorLoading,
        auditor,
        auditorsErrorMessage,

        auditorAsync,
    } = useAuditorsStore();

    const {
        catAuditorDocumentsAsync,
    } = useCatAuditorDocumentsStore();

    // HOOKS

    const { id } = useParams();

    const [photoPreview, setPhotoPreview] = useState(null);
    const [navOptions, setNavOptions] = useState("standards-list");
    const [fullName, setFullName] = useState("(new auditor)");

    useEffect(() => {
        setHelpContent(dispatch, null);
    }, []);
    

    useEffect(() => {
        if (!!id) {
            auditorAsync(id);
            catAuditorDocumentsAsync({
                status: DefaultStatusType.active,
                pageSize: 0,
                order: CatAuditorDocumentOrderType.documentType,
            });
        }
    }, [id]);

    useEffect(() => {
        if (!!auditor) {
            const name = getFullName(auditor);
            setNavbarTitle(dispatch, name);

            if (!isNullOrEmpty(name)) setFullName(name);
        }
    }, [auditor]);

    useEffect(() => {
        if (!!auditorsErrorMessage) {
            Swal.fire('Auditor', auditorsErrorMessage, 'error');
        }
    }, [auditorsErrorMessage]);

    // METHODS

    const actualizarPhotoPreview = (value) => {
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
                    <span className={`mask bg-gradient-${isAuditorLoading || !auditor ? 'dark' : defaultStatusProps[auditor.Status].bgColor} opacity-6`} />
                </div>
                <div className="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                    <Row className="gx-4">
                        <div className="col-auto">
                            <div className="avatar avatar-xl position-relative">
                                <Image
                                    src={!!photoPreview
                                        ? photoPreview
                                        : !!auditor && !!auditor.PhotoFilename
                                            ? `${VITE_FILES_URL}${URL_AUDITOR_FILES}/${auditor.ID}/${auditor.PhotoFilename}`
                                            : defaultProfile
                                    }
                                    className="border-radius-md"
                                    alt="Profile photo"
                                />
                            </div>
                        </div>
                        <div className="col-auto my-auto">
                            <div className="h-100">
                                <h5 className="mb-1">
                                    {fullName}
                                </h5>
                                <p className="mb-0 font-weight-bold text-sm">
                                    Auditor's profile
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3 text-end">
                            <AryDefaultStatusBadge value={!!auditor ? auditor.Status : DefaultStatusType.nothing} />
                        </div>
                    </Row>
                </div>
            </Container>
            <Container fluid className="py-4 px-0 px-sm-4">
                {
                    isAuditorLoading ? (
                        <ViewLoading />
                    ) : !!auditor && (
                        <Row>
                            <Col xs="12" sm="6" xxl="4">
                                <AuditorEditCard
                                    actualizarPhotoPreview={actualizarPhotoPreview}
                                />
                            </Col>
                            <Col xs="12" sm="6" xxl="8">
                                <div className="nav-wrapper position-relative end-0 mb-3">
                                    <Nav
                                        activeKey={navOptions}
                                        onSelect={(selectedKey) => setNavOptions(selectedKey)}
                                        variant="pills"
                                        className="nav-fill p-1"
                                        role="tablist"
                                    >
                                        <Nav.Item>
                                            <Nav.Link className="mb-0 px-0 py-1" eventKey="standards-list">
                                                <FontAwesomeIcon icon={faLandmark} className="text-dark me-2" />
                                                Standards
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link className="mb-0 px-0 py-1" eventKey="document-checklist">
                                                <FontAwesomeIcon
                                                    icon={auditorValidityProps[auditor.ValidityStatus].iconFile}
                                                    className={`me-2 text-${auditorValidityProps[auditor.ValidityStatus].variant}`}
                                                    title={auditorValidityProps[auditor.ValidityStatus].label}
                                                />
                                                <FontAwesomeIcon
                                                    icon={auditorRequiredProps[auditor.RequiredStatus].icon}
                                                    className={`me-2 text-${auditorRequiredProps[auditor.RequiredStatus].variant}`}
                                                    title={auditorRequiredProps[auditor.RequiredStatus].label}
                                                />
                                                Documents Checklist
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                                { navOptions == "standards-list" && <AuditorStandardsCard /> }
                                { navOptions == "document-checklist" && <AuditorDocumentsCard /> }
                            </Col>
                        </Row>
                    )
                }
            </Container>
        </>
    )
}

export default AuditorEditView