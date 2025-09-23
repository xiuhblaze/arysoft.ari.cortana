import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import Swal from 'sweetalert2';

import envVariables from "../../helpers/envVariables";
import { setNavbarTitle, useArysoftUIController } from "../../context/context";
import enums from "../../helpers/enums";

import AryPagination from "../../components/AryPagination/AryPagination";
import NaceTableList from "./components/NaceTableList";
import NacecodesToolbar from "./components/NacecodesToolbar";
import useNacecodesStore from "../../hooks/useNaceCodesStore";
import AryListStatistics from "../../components/AryListStatistics/AryListStatistics";
import { useViewNavigation } from "../../hooks/useViewNavigation";
import { useAuthStore } from "../../hooks/useAuthStore";

export const NacecodesListView = () => {
    const navigate = useNavigate();
    const { NACECODES_OPTIONS } = envVariables();
    const { 
        NacecodeOrderType,
        UserSettingSearchModeType,
    } = enums();

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();
    const {
        userSettings,
    } =useAuthStore();
    const {
        nacecodesMeta,
        nacecode,
        nacecodeCreatedOk,
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
        if (nacecodeCreatedOk) {
            navigate(`/nace-codes/${nacecode.ID}`);
        }
    }, [nacecodeCreatedOk]);

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
