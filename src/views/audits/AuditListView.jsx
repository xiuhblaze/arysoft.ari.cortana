import { useEffect } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { setHelpContent, setNavbarTitle, useArysoftUIController } from '../../context/context';
import { useAuditNavigation } from './hooks/useAuditNavigation';
import { useAuditsStore } from '../../hooks/useAuditsStore';
import AuditsToolBar from './components/AuditsToolBar';
import AuditTableList from './components/AuditTableList';
import AryPagination from '../../components/AryPagination/AryPagination';
import AryListStatistics from '../../components/AryListStatistics/AryListStatistics';
import { useViewNavigation } from '../../hooks/useViewNavigation';
import envVariables from '../../helpers/envVariables';
import enums from '../../helpers/enums';

const AuditListView = () => {    
    const { AUDITS_OPTIONS } = envVariables();
    const { AuditOrderType } = enums();

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();
    const {
        auditsMeta,
        auditsErrorMessage,
        auditsAsync,
    } = useAuditsStore();

    // const {
    //     onSearch,
    //     onPageChange,
    // } = useAuditNavigation();
    const {
        onSearch,
        onPageChange
    } = useViewNavigation({
        LS_OPTIONS: AUDITS_OPTIONS,
        DefultOrder: AuditOrderType.dateDesc,
        itemsAsync: auditsAsync,
    });

    // HOOKS

    useEffect(() => {
        // console.log('AuditListView.useEffect[]:');   
        onSearch();

        setNavbarTitle(dispatch, null);
        setHelpContent(dispatch, null);
    }, []);

    useEffect(() => {
        if (!!auditsErrorMessage) {
            Swal.fire('Audits', auditsErrorMessage, 'error');
        }
    }, [auditsErrorMessage])


    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            <AuditsToolBar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            { !!auditsMeta ? (
                                <AryPagination
                                    currentPage={auditsMeta.CurrentPage}
                                    totalPages={auditsMeta.TotalPages}
                                    onClickGoPage={onPageChange}
                                />
                            ) : null}
                            <AuditTableList />
                            { !!auditsMeta ? (
                                <>
                                    <AryPagination
                                        currentPage={auditsMeta.CurrentPage}
                                        totalPages={auditsMeta.TotalPages}
                                        onClickGoPage={onPageChange}
                                    />
                                    <AryListStatistics meta={ auditsMeta } className="my-3" />
                                </>
                            ) : null}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AuditListView;