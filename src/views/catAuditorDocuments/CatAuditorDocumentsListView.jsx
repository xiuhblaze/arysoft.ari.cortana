import { Card, Col, Container, Row } from 'react-bootstrap';
import envVariables from '../../helpers/envVariables';
import enums from '../../helpers/enums';
import { setNavbarTitle, useArysoftUIController } from '../../context/context';
import { useCatAuditorDocumentsStore } from '../../hooks/useCatAuditorDocumentsStore';
import AryPagination from '../../components/AryPagination/AryPagination';
import AryListStatistics from '../../components/AryListStatistics/AryListStatistics';
import { useEffect } from 'react';
import CatAuditorDocumentsTable from './components/CatAuditorDocumentsTable';
import CatAuditorDocumentsToolbar from './components/CatAuditorDocumentsToolbar';

const CatAuditorDocumentsListView = () => {
    const {
        CATAUDITORDOCUMENTS_OPTIONS,
        VITE_PAGE_PAGESIZE,
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

    // HOOKS

    useEffect(() => {
        const savedSearch = JSON.parse(localStorage.getItem(CATAUDITORDOCUMENTS_OPTIONS)) || null;
        const newSearch = {
            pageSize: savedSearch?.pageSize ?? VITE_PAGE_PAGESIZE,
            pageNumber: 1,
            order: savedSearch?.order ?? CatAuditorDocumentOrderType.documentType
        };
        const search = savedSearch ?? newSearch;

        catAuditorDocumentsAsync(search);
        localStorage.setItem(CATAUDITORDOCUMENTS_OPTIONS, JSON.stringify(search));
        
        setNavbarTitle(dispatch, null);
    }, []);
    

    // METHODS

    const onClickGoPage = (page = 1) => {
        const savedSearch = JSON.parse(localStorage.getItem(CATAUDITORDOCUMENTS_OPTIONS)) || null;
        const search = {
            ...savedSearch,
            pageNumber: page,
        };

        catAuditorDocumentsAsync(search);
        localStorage.setItem(CATAUDITORDOCUMENTS_OPTIONS, JSON.stringify(search));
    }; // onClickGoPage

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
                                    onClickGoPage={ onClickGoPage }
                                />
                            )}
                            <CatAuditorDocumentsTable />
                            { !!catAuditorDocumentsMeta && (
                                <>
                                    <AryPagination
                                        currentPage={catAuditorDocumentsMeta.CurrentPage}
                                        totalPages={catAuditorDocumentsMeta.TotalPages}
                                        onClickGoPage={ onClickGoPage }
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