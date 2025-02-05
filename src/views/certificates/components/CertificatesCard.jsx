import { Alert, Card, ListGroup, Spinner } from 'react-bootstrap';
import { useCertificatesStore } from '../../../hooks/useCertificatesStore';
import { useEffect, useState } from 'react'
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore';
import CertificateEditModal from './CertificateEditModal';
import CertificatesCardListItem from './CertificatesCardListItem';
import enums from '../../../helpers/enums';
import Swal from 'sweetalert2';
import certificateValidityStatusProps from '../helpers/certificateValidityStatusProps';
import certificateActionPLanValidityStatusProps from '../helpers/certificateActionPlanValidityStatusProps';

const CertificatesCard = ({ readOnly = false, ...props }) => {
    const { CertificateOrderType } = enums();    
    const statusStyle = [

    ];

    const {
        DefaultStatusType,
        DefaultValidityStatusType,
    } = enums()


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

    const [certificateValidityStatus, setCertificateValidityStatus] = useState(DefaultValidityStatusType.nothing);
    const [certificateActionPlanValidityStatus, setCertificateActionPlanValidityStatus] = useState(DefaultValidityStatusType.nothing);

    useEffect(() => {
        if (!!organization) {
            certificatesAsync({
                organizationID: organization.ID,
                pageSize: 0,
                order: CertificateOrderType.dateDesc,
            });

            // setCertificateActionPlanValidityStatus(getCertificateActionPlanValidityStatus(organization));
        }
    }, [organization]);

    useEffect(() => {
        if (!!certificates) {
            setCertificateValidityStatus(getCertificateValidityStatus(certificates));
            setCertificateActionPlanValidityStatus(getCertificateActionPlanValidityStatus(certificates));
        }
    }, [certificates]);
    

    useEffect(() => {
        if (!!certificatesErrorMessage) {
            Swal.fire('Certificates', certificatesErrorMessage, 'error');
        }
    }, [certificatesErrorMessage]);

    // METHODS

    const getCertificateValidityStatus = (items) => {
        if (!items) return DefaultValidityStatusType.nothing;
        
        let status = DefaultValidityStatusType.success;

        items.some(item => {
            if (item.ValidityStatus == DefaultValidityStatusType.danger && item.Status == DefaultStatusType.active)
            {
                status = DefaultValidityStatusType.danger;
                return true;
            }
            return false;
        });

        if (status != DefaultValidityStatusType.danger) { // Si no hay expirados, que busque los warning
            items.some(item => {
                if (item.ValidityStatus == DefaultValidityStatusType.warning && item.Status == DefaultStatusType.active) {
                    status = DefaultValidityStatusType.warning;
                    return true;    
                }
                return false;
            });
        }

        return status;
    } // getCertificateValidityStatus

    const getCertificateActionPlanValidityStatus = (items) => {

        if (!items) return DefaultValidityStatusType.nothing;
        
        let status = DefaultValidityStatusType.success;

        items.some(item => {
            //console.log(item.StandardName);
            if (item.AuditPlanValidityStatus == DefaultValidityStatusType.danger)
            {
                status = DefaultValidityStatusType.danger;
                return true; // se debe de salir del some
            } 
            return false; // no debe de salir del some
        });

        if (status != DefaultValidityStatusType.danger)
        {
            items.some(item => {                
                if (item.AuditPlanValidityStatus == DefaultValidityStatusType.warning) {
                    status = DefaultValidityStatusType.warning;
                    return true; // se debe de salir del some
                }
                return false; // no debe de salir del some
            });
        }
        
        //console.log(status);

        return status;
    } // getCertificateActionPlanValidityStatus

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
                    ) : !!certificates &&
                        <>
                            { 
                                !!certificates 
                                    && certificateValidityStatus != DefaultValidityStatusType.nothing 
                                    && certificateValidityStatus != DefaultValidityStatusType.success 
                                    && 
                                <Alert variant={ certificateValidityStatusProps[certificateValidityStatus].variant } className="text-white text-xs mb-0" closeVariant="white" dismissible>
                                    { certificateValidityStatusProps[certificateValidityStatus].label }
                                </Alert>
                            }
                            {
                                !!certificates
                                    && certificateActionPlanValidityStatus != DefaultValidityStatusType.nothing
                                    && certificateActionPlanValidityStatus != DefaultValidityStatusType.success
                                    &&
                                <Alert variant={ certificateActionPLanValidityStatusProps[certificateActionPlanValidityStatus].variant } className="text-white text-xs mb-0" closeVariant="white" dismissible>
                                    { certificateActionPLanValidityStatusProps[certificateActionPlanValidityStatus].label }
                                </Alert>

                            }
                            <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {
                                    certificates.map(item => 
                                        <CertificatesCardListItem key={item.ID} item={item} readOnly={readOnly} />
                                    )
                                }
                            </ListGroup>
                        </>
                }
            </Card.Body>
        </Card>
    )
}

export default CertificatesCard;