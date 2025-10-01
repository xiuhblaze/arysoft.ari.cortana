import { useEffect } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

import { setHelpContent, setNavbarTitle, useArysoftUIController } from '../../context/context';
import { useCatAuditorDocumentsStore } from '../../hooks/useCatAuditorDocumentsStore';
import AryListStatistics from '../../components/AryListStatistics/AryListStatistics';
import AryPagination from '../../components/AryPagination/AryPagination';
import CatAuditorDocumentsTable from './components/CatAuditorDocumentsTable';
import CatAuditorDocumentsToolbar from './components/CatAuditorDocumentsToolbar';
import enums from '../../helpers/enums';
import envVariables from '../../helpers/envVariables';
import Swal from 'sweetalert2';
import { useViewNavigation } from '../../hooks/useViewNavigation';

const CatAuditorDocumentsListView = () => {    
    const {
        CATAUDITORDOCUMENTS_OPTIONS,
    } = envVariables();

    const {
        CatAuditorDocumentOrderType
    } = enums();

    // CUSTOM HOOKS

    const [controller, dispatch] = useArysoftUIController();
    const {
        catAuditorDocumentsMeta,
        catAuditorDocumentsAsync,
        catAuditorDocumentsErrorMessage,
    } = useCatAuditorDocumentsStore();
    const {
        onSearch,
        onPageChange
    } = useViewNavigation({
        LS_OPTIONS: CATAUDITORDOCUMENTS_OPTIONS,
        DefultOrder: CatAuditorDocumentOrderType.documentType,
        itemsAsync: catAuditorDocumentsAsync,
    });

    // HOOKS

    useEffect(() => {
        // const savedSearch = JSON.parse(localStorage.getItem(CATAUDITORDOCUMENTS_OPTIONS)) || null;
        // const newSearch = {
        //     pageSize: savedSearch?.pageSize ?? VITE_PAGE_PAGESIZE,
        //     pageNumber: 1,
        //     order: savedSearch?.order ?? CatAuditorDocumentOrderType.documentType
        // };
        // const search = savedSearch ?? newSearch;

        // catAuditorDocumentsAsync(search);
        // localStorage.setItem(CATAUDITORDOCUMENTS_OPTIONS, JSON.stringify(search));
        onSearch();        
        setNavbarTitle(dispatch, null);
        setHelpContent(dispatch, null);
    }, []);

    useEffect(() => {
        if (!!catAuditorDocumentsErrorMessage) {
            Swal.fire('Auditor\'s documents', catAuditorDocumentsErrorMessage, 'error');
        }
    }, [catAuditorDocumentsErrorMessage]);
    
    // METHODS

    // const onClickGoPage = (page = 1) => {
    //     const savedSearch = JSON.parse(localStorage.getItem(CATAUDITORDOCUMENTS_OPTIONS)) || null;
    //     const search = {
    //         ...savedSearch,
    //         pageNumber: page,
    //     };

    //     catAuditorDocumentsAsync(search);
    //     localStorage.setItem(CATAUDITORDOCUMENTS_OPTIONS, JSON.stringify(search));
    // }; // onClickGoPage

    return (
        <Container fluid className="py-4 px-0 px-sm-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header className="pb-0">
                            <CatAuditorDocumentsToolbar />
                        </Card.Header>
                        <Card.Body className="px-0 pt-0 pb-2">
                            { !!catAuditorDocumentsMeta && (
                                <AryPagination
                                    currentPage={catAuditorDocumentsMeta.CurrentPage}
                                    totalPages={catAuditorDocumentsMeta.TotalPages}
                                    onClickGoPage={ onPageChange }
                                />
                            )}
                            <CatAuditorDocumentsTable />
                            { !!catAuditorDocumentsMeta && (
                                <>
                                    <AryPagination
                                        currentPage={catAuditorDocumentsMeta.CurrentPage}
                                        totalPages={catAuditorDocumentsMeta.TotalPages}
                                        onClickGoPage={ onPageChange }
                                    />
                                    <AryListStatistics
                                        meta={ catAuditorDocumentsMeta }
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

export default CatAuditorDocumentsListView