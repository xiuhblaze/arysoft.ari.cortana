import React, { useEffect } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap';
import envVariables from '../../helpers/envVariables';
import { setHelpContent, setNavbarTitle, useArysoftUIController } from '../../context/context';
import enums from '../../helpers/enums';
import { useAuditorsStore } from '../../hooks/useAuditorsStore';
import Swal from 'sweetalert2';
import AryPagination from '../../components/AryPagination/AryPagination';
import AuditorsTable from './components/AuditorsTable';
import AuditorsToolbar from './components/AuditorsToolbar';
import AryListStatistics from '../../components/AryListStatistics/AryListStatistics';

const AuditorsListView = () => {
    const { 
        AUDITORS_OPTIONS,
        VITE_PAGE_SIZE,
    } = envVariables();

    const { AuditorOrderType } = enums();
    
    // CUSTOM HOOKS
    
    const [controller, dispatch] = useArysoftUIController();
    const {
        auditorsMeta,
        auditorsAsync,
        auditorsErrorMessage,
    } = useAuditorsStore();

    // HOOKS

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITORS_OPTIONS)) || null;
        const newSearch = {
            pageSize: savedSearch?.pageSize 
                ? savedSearch.pageSize 
                : VITE_PAGE_SIZE,
            pageNumber: 1,
            order: savedSearch?.order 
                ? savedSearch.order
                : AuditorOrderType.firstName, 
        };
        const search = !!savedSearch ? savedSearch : newSearch;

        auditorsAsync(search);
        localStorage.setItem(AUDITORS_OPTIONS, JSON.stringify(search));

        setNavbarTitle(dispatch, null);
        setHelpContent(dispatch, null);
    }, []);

    useEffect(() => {
        if (!!auditorsErrorMessage) {
            Swal.fire('Auditors', auditorsErrorMessage, 'error');
        }
    }, [auditorsErrorMessage]);
    
    // METHODS

    const onClickGoPage = (page = 1) => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITORS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            pageNumber: page
        };

        auditorsAsync(search);
        localStorage.setItem(AUDITORS_OPTIONS, JSON.stringify(search));
    }; // onClickGoPage

    const onClickOrderList = (order = AuditorOrderType.firstName) => {
        const savedSearch = JSON.parse(localStorage.getItem(AUDITORS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            order: order
        };

        auditorsAsync(search);
        localStorage.setItem(AUDITORS_OPTIONS, JSON.stringify(search));
    }; // onClickOrderList

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            <AuditorsToolbar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            { !!auditorsMeta && (
                                <AryPagination
                                    currentPage={auditorsMeta.CurrentPage}
                                    totalPages={auditorsMeta.TotalPages}
                                    onClickGoPage={ onClickGoPage }
                                />
                            )}
                            <AuditorsTable onOrder={onClickOrderList} />
                            { !!auditorsMeta && (
                                <>
                                    <AryPagination
                                        currentPage={auditorsMeta.CurrentPage}
                                        totalPages={auditorsMeta.TotalPages}
                                        onClickGoPage={ onClickGoPage }
                                    />
                                    <AryListStatistics 
                                        meta={auditorsMeta}
                                        className="my-3" 
                                    />
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default AuditorsListView;