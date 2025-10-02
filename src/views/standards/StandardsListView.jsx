import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import { Card, Col, Container, Row } from "react-bootstrap";
import { setHelpContent, setNavbarTitle, useArysoftUIController } from "../../context/context";
import { useStandardsStore } from "../../hooks/useStandardsStore";
import { useViewNavigation } from "../../hooks/useViewNavigation";
import AryListStatistics from "../../components/AryListStatistics/AryListStatistics";
import AryPagination from "../../components/AryPagination/AryPagination";
import enums from "../../helpers/enums";
import envVariables from "../../helpers/envVariables";
import StandardsTableList from "./components/StandardsTableList";
import StandardsToolbar from "./components/StandardsToolbar";

const StandardsListView = () => {
    const navigate = useNavigate();

    const { STANDARDS_OPTIONS } = envVariables();
    const { StandardOrderType } = enums();

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();
    const {
        standardsMeta,
        standard,
        standardCreatedOk,
        standardErrorMessage,
        standardsAsync,
    } = useStandardsStore();
    const {
        onSearch,
        onPageChange,
        onOrderChange,
    } = useViewNavigation({
        LS_OPTIONS: STANDARDS_OPTIONS,
        DefultOrder: StandardOrderType.name,
        itemsAsync: standardsAsync,
    });

    // HOOKS

    useEffect(() => {
        onSearch();
        setNavbarTitle(dispatch, null);
        setHelpContent(dispatch, null);
    }, []);

    useEffect(() => {
        if (standardCreatedOk) {
            navigate(`/standards/${standard.ID}`);
        }
    }, [standardCreatedOk]);

    useEffect(() => {
        if (!!standardErrorMessage) {
            Swal.fire('Standards', standardErrorMessage, 'error');
        }
    }, [standardErrorMessage]);

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            <StandardsToolbar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            {!!standardsMeta && (
                                <AryPagination
                                    currentPage={standardsMeta.CurrentPage}
                                    totalPages={standardsMeta.TotalPages}
                                    onClickGoPage={onPageChange}
                                />
                            )}
                            <StandardsTableList onOrder={onOrderChange} />
                            {!!standardsMeta && (
                                <>
                                    <AryPagination
                                        currentPage={standardsMeta.CurrentPage}
                                        totalPages={standardsMeta.TotalPages}                                        
                                        onClickGoPage={onPageChange}
                                        className="mt-2"
                                    />
                                    <AryListStatistics meta={standardsMeta} className="my-3" />
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default StandardsListView;