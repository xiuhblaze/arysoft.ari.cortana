import React, { useEffect } from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import { useSitesStore } from '../../../hooks/useSiteStore'
import { useOrganizationsStore } from '../../../hooks/useOrganizationsStore'
import { ViewLoading } from '../../../components/Loaders'

const SitesCard = ({ readonly = false, ...props }) => {
    const statusStyle = [
        'bg-light opacity-6',
        '',
        'opacity-6',
        'bg-light opacity-6',
    ];

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
            });
        }
    }, [organization]);
    

    return (
        <Card className="h-100">
            <Card.Header className="pb-0 p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h6>Sites</h6>
                    {
                        !readonly && <div>EditSiteModal</div>
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
                                                { item.Description }
                                                { item.Address }
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