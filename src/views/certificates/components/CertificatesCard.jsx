import { Card, ListGroup, Spinner } from 'react-bootstrap';
import { useCertificatesStore } from '../../../hooks/useCertificatesStore';
import { useEffect } from 'react'
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import CertificateEditModal from './CertificateEditModal';
import CertificatesCardListItem from './CertificatesCardListItem';
import enums from '../../../helpers/enums';
import envVariables from '../../../helpers/envVariables';
import Swal from 'sweetalert2';

const CertificatesCard = ({ readOnly = false, ...props }) => {
    const { CertificateOrderType } = enums();
    const {
        VITE_FILES_URL,
        URL_ORGANIZATION_FILES,
    } = envVariables();
    const statusStyle = [

    ];

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
                            {
                                certificates.map(item => 
                                    <CertificatesCardListItem key={item.ID} item={item} readOnly={readOnly} />
                                )
                            }
                        </ListGroup>
                    ) : null
                }
            </Card.Body>
        </Card>
    )
}

export default CertificatesCard;