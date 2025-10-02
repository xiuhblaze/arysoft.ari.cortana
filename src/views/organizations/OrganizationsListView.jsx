import { useEffect } from "react";
import Swal from 'sweetalert2';

import { Card, Col, Container, Row } from "react-bootstrap";
import { setHelpContent, setNavbarTitle, useArysoftUIController } from "../../context/context";
import { useOrganizationsStore } from "../../hooks/useOrganizationsStore";
import { useViewNavigation } from "../../hooks/useViewNavigation";
import AryListStatistics from "../../components/AryListStatistics/AryListStatistics";
import AryPagination from "../../components/AryPagination/AryPagination";
import enums from "../../helpers/enums";
import envVariables from "../../helpers/envVariables";
import Helper from "../../components/Helper/Helper";
import OrganizationsTableList from "./components/OrganizationsTableList";
import OrganizationsToolbar from "./components/OrganizationsToolbar";

const OrganizationsListView = () => {    
    const { ORGANIZATIONS_OPTIONS } = envVariables();
    const { OrganizationOrderType } = enums();
    
    // CUSTOM HOOKS
    
    const [controller, dispatch] = useArysoftUIController();
    const {
        organizationsMeta,
        organizationsErrorMessage,
        organizationsAsync,
    } = useOrganizationsStore();
    const {
        onSearch,
        onPageChange
    } = useViewNavigation({
        LS_OPTIONS: ORGANIZATIONS_OPTIONS,
        DefultOrder: OrganizationOrderType.folioDesc,
        itemsAsync: organizationsAsync,
    });

    // HOOKS

    useEffect(() => {

        onSearch();
        setNavbarTitle(dispatch, null);
        setHelpContent(dispatch, <Helper title="Organizations" url="/help/" filename="organizationsHelp.md" />);
    }, []);

    useEffect(() => {
        if (!!organizationsErrorMessage) {
            Swal.fire('Organizations', organizationsErrorMessage, 'error');
        }
    }, [organizationsErrorMessage]);

    // METHODS

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
                                        onClickGoPage={onPageChange}
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

export default OrganizationsListView;