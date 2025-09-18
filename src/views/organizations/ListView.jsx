import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';

import envVariables from "../../helpers/envVariables";
import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import enums from "../../helpers/enums";

import { useOrganizationsStore } from "../../hooks/useOrganizationsStore";
import { Card, Col, Container, Row } from "react-bootstrap";
import AryPagination from "../../components/AryPagination/AryPagination";
import OrganizationsTableList from "./components/OrganizationsTableList";
import OrganizationsToolbar from "./components/OrganizationsToolbar";
import AryListStatistics from "../../components/AryListStatistics/AryListStatistics";

const ListView = () => {
    //const navigate = useNavigate();
    const {
        ORGANIZATIONS_OPTIONS,
        VITE_PAGE_SIZE,
    } = envVariables();
    const { OrganizationOrderType } = enums();
    
    // CUSTOM HOOKS
    
    const [controller, dispatch] = useArysoftUIController();
    const {
        organizationsMeta,
        organization,
        organizationCreatedOk,
        organizationsErrorMessage,
        organizationsAsync,
    } = useOrganizationsStore();

    // HOOKS

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
        const newSearch = {
            // pageSize: savedSearch?.pageSize ? savedSearch.pageSize : VITE_PAGE_SIZE,
            pageNumber: 1,
            order: savedSearch?.order ? savedSearch.order : OrganizationOrderType.folioDesc,
        };

        const search = !!savedSearch ? savedSearch : newSearch;

        organizationsAsync(search);
        localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));

        setNavbarTitle(dispatch, null);
    }, []);

    useEffect(() => {
        if (!!organizationsErrorMessage) {
            Swal.fire('Organizations', organizationsErrorMessage, 'error');
        }
    }, [organizationsErrorMessage]);

    // METHODS

    const onClickGoPage = (page = 1) => {
        const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            pageNumber: page,
        };

        organizationsAsync(search);
        localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));
    }; // onClickGoPage

    // const onClickOrderList = (order = OrganizationOrderType.name) => {
    //     const savedSearch = JSON.parse(localStorage.getItem(ORGANIZATIONS_OPTIONS)) || null;
    //     const search = {
    //         ...savedSearch,
    //         order: order
    //     }

    //     organizationsAsync(search);
    //     localStorage.setItem(ORGANIZATIONS_OPTIONS, JSON.stringify(search));
    // }; // onClickOrderList

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="pb-0">
                            <OrganizationsToolbar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            {/* {!!organizationsMeta && (
                                <AryPagination
                                    currentPage={organizationsMeta.CurrentPage}
                                    totalPages={organizationsMeta.TotalPages}
                                    onClickGoPage={onClickGoPage}
                                />
                            )} */}
                            <OrganizationsTableList />
                            {!!organizationsMeta && (
                                <>
                                    <AryPagination
                                        currentPage={organizationsMeta.CurrentPage}
                                        totalPages={organizationsMeta.TotalPages}
                                        onClickGoPage={onClickGoPage}
                                        className="mt-2"
                                    />
                                    <AryListStatistics meta={organizationsMeta} className="my-3" />
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ListView