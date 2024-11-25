import React, { useEffect } from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import { useSitesStore } from '../../../hooks/useSiteStore'
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore'
import { ViewLoading } from '../../../components/Loaders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faEdit } from '@fortawesome/free-solid-svg-icons'
import EditSiteModal from './EditSiteModal'
import enums from '../../../helpers/enums'

const SitesCard = ({ readonly = false, ...props }) => {
    const statusStyle = [
        'bg-light opacity-6',
        '',
        'opacity-6',
        'bg-light opacity-6',
    ];

    const { SiteOrderType } = enums();

    // CUSTOM HOOKS

    const {
        organization
    } = useOrganizationsStore();

    const { 
        isSitesLoading, 
        sites,
        sitesAsync
    } = useSitesStore();

    // HOOKS

    useEffect(() => {
        if (!!organization) {
            sitesAsync({
                organizationID: organization.ID,
                pageSize: 0,
                order: SiteOrderType.isMainSiteDesc,
            });
        }
    }, [organization]);
    

    return (
        <Card className="h-100">
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h6>Sites</h6>
                    {
                        !readonly && <EditSiteModal />
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

                                    return (
                                        <ListGroup.Item key={ item.ID }
                                            className={ itemStyle }
                                            title={ item.IsMainSite ? 'Is main site' : '' }
                                        >
                                            <div className="d-flex align-items-center me-2">
                                                <div>
                                                    <div className="icon icon-sm icon-shape bg-gradient-info border-radius-md d-flex align-items-center justify-content-center me-3">
                                                        <FontAwesomeIcon icon={ faBuilding } size="lg" className="opacity-10 text-white" aria-hidden="true" />
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-start flex-column justify-content-center">
                                                    <h6 className="mb-0 text-sm">{ item.Description }</h6>
                                                    <p className="mb-0 text-xs d-flex flex-column gap-1">{ item.Address }</p>
                                                </div>
                                            </div>
                                            <div>
                                                {
                                                    !readonly && <EditSiteModal id={ item.ID } />
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
        </Card>
    )
}

export default SitesCard