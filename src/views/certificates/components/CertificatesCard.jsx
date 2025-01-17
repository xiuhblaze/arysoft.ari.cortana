import React, { useEffect } from 'react'
import { Card, ListGroup, Spinner } from 'react-bootstrap';
import { useCertificatesStore } from '../../../hooks/useCertificatesStore';
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import enums from '../../../helpers/enums';
import Swal from 'sweetalert2';
import envVariables from '../../../helpers/envVariables';
import { checkFileExists } from '../../../helpers/checkFileExists';
import defaultProfile from '../../../assets/img/phoDefaultProfile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faNoteSticky, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import CertificateEditModal from './CertificateEditModal';

const CertificatesCard = ({ readOnly = false, ...props }) => {
    const { CertificateOrderType } = enums();
    const {
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
    } = envVariables();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const {
        isCertificatesLoading,
        certificates,
        certificatesAsync,
        certificatesErrorMessage,
    } = useCertificatesStore();

    // HOOKS

    useEffect(() => {
        if (!!organization) {
            certificatesAsync({
                organizationID: organization.ID,
                pageSize: 0,
                order: CertificateOrderType.dateDesc,
            });
        }
    }, [organization]);

    useEffect(() => {
        if (!!certificatesErrorMessage) {
            Swal.fire('Certificates', certificatesErrorMessage, 'error');
        }
    }, [certificatesErrorMessage]);

    return (
        <Card {...props} className="h-100">
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Certificates</h6>
                    { !readOnly && <CertificateEditModal /> }
                </div>
            </Card.Header>
            <Card.Body className='p-3'>
                {
                    isCertificatesLoading ? (
                        <Spinner animation="border" variant="secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : !!certificates ? (
                        <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <ListGroup.Item className="border-0 d-flex justify-content-between align-items-center px-0 mb-2">
                                <div className="d-flex align-items-top me-2">
                                    <div>
                                        <div className={`icon icon-md icon-shape bg-gradient-warning border-radius-md d-flex align-items-center justify-content-center me-3`}>
                                            <FontAwesomeIcon icon={faCertificate} size="lg" className="opacity-10 text-white" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start flex-column justify-content-center">
                                        <h6 className="mb-0 text-sm">
                                            <FontAwesomeIcon icon={ faPaperclip } className="text-info me-1" />
                                            ISO 9000:2015
                                        </h6>
                                        <p className="text-xs font-weight-bold mb-0">Start: 00/00/0000 | Due: 00/00/0000</p>
                                        <div className="d-flex justify-content-between align-items-center gap-1">
                                            <div className="text-xs">
                                                <FontAwesomeIcon icon={ faNoteSticky } className='me-1' />
                                                Prev audit: 00/00/0000
                                            </div>
                                            <div className="text-xs">
                                                <FontAwesomeIcon icon={ faNoteSticky } className='text-warning me-1' />
                                                Next audit: 00/00/0000
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item>
                            {
                                certificates.map(item => {
                                    const url = `${VITE_FILES_URL}${URL_ORGANIZATION_FILES}/${organization.ID}/certificates`;
                                    const fileName = !!item.Filename && checkFileExists(`${url}/${item.Filename}`)
                                        ? `${url}/${item.Filename}`
                                        : defaultProfile;
                                    const itemStyle = `border-0 d-flex justify-content-between align-items-center px-0 mb-2`;

                                    return (
                                        <ListGroup.Item key={item.ID}
                                            className={itemStyle}
                                        >
                                            <div className="d-flex align-items-top me-2">
                                                <div className="avatar me-3" style={{ minWidth: '48px' }}>
                                                    <img className="border-radius-md shadow" src={fileName} />
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className={`mb-0 text-sm ${item.ValidityStatus === 'success' ? 'text-info text-gradient' : ''}`}>{item.Name}</h6>
                                                    <p className="mb-0 text-xs d-flex flex-column gap-1">
                                                        <a className={item.ValidityStatus === 'success' ? 'text-dark' : 'text-secondary'} href={`mailto:${item.Email}`} title="Send mail">{item.Email}</a>
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                {!readOnly && <CertificateEditModal id={item.ID} />}
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                    ) : null
                }
            </Card.Body>
        </Card>
    )
}

export default CertificatesCard;