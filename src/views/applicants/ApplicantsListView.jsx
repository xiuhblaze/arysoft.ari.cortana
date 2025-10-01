import { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Swal from 'sweetalert2';

import { setHelpContent, setNavbarTitle, useArysoftUIController } from "../../context/context";
import { useOrganizationsStore } from "../../hooks/useOrganizationsStore";
import AryPagination from "../../components/AryPagination/AryPagination";
import enums from "../../helpers/enums";
import envVariables from "../../helpers/envVariables"
import OrganizationsTableList from "../organizations/components/OrganizationsTableList";
import OrganizationsToolbar from "../organizations/components/OrganizationsToolbar";
import { useViewNavigation } from "../../hooks/useViewNavigation";

const ApplicantsListView = () => {
    const { APPLICANTS_OPTIONS } = envVariables();    
    const {
        OrganizationStatusType,
        OrganizationOrderType,
    } = enums();

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
        LS_OPTIONS: APPLICANTS_OPTIONS,
        DefultOrder: OrganizationOrderType.updatedDesc,
        itemsAsync: organizationsAsync,
    });

    // HOOKS

    useEffect(() => {
        // const savedSearch = JSON.parse(localStorage.getItem(APPLICANTS_OPTIONS)) || null;
        // const newSearch = {
        //     status: OrganizationStatusType.applicant,
        //     pageSize: savedSearch?.pageSize ? savedSearch.pageSize : VITE_PAGE_SIZE,
        //     pageNumber: 1,
        //     order: savedSearch?.order ? savedSearch.order : OrganizationOrderType.updatedDesc,
        // };        

        // const search = !!savedSearch ? savedSearch : newSearch;

        // organizationsAsync(search);
        // localStorage.setItem(APPLICANTS_OPTIONS, JSON.stringify(search));

        onSearch({
            status: OrganizationStatusType.applicant,
        });
        setNavbarTitle(dispatch, null);
        setHelpContent(dispatch, null);
    }, []);
    
    useEffect(() => {
        if (!!organizationsErrorMessage) {
            Swal.fire('Organizations', organizationsErrorMessage, 'error');
        }
    }, [organizationsErrorMessage]);

    // METHODS

    // const onClickGoPage = (page = 1) => {
    //     const savedSearch = JSON.parse(localStorage.getItem(APPLICANTS_OPTIONS)) || null;
    //     const search = {
    //         ...savedSearch,
    //         pageNumber: page,
    //     };

    //     organizationAsync(search);
    //     localStorage.setItem(APPLICANTS_OPTIONS, JSON.stringify(search));
    // }; // onClickGoPage

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            <OrganizationsToolbar applicantsOnly />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            { !!organizationsMeta && (
                                <AryPagination
                                    currentPage={organizationsMeta.CurrentPage}
                                    totalPages={organizationsMeta.TotalPages}
                                    onClickGoPage={onPageChange}
                                />
                            )}
                            <OrganizationsTableList applicantsOnly />
                            { !!organizationsMeta && (
                                <AryPagination
                                    currentPage={organizationsMeta.CurrentPage}
                                    totalPages={organizationsMeta.TotalPages}
                                    onClickGoPage={onPageChange}
                                    className="mt-2"
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ApplicantsListView