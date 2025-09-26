import { useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Swal from 'sweetalert2';

import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import { useViewNavigation } from "../../hooks/useViewNavigation";
import AryListStatistics from "../../components/AryListStatistics/AryListStatistics";
import AryPagination from "../../components/AryPagination/AryPagination";
import enums from "../../helpers/enums";
import envVariables from "../../helpers/envVariables";
import NacecodesToolbar from "./components/NacecodesToolbar";
import NaceTableList from "./components/NaceTableList";
import useNacecodesStore from "../../hooks/useNaceCodesStore";

export const NacecodesListView = () => {
    const { NACECODES_OPTIONS } = envVariables();
    const { NacecodeOrderType } = enums();

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();    
    const {
        nacecodesMeta,
        nacecodeErrorMessage,
        nacecodesAsync,
    } = useNacecodesStore();
    const {
        onSearch,
        onPageChange
    } = useViewNavigation({
        LS_OPTIONS: NACECODES_OPTIONS,
        DefultOrder: NacecodeOrderType.sector,
        itemsAsync: nacecodesAsync,
    });

    // HOOKS

    useEffect(() => {
        onSearch();
        setNavbarTitle(dispatch, null);
    }, []);

    useEffect(() => {
        if (!!nacecodeErrorMessage) {
            Swal.fire('Nace codes', nacecodeErrorMessage, 'error');
        }
    }, [nacecodeErrorMessage]);

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            <NacecodesToolbar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            {!!nacecodesMeta && (
                                <AryPagination
                                    currentPage={nacecodesMeta.CurrentPage}
                                    totalPages={nacecodesMeta.TotalPages}
                                    onClickGoPage={onPageChange}
                                />
                            )}
                            <NaceTableList />
                            {!!nacecodesMeta && (
                                <>
                                    <AryPagination
                                        currentPage={nacecodesMeta.CurrentPage}
                                        totalPages={nacecodesMeta.TotalPages}
                                        onClickGoPage={onPageChange}
                                        className="mt-2"
                                    />
                                    <AryListStatistics meta={ nacecodesMeta } className="my-3" />
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default NacecodesListView;
