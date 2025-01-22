import React, { useEffect, useState } from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import { useSitesStore } from '../../../hooks/useSiteStore'
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore'
import { ViewLoading } from '../../../components/Loaders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faLocationDot, faLocationPin } from '@fortawesome/free-solid-svg-icons'
import EditSiteModal from './EditSiteModal'
import enums from '../../../helpers/enums'
import Swal from 'sweetalert2'
import isNullOrEmpty from '../../../helpers/isNullOrEmpty'

const SitesCard = ({ readOnly = false, ...props }) => {
    const statusStyle = [
        'bg-light opacity-6',
        '',
        'opacity-6',
        'bg-light opacity-6',
    ];

    const {
        DefaultStatusType,
        SiteOrderType, 
    } = enums();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const { 
        isSitesLoading, 
        sites,
        sitesAsync,
        sitesErrorMessage,
    } = useSitesStore();

    // HOOKS

    const [totalEmployees, setTotalEmployees] = useState(0);

    useEffect(() => {
        if (!!organization) {
            sitesAsync({
                organizationID: organization.ID,
                pageSize: 0,
                order: SiteOrderType.isMainSiteDesc,
            });
        }
    }, [organization]);

    useEffect(() => {
        if (!!sites) {
            const total = sites
                .filter(item => item.Status === DefaultStatusType.active)
                .reduce((sum, item) => sum + item.EmployeesCount, 0);
            setTotalEmployees(total);
        }
    }, [sites]);
    
    useEffect(() => {
        if (!!sitesErrorMessage) {
            Swal.fire('Sites', sitesErrorMessage, 'error');
        }
    }, [sitesErrorMessage]);

    return (
        <Card {...props} className="h-100">
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h6>Sites</h6>
                    {
                        !readOnly && <EditSiteModal />
                    }
                </div>
            </Card.Header>
            <Card.Body className="p-3">
                {
                    isSitesLoading ? (
                        <ViewLoading />
                    ) : !!sites ? (
                        <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {
                                sites.map( item => {
                                    const itemStyle= `border-0 d-flex justify-content-between align-items-center px-0 mb-2 ${ statusStyle[item.Status] }`;
                                    const iconBg = item.IsMainSite ? 'bg-gradient-info' : 'bg-gradient-secondary';
                                    return (
                                        <ListGroup.Item key={ item.ID }
                                            className={ itemStyle }
                                            title={ item.IsMainSite ? 'Is main site' : '' }
                                        >
                                            <div className="d-flex align-items-top me-2">
                                                <div>
                                                    <div className={`icon icon-md icon-shape ${iconBg} border-radius-md d-flex align-items-center justify-content-center me-3`}>
                                                        <FontAwesomeIcon icon={ faBuilding } size="lg" className="opacity-10 text-white" aria-hidden="true" />
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className={`mb-0 text-sm ${ item.IsMainSite ? 'text-info text-gradient' : '' }`}>
                                                        { !isNullOrEmpty(item.LocationURL)
                                                            ? <a href={ item.LocationURL } target="_blank" title="See address in maps">
                                                                <FontAwesomeIcon icon={ faLocationDot } className="text-dark" fixedWidth />
                                                            </a>
                                                            : <FontAwesomeIcon icon={ faLocationPin } className="text-secondary" fixedWidth />
                                                        }
                                                        { item.Description }
                                                    </h6>
                                                    <p className="mb-0 text-xs">{ item.Address }</p>
                                                    <p className="text-xs font-weight-bold">Employes: { item.EmployeesCount } | Shifts: { item.ShiftsCount }</p>
                                                </div>
                                            </div>
                                            <div>
                                                {
                                                    !readOnly && <EditSiteModal id={ item.ID } />
                                                }
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })
                            }
                        </ListGroup>
                    ) : null
                }
            </Card.Body>
            <Card.Footer className="pt-0">
                <h6 className="text-sm mb-0">Total employees: { totalEmployees }</h6>
            </Card.Footer>
        </Card>
    )
}

export default SitesCard